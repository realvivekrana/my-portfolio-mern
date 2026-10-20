const nodemailer = require('nodemailer');

/*
|--------------------------------------------------------------------------
| EMAIL SENDING
|--------------------------------------------------------------------------
|
| Do tareeke supported hain, aur `sendEmail()` khud sahi wala chun leta hai:
|
|  1. RESEND (HTTPS API)  -> agar .env me RESEND_API_KEY set hai.
|     RECOMMENDED for Render: Render ke free tier par outbound SMTP ports
|     (25 / 465 / 587) block rehte hain, isliye Gmail SMTP wahan chup-chaap
|     fail ho jaata hai (email kabhi nahi aata). Resend normal HTTPS (443)
|     use karta hai, isliye block nahi hota. Koi extra npm package nahi
|     chahiye — seedha fetch se call hota hai.
|     Setup: resend.com par free account -> API key -> .env me
|       RESEND_API_KEY=re_xxx
|       EMAIL_FROM=onboarding@resend.dev    (apna domain verify na ho to yahi)
|       ADMIN_NOTIFY_EMAIL=<wahi email jisse Resend account bana hai>
|     (onboarding@resend.dev se sirf apne Resend account ke email par mail
|      jaati hai — admin notification ke liye bilkul kaafi hai.)
|
|  2. SMTP (Nodemailer)   -> RESEND_API_KEY na ho to EMAIL_HOST/USER/PASS.
|     Gmail: 2-Step Verification ON -> App Password banao (normal password
|     nahi chalega). EMAIL_HOST=smtp.gmail.com, EMAIL_PORT=465.
|
| Email configure na ho to app crash nahi hoti — bas email skip hota hai.
|
|--------------------------------------------------------------------------
*/

const SMTP_TIMEOUT_MS = 10000;

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: Number(process.env.EMAIL_PORT) === 465, // 465 = SSL, 587 = STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Blocked port par connection bina timeout ke latak jaata tha
    connectionTimeout: SMTP_TIMEOUT_MS,
    greetingTimeout: SMTP_TIMEOUT_MS,
    socketTimeout: SMTP_TIMEOUT_MS,
  });
};

/*
|--------------------------------------------------------------------------
| SEND VIA RESEND (HTTPS)
|--------------------------------------------------------------------------
*/

const sendEmailViaResend = async ({ to, subject, html, text }) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  Email not sent — RESEND_API_KEY not configured in .env');
    return { skipped: true };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(SMTP_TIMEOUT_MS),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      `Resend API error (${response.status}): ${data.message || data.name || 'unknown error'}`
    );
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| SEND EMAIL (auto: Resend -> SMTP)
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
  if (process.env.RESEND_API_KEY) {
    return sendEmailViaResend({ to, subject, html, text });
  }

  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      '⚠️  Email not sent — configure RESEND_API_KEY, or EMAIL_HOST/EMAIL_USER/EMAIL_PASS in .env'
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

module.exports = {
  sendEmail,
  sendEmailViaResend,
};