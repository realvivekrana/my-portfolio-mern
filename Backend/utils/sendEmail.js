const nodemailer = require('nodemailer');

/*
|--------------------------------------------------------------------------
| EMAIL TRANSPORTER
|--------------------------------------------------------------------------
|
| SMTP-based transporter — kisi bhi provider ke saath kaam karega
| (Gmail, Brevo, Zoho, Resend SMTP, etc.) bas .env me sahi
| EMAIL_HOST / EMAIL_PORT / EMAIL_USER / EMAIL_PASS daal do.
|
| GMAIL use karna ho toh:
|   1. Google Account -> Security -> 2-Step Verification ON karo.
|   2. "App Passwords" bana ke woh (16-char) EMAIL_PASS me daalo —
|      apna normal Gmail password NAHI chalega.
|   3. EMAIL_HOST=smtp.gmail.com, EMAIL_PORT=465
|
| RESEND use karna ho (Nodemailer transport ki jagah seedha Resend
| API se bhejna ho) toh niche `sendEmailViaResend()` bhi diya hai —
| bas .env me RESEND_API_KEY daal ke us function ko `sendEmail` ki
| jagah export/import karo. Dono ek jaisa hi kaam karte hain.
|
|--------------------------------------------------------------------------
*/

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: Number(process.env.EMAIL_PORT) === 465, // 465 = SSL, 587 = STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/*
|--------------------------------------------------------------------------
| SEND EMAIL (Nodemailer / SMTP)
|--------------------------------------------------------------------------
|
| @param {Object} options
| @param {string} options.to      - recipient email
| @param {string} options.subject - email subject
| @param {string} options.html    - email HTML body
| @param {string} [options.text]  - plain-text fallback (optional)
|
|--------------------------------------------------------------------------
*/

const sendEmail = async ({ to, subject, html, text }) => {
  // ======================================================
  // SKIP SILENTLY IF EMAIL NOT CONFIGURED
  // ======================================================
  //
  // Local development me agar EMAIL_* env vars set nahi hain, toh
  // app crash nahi honi chahiye — bas email skip ho jaaye aur ek
  // warning log ho jaaye.
  // ======================================================

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      '⚠️  Email not sent — EMAIL_HOST/EMAIL_USER/EMAIL_PASS not configured in .env'
    );
    return { skipped: true };
  }

  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
    text,
  });

  return info;
};

/*
|--------------------------------------------------------------------------
| SEND EMAIL VIA RESEND (alternative to Nodemailer/SMTP)
|--------------------------------------------------------------------------
|
| Resend ka free tier SMTP se zyada reliable deliverability deta hai.
| Use karna ho toh:
|   1. npm install resend
|   2. .env me RESEND_API_KEY daalo
|   3. contactController.js me `sendEmail` ki jagah
|      `sendEmailViaResend` import kar lo (same signature hai)
|
|--------------------------------------------------------------------------
*/

const sendEmailViaResend = async ({ to, subject, html, text }) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  Email not sent — RESEND_API_KEY not configured in .env');
    return { skipped: true };
  }

  // eslint-disable-next-line global-require
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const response = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to,
    subject,
    html,
    text,
  });

  return response;
};

module.exports = {
  sendEmail,
  sendEmailViaResend,
};