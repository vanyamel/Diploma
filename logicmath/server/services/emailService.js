import Brevo from '@getbrevo/brevo';
import nodemailer from 'nodemailer';

const brevoClient = process.env.BREVO_API_KEY
  ? (() => {
      const client = new Brevo.TransactionalEmailsApi();
      client.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;
      return client;
    })()
  : null;

const FROM_NAME = process.env.EMAIL_FROM_NAME || 'LogicMath Platform';
const FROM_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@logicmath.app';

const htmlWrapper = (content) => `
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>LogicMath</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background:#ffffff;border:1px solid #eaeaea;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:32px 32px 16px;border-bottom:1px solid #eaeaea;">
          <h1 style="margin:0;color:#000000;font-size:20px;font-weight:600;">LogicMath</h1>
        </td></tr>
        <tr><td style="padding:32px;">${content}</td></tr>
        <tr><td style="padding:24px 32px;background:#fafafa;border-top:1px solid #eaeaea;">
          <p style="margin:0;color:#666666;font-size:12px;">© ${new Date().getFullYear()} LogicMath. Всі права захищені.</p>
          <p style="margin:8px 0 0;color:#999999;font-size:11px;">Якщо ви не робили цей запит, проігноруйте цей лист.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const send = async (mailOptions) => {
  if (!brevoClient) {
    console.log(`[dev] To: ${mailOptions.to}`);
    const match = mailOptions.html.match(/href="([^"]+)"/);
    if (match) console.log(`[dev] Link: ${match[1]}`);
    return;
  }

  const email = new Brevo.SendSmtpEmail();
  email.sender = { name: FROM_NAME, email: FROM_EMAIL };
  email.to = [{ email: mailOptions.to }];
  email.subject = mailOptions.subject;
  email.htmlContent = mailOptions.html;

  await brevoClient.sendTransacEmail(email);
  console.log(`[email] Sent to ${mailOptions.to}`);
};

export const sendVerificationEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const link = `${clientUrl}/verify-email?token=${token}`;

  const html = htmlWrapper(`
    <h2 style="margin:0 0 16px;color:#000000;font-size:18px;font-weight:600;">Підтвердіть ваш email</h2>
    <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.6;">
      Вітаємо на <b>LogicMath</b>. Для завершення реєстрації підтвердіть вашу адресу. Посилання дійсне 24 години.
    </p>
    <div style="margin:32px 0;">
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#000000;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">
        Підтвердити email
      </a>
    </div>
    <p style="margin:32px 0 0;color:#666666;font-size:13px;">
      Або вручну:<br/>
      <a href="${link}" style="color:#000000;word-break:break-all;">${link}</a>
    </p>
  `);

  await send({ to: email, subject: 'Підтвердіть ваш email — LogicMath', html });
};

export const sendPasswordResetEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const link = `${clientUrl}/reset-password?token=${token}`;

  const html = htmlWrapper(`
    <h2 style="margin:0 0 16px;color:#000000;font-size:18px;font-weight:600;">Скидання пароля</h2>
    <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.6;">
      Запит на скидання пароля для <b>${email}</b>. Посилання дійсне 1 годину.
    </p>
    <div style="margin:32px 0;">
      <a href="${link}" style="display:inline-block;padding:12px 24px;background:#000000;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">
        Змінити пароль
      </a>
    </div>
    <p style="margin:32px 0 0;color:#666666;font-size:13px;">
      Або вручну:<br/>
      <a href="${link}" style="color:#000000;word-break:break-all;">${link}</a>
    </p>
  `);

  await send({ to: email, subject: 'Скидання пароля — LogicMath', html });
};