const nodemailer = require('nodemailer');
require('dotenv').config();

// Production Ready Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || "officialhundredacress@gmail.com",
    pass: process.env.SMTP_PASS || "fifyyzdnjzhrtgdm"
  },
  tls: {
    rejectUnauthorized: false // Only use this in development
  }
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Connection Error:", error);
    console.log("📧 Email service will not work. Check your Gmail credentials.");
  } else {
    console.log("✅ SMTP Server is ready to send emails");
  }
});

const sendMail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || "100acres CRM <officialhundredacress@gmail.com>",
      to,
      subject,
      text,
      html,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully to:", to);
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    // Don't throw error - let user creation continue
    console.log("⚠️ User creation will continue without email");
  }
};

module.exports = { sendMail };