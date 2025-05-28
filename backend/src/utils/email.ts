import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `http://localhost:5000/api/auth/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your DevOrgs account',
    html: `<p>Click <a href="${url}">here</a> to verify your account.</p>`
  });
};
