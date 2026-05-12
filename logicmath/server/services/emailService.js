export const sendVerificationEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const verifyLink = `${clientUrl}/verify-email?token=${token}`;
  console.log(`EMAIL SENT to ${email}`);
  console.log(`Verification link: ${verifyLink}`);
  //  nodemailer / sendgrid here
  return true;
};

export const sendPasswordResetEmail = async (email, token) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const resetLink = `${clientUrl}/reset-password?token=${token}`;
  console.log(`PASSWORD RESET EMAIL to ${email}`);
  console.log(`Reset link: ${resetLink}`);
  return true;
};
