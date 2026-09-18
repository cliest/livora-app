import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CLINIC_NOTIFY_EMAIL } = process.env;

const configured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transporter = configured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

/**
 * Sends a notification email to the clinic front desk. If SMTP isn't
 * configured yet (no credentials in .env), this quietly no-ops and logs to
 * the console instead — the booking/message is still saved to Postgres
 * either way, so nothing is lost while SMTP is being set up.
 */
export async function notifyClinic({ subject, text, html, replyTo }) {
  if (!configured) {
    console.warn(
      `[mailer] SMTP not configured — skipping email "${subject}". ` +
        `The record was still saved to the database.`
    );
    return { sent: false, reason: 'smtp-not-configured' };
  }

  try {
    await transporter.sendMail({
      from: `"Livora Dental Clinic — Website" <${SMTP_USER}>`,
      to: CLINIC_NOTIFY_EMAIL || SMTP_USER,
      replyTo,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] failed to send notification:', err.message);
    return { sent: false, reason: err.message };
  }
}
