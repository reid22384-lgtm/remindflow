import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend() {
  if (_resend) return _resend;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  _resend = new Resend(apiKey);
  return _resend;
}

export interface ReminderEmailParams {
  to: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  reminderNumber: number;
  companyName?: string;
}

/**
 * Generate reminder email HTML based on reminder number (tone escalates)
 */
function getReminderTemplate(params: ReminderEmailParams): { subject: string; html: string } {
  const { clientName, invoiceNumber, amount, currency, dueDate, daysOverdue, reminderNumber, companyName } = params;

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(amount);

  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const senderName = companyName || 'RemindFlow User';

  // Reminder 1: Friendly nudge (3 days overdue)
  if (reminderNumber === 1) {
    return {
      subject: `Quick reminder: Invoice ${invoiceNumber} (${formattedAmount})`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
            <tr><td style="padding:40px 20px;">
              <div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                <p style="margin:0 0 20px;font-size:16px;color:#334155;">Hi ${clientName},</p>
                <p style="margin:0 0 20px;font-size:16px;color:#334155;">
                  Just a friendly reminder that invoice <strong>${invoiceNumber}</strong> for <strong>${formattedAmount}</strong> was due on ${formattedDueDate}.
                </p>
                <p style="margin:0 0 20px;font-size:16px;color:#334155;">
                  If you've already sent the payment, please disregard this email. Otherwise, I'd appreciate it if you could process it at your earliest convenience.
                </p>
                <p style="margin:0 0 30px;font-size:16px;color:#334155;">
                  Let me know if you have any questions!
                </p>
                <p style="margin:0;font-size:16px;color:#334155;">
                  Best regards,<br/>${senderName}
                </p>
              </div>
              <p style="text-align:center;margin-top:20px;font-size:12px;color:#94a3b8;">
                This reminder was sent automatically by RemindFlow.
              </p>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    };
  }

  // Reminder 2: Slightly firmer (7 days overdue)
  if (reminderNumber === 2) {
    return {
      subject: `Following up: Invoice ${invoiceNumber} (${formattedAmount})`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
            <tr><td style="padding:40px 20px;">
              <div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
                <p style="margin:0 0 20px;font-size:16px;color:#334155;">Hi ${clientName},</p>
                <p style="margin:0 0 20px;font-size:16px;color:#334155;">
                  I'm following up on invoice <strong>${invoiceNumber}</strong> for <strong>${formattedAmount}</strong>, which was due on ${formattedDueDate} (${daysOverdue} days ago).
                </p>
                <p style="margin:0 0 20px;font-size:16px;color:#334155;">
                  I wanted to make sure this didn't slip through the cracks. Could you please confirm the payment status?
                </p>
                <p style="margin:0 0 30px;font-size:16px;color:#334155;">
                  If there's any issue with the invoice, please let me know and I'll be happy to help resolve it.
                </p>
                <p style="margin:0;font-size:16px;color:#334155;">
                  Thanks,<br/>${senderName}
                </p>
              </div>
              <p style="text-align:center;margin-top:20px;font-size:12px;color:#94a3b8;">
                This reminder was sent automatically by RemindFlow.
              </p>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    };
  }

  // Reminder 3: Firm (14 days overdue)
  if (reminderNumber === 3) {
    return {
      subject: `Overdue: Invoice ${invoiceNumber} (${formattedAmount}) - ${daysOverdue} days past due`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
            <tr><td style="padding:40px 20px;">
              <div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);border-left:4px solid #f59e0b;">
                <p style="margin:0 0 20px;font-size:16px;color:#334155;">Hi ${clientName},</p>
                <p style="margin:0 0 20px;font-size:16px;color:#334155;">
                  This is a reminder that invoice <strong>${invoiceNumber}</strong> for <strong>${formattedAmount}</strong> is now <strong>${daysOverdue} days overdue</strong> (due: ${formattedDueDate}).
                </p>
                <p style="margin:0 0 20px;font-size:16px;color:#334155;">
                  I haven't received payment yet. Please process this invoice as soon as possible to avoid any further delays.
                </p>
                <p style="margin:0 0 30px;font-size:16px;color:#334155;">
                  If there's a problem or you need to discuss payment terms, please reach out so we can work something out.
                </p>
                <p style="margin:0;font-size:16px;color:#334155;">
                  Regards,<br/>${senderName}
                </p>
              </div>
              <p style="text-align:center;margin-top:20px;font-size:12px;color:#94a3b8;">
                This reminder was sent automatically by RemindFlow.
              </p>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    };
  }

  // Reminder 4+: Final notice (30+ days overdue)
  return {
    subject: `FINAL NOTICE: Invoice ${invoiceNumber} (${formattedAmount}) - ${daysOverdue} days overdue`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
          <tr><td style="padding:40px 20px;">
            <div style="background:#ffffff;border-radius:12px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);border-left:4px solid #ef4444;">
              <p style="margin:0 0 20px;font-size:16px;color:#334155;">Hi ${clientName},</p>
              <p style="margin:0 0 20px;font-size:16px;color:#334155;">
                This is a final notice regarding invoice <strong>${invoiceNumber}</strong> for <strong>${formattedAmount}</strong>, which is now <strong>${daysOverdue} days overdue</strong> (original due date: ${formattedDueDate}).
              </p>
              <p style="margin:0 0 20px;font-size:16px;color:#334155;">
                Despite previous reminders, we have not yet received payment. Please settle this invoice immediately.
              </p>
              <p style="margin:0 0 30px;font-size:16px;color:#334155;">
                If we don't receive payment or hear from you within the next 7 days, we may need to escalate this matter further.
              </p>
              <p style="margin:0;font-size:16px;color:#334155;">
                Sincerely,<br/>${senderName}
              </p>
            </div>
            <p style="text-align:center;margin-top:20px;font-size:12px;color:#94a3b8;">
              This reminder was sent automatically by RemindFlow.
            </p>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  };
}

/**
 * Send a reminder email
 */
export async function sendReminderEmail(params: ReminderEmailParams) {
  const { subject, html } = getReminderTemplate(params);

  const { data, error } = await getResend().emails.send({
    from: 'RemindFlow <onboarding@resend.dev>',
    to: params.to,
    subject,
    html,
  });

  if (error) {
    console.error('Failed to send reminder email:', error);
    throw error;
  }

  return data;
}
