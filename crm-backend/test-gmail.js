require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing Gmail SMTP connection...');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Connection failed:', error);
  } else {
    console.log('✅ Server is ready to take our messages');
    
    // Send a test email
    transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.SMTP_USER,
      subject: 'Test Email from CRM',
      text: 'This is a test email from your CRM application.'
    }, (err, info) => {
      if (err) {
        console.log('❌ Error sending email:', err);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
      }
    });
  }
});
