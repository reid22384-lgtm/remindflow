import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { sendReminderEmail } from '@/lib/reminders';

/**
 * Vercel Cron Job: Process invoice reminders daily
 * Runs at 9:00 AM UTC every day
 *
 * Configure in vercel.json:
 * { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 9 * * *" }] }
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch all unpaid invoices that need reminders
    const { data: invoices, error } = await (supabase
      .from('invoices') as any)
      .select('*')
      .in('status', ['pending', 'overdue']);

    if (error) {
      console.error('Failed to fetch invoices:', error);
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }

    const results: Array<{ invoiceId: string; action: string; detail?: string }> = [];

    const typedInvoices = (invoices || []) as Array<{
      id: string;
      user_id: string;
      client_name: string;
      client_email: string;
      invoice_number: string;
      amount: number;
      currency: string;
      due_date: string;
      status: string;
      reminder_schedule: number[];
      reminders_sent: number;
      last_reminder_sent: string;
    }>;

    for (const invoice of typedInvoices) {
      const dueDate = new Date(invoice.due_date);
      const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

      // Skip if not yet overdue
      if (daysOverdue < 0) continue;

      // Update status to overdue if pending
      if (invoice.status === 'pending' && daysOverdue > 0) {
        await (supabase.from('invoices') as any)
          .update({ status: 'overdue' })
          .eq('id', invoice.id);
      }

      // Check if a reminder should be sent
      const schedule = invoice.reminder_schedule || [3, 7, 14, 30];
      const nextReminderDay = schedule[invoice.reminders_sent || 0];

      if (nextReminderDay && daysOverdue >= nextReminderDay) {
        // Check if we already sent a reminder today (avoid duplicates)
        if (invoice.last_reminder_sent) {
          const lastSent = new Date(invoice.last_reminder_sent);
          lastSent.setHours(0, 0, 0, 0);
          if (lastSent.getTime() === today.getTime()) {
            continue;
          }
        }

        const reminderNumber = (invoice.reminders_sent || 0) + 1;

        try {
          // Send reminder email
          await sendReminderEmail({
            to: invoice.client_email,
            clientName: invoice.client_name,
            invoiceNumber: invoice.invoice_number,
            amount: invoice.amount,
            currency: invoice.currency || 'USD',
            dueDate: invoice.due_date,
            daysOverdue,
            reminderNumber,
          });

          // Log the reminder
          await supabase.from('reminder_logs').insert({
            invoice_id: invoice.id,
            reminder_number: reminderNumber,
            status: 'sent',
          } as any);

          // Update invoice
          await (supabase.from('invoices') as any)
            .update({
              reminders_sent: reminderNumber,
              last_reminder_sent: today.toISOString(),
            })
            .eq('id', invoice.id);

          results.push({
            invoiceId: invoice.id,
            action: 'reminder_sent',
            detail: `Reminder #${reminderNumber} sent to ${invoice.client_email} (${daysOverdue} days overdue)`,
          });
        } catch (emailError) {
          console.error(`Failed to send reminder for invoice ${invoice.id}:`, emailError);

          // Log the failure
          await supabase.from('reminder_logs').insert({
            invoice_id: invoice.id,
            reminder_number: reminderNumber,
            status: 'failed',
            error_message: (emailError as Error).message,
          } as any);

          results.push({
            invoiceId: invoice.id,
            action: 'reminder_failed',
            detail: (emailError as Error).message,
          });
        }
      }
    }

    return NextResponse.json({
      processed: invoices?.length || 0,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
