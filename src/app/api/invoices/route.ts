import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseWithToken } from '@/lib/supabase';

function getAuthenticatedClient(request: NextRequest) {
  const accessToken = request.cookies.get('sb-access-token')?.value;
  if (!accessToken) return null;
  return getSupabaseWithToken(accessToken);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getAuthenticatedClient(request);
    if (!supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from token
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // Fetch invoices for this user
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch invoices error:', error);
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Invoices GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getAuthenticatedClient(request);
    if (!supabase) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const body = await request.json();
    const {
      client_name,
      client_email,
      invoice_number,
      amount,
      currency = 'USD',
      issue_date,
      due_date,
      status = 'pending',
      reminder_schedule = [3, 7, 14, 30],
      notes,
    } = body;

    if (!client_name || !client_email || !invoice_number || !amount || !due_date) {
      return NextResponse.json(
        { error: 'Missing required fields: client_name, client_email, invoice_number, amount, due_date' },
        { status: 400 }
      );
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        client_name,
        client_email,
        invoice_number,
        amount,
        currency,
        issue_date: issue_date || new Date().toISOString().split('T')[0],
        due_date,
        status,
        reminder_schedule,
        notes,
      } as any)
      .select()
      .single();

    if (error) {
      console.error('Create invoice error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error) {
    console.error('Invoices POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
