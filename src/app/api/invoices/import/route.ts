import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseWithToken } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('sb-access-token')?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseWithToken(accessToken);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter((line) => line.trim());

    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV must have a header row and at least one data row' }, { status: 400 });
    }

    // Parse header
    const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase());

    // Map common column names
    const columnMap: Record<string, number> = {
      client_name: findColumn(headers, ['client_name', 'client', 'name', 'customer', 'customer_name', 'company']),
      client_email: findColumn(headers, ['client_email', 'email', 'customer_email', 'contact_email']),
      invoice_number: findColumn(headers, ['invoice_number', 'invoice', 'inv_no', 'invoice_id', 'number']),
      amount: findColumn(headers, ['amount', 'total', 'invoice_amount', 'total_amount', 'price', 'cost']),
      due_date: findColumn(headers, ['due_date', 'due', 'due_date', 'payment_due', 'deadline']),
      status: findColumn(headers, ['status', 'invoice_status', 'state']),
      notes: findColumn(headers, ['notes', 'description', 'memo', 'comment']),
    };

    // Validate required columns
    const required = ['client_name', 'client_email', 'invoice_number', 'amount', 'due_date'];
    const missing = required.filter((key) => columnMap[key] === -1);

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required columns: ${missing.join(', ')}`,
          hint: `Found columns: ${headers.join(', ')}`,
          mapping: columnMap,
        },
        { status: 400 }
      );
    }

    // Parse rows
    const invoices: any[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length < headers.length) continue;

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx]?.trim() || '';
      });

      const clientName = row[columnMap.client_name];
      const clientEmail = row[columnMap.client_email];
      const invoiceNumber = row[columnMap.invoice_number];
      const amountStr = row[columnMap.amount].replace(/[$,]/g, '');
      const amount = parseFloat(amountStr);
      const dueDate = row[columnMap.due_date];
      const status = columnMap.status >= 0 ? row[columnMap.status] : 'pending';
      const notes = columnMap.notes >= 0 ? row[columnMap.notes] : '';

      // Validate
      if (!clientName || !clientEmail || !invoiceNumber || isNaN(amount) || !dueDate) {
        errors.push(`Row ${i + 1}: Missing or invalid data`);
        continue;
      }

      invoices.push({
        user_id: user.id,
        client_name: clientName,
        client_email: clientEmail,
        invoice_number: invoiceNumber,
        amount,
        due_date: new Date(dueDate).toISOString().split('T')[0],
        status: status.toLowerCase() === 'paid' ? 'paid' : 'pending',
        currency: 'USD',
        notes,
      });
    }

    if (invoices.length === 0) {
      return NextResponse.json({ error: 'No valid invoices found in CSV', errors }, { status: 400 });
    }

    // Insert into database
    const { data, error } = await (supabase.from('invoices') as any).insert(invoices).select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to import invoices', details: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Successfully imported ${data.length} invoice${data.length !== 1 ? 's' : ''}`,
      imported: data.length,
      skipped: errors.length,
      errors,
      invoices: data,
    });
  } catch (error: any) {
    console.error('CSV import error:', error);
    return NextResponse.json({ error: error.message || 'Failed to import CSV' }, { status: 500 });
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function findColumn(headers: string[], candidates: string[]): number {
  for (const candidate of candidates) {
    const idx = headers.findIndex((h) => h.replace(/[\s_-]/g, '') === candidate.replace(/[\s_-]/g, ''));
    if (idx >= 0) return idx;
  }
  return -1;
}
