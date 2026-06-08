import nodemailer from 'nodemailer';
const createTransport = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null; // fallback to console logging in dev
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

const transporter = createTransport();

const FROM = `"${process.env.EMAIL_FROM_NAME || 'LogicMath Platform'}" <${process.env.GMAIL_USER || 'noreply@logicmath.app'}>`;

//HTML wrapper
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
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background:#ffffff;border:1px solid #eaeaea;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 16px;text-align:left;border-bottom:1px solid #eaeaea;">
              <h1 style="margin:0;color:#000000;font-size:20px;font-weight:600;letter-spacing:-0.5px;">LogicMath</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background:#fafafa;border-top:1px solid #eaeaea;text-align:left;">
              <p style="margin:0;color:#666666;font-size:12px;">
                © ${new Date().getFullYear()} LogicMath. Всі права захищені.
              </p>
              <p style="margin:8px 0 0;color:#999999;font-size:11px;">
                Якщо ви не робили цей запит, просто проігноруйте цей лист.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

//  Send helper
const send = async (mailOptions) => {
  if (!transporter) {
    console.log(`To:      ${mailOptions.to}`);
    console.log(`Subject: ${mailOptions.subject}`);
    const match = mailOptions.html.match(/href="([^"]+)"/);
    if (match) console.log(`Link:    ${match[1]}`);
    return;
  }

  try {
    const info = await transporter.sendMail({ from: FROM, ...mailOptions });
    console.log(`[email] Sent to ${mailOptions.to} (id: ${info.messageId})`);
  } catch (err) {
    console.error('[email] Failed to send:', err.message);
    throw new Error('Не вдалося надіслати email. Спробуйте пізніше.');
  }
};

//  Verification email
export const sendVerificationEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const link = `${clientUrl}/verify-email?token=${token}`;

  const html = htmlWrapper(`
    <h2 style="margin:0 0 16px;color:#000000;font-size:18px;font-weight:600;">Підтвердіть ваш email</h2>
    <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.6;">
      Вітаємо на <b>LogicMath</b>. Для завершення реєстрації, будь ласка, підтвердіть вашу адресу. Це посилання дійсне протягом 24 годин.
    </p>

    <div style="margin:32px 0;">
      <a href="${link}"
         style="display:inline-block;padding:12px 24px;background:#000000;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">
        Підтвердити email
      </a>
    </div>

    <p style="margin:32px 0 0;color:#666666;font-size:13px;line-height:1.5;">
      Або перейдіть за посиланням вручну:<br/>
      <a href="${link}" style="color:#000000;text-decoration:underline;word-break:break-all;">${link}</a>
    </p>
  `);

  await send({ to: email, subject: 'Підтвердіть ваш email — LogicMath', html });
};

//  Password reset email
export const sendPasswordResetEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const link = `${clientUrl}/reset-password?token=${token}`;

  const html = htmlWrapper(`
    <h2 style="margin:0 0 16px;color:#000000;font-size:18px;font-weight:600;">Скидання пароля</h2>
    <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.6;">
      Ми отримали запит на скидання пароля для акаунту <b>${email}</b>.
    </p>
    <p style="margin:0 0 24px;color:#333333;font-size:14px;">
      Посилання дійсне протягом 1 години.
    </p>

    <div style="margin:32px 0;">
      <a href="${link}"
         style="display:inline-block;padding:12px 24px;background:#000000;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:500;">
        Змінити пароль
      </a>
    </div>

    <p style="margin:32px 0 0;color:#666666;font-size:13px;line-height:1.5;">
      Або перейдіть за посиланням вручну:<br/>
      <a href="${link}" style="color:#000000;text-decoration:underline;word-break:break-all;">${link}</a>
    </p>
  `);

  await send({ to: email, subject: 'Скидання пароля — LogicMath', html });
};
