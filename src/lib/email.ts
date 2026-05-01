import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendThankYouEmail(email: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured — skipping email');
    return;
  }

  try {
    await resend.emails.send({
      from: 'RemindFlow <hello@remindflow.app>',
      to: email,
      subject: "You're in! 🎉 Welcome to RemindFlow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to RemindFlow</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #030303; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #030303;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 40px;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; width: 48px; height: 48px; text-align: center; vertical-align: middle;">
                            <span style="color: #000; font-size: 24px; font-weight: bold;">R</span>
                          </td>
                          <td style="padding-left: 12px; vertical-align: middle;">
                            <span style="color: #ffffff; font-size: 20px; font-weight: 600;">RemindFlow</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="background-color: #0a0a0a; border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 48px 40px;">
                      <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; letter-spacing: -0.5px;">
                        You're in! 🎉
                      </h1>
                      <p style="color: rgba(255,255,255,0.5); font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                        Welcome to RemindFlow. You've just taken the first step toward getting paid on time — every time.
                      </p>

                      <!-- Divider -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 32px;">
                            <h2 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">
                              What happens next?
                            </h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-bottom: 16px;">
                                  <table role="presentation" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="background-color: rgba(16,185,129,0.1); border-radius: 8px; width: 32px; height: 32px; text-align: center; vertical-align: middle; padding-right: 16px;">
                                        <span style="color: #10b981; font-size: 14px; font-weight: bold;">1</span>
                                      </td>
                                      <td style="color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.5; vertical-align: middle;">
                                        <strong style="color: #ffffff;">We're building the product.</strong> You'll be first to know when it's ready.
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 16px;">
                                  <table role="presentation" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="background-color: rgba(16,185,129,0.1); border-radius: 8px; width: 32px; height: 32px; text-align: center; vertical-align: middle; padding-right: 16px;">
                                        <span style="color: #10b981; font-size: 14px; font-weight: bold;">2</span>
                                      </td>
                                      <td style="color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.5; vertical-align: middle;">
                                        <strong style="color: #ffffff;">You'll get early access.</strong> Founding members lock in $15/mo forever.
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table role="presentation" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td style="background-color: rgba(16,185,129,0.1); border-radius: 8px; width: 32px; height: 32px; text-align: center; vertical-align: middle; padding-right: 16px;">
                                        <span style="color: #10b981; font-size: 14px; font-weight: bold;">3</span>
                                      </td>
                                      <td style="color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.5; vertical-align: middle;">
                                        <strong style="color: #ffffff;">14-day free trial.</strong> No credit card required. Cancel anytime.
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA Button -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                        <tr>
                          <td align="center">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="background: linear-gradient(135deg, #10b981, #34d399); border-radius: 12px; text-align: center;">
                                  <a href="https://remindflow-silk.vercel.app/" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 12px;">
                                    Visit RemindFlow →
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding-top: 32px; text-align: center;">
                      <p style="color: rgba(255,255,255,0.2); font-size: 13px; line-height: 1.6; margin: 0;">
                        You're receiving this because you signed up at remindflow.app<br>
                        © 2026 RemindFlow. All rights reserved.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log(`Thank you email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send thank you email:', error);
  }
}
