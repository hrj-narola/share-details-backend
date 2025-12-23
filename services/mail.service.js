const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Sends a password reset email to the given user.
 * @param {{ name: string, token: string, email: string }} user
 */
const sendPasswordResetMail = async (user, token) => {
  await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_USER_NAME}" <${process.env.MAIL_FROM_USER_EMAIL}>`,
    to: user.email,
    subject: "Password reset",
    text: "Password Reset",
    html: `<b>Hello Dear, ${user?.name || ""}<br/>Token: ${token || ""}</b>`,
  });
};

module.exports = sendPasswordResetMail;
