const nodemailer = require('nodemailer');

// Direct Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'officialhundredacress@gmail.com',
    pass: 'fifyyzdnjzhrtgdm'
  },
  tls: {
    rejectUnauthorized: false // Only for testing
  }
});

// Test the connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Connection failed:', error);
  } else {
    console.log('✅ Server is ready to take our messages');
    
    // Send a test email
    transporter.sendMail({
      from: '100acres CRM <officialhundredacress@gmail.com>',
      to: 'officialhundredacress@gmail.com',
      subject: 'Direct Test Email',
      text: 'This is a direct test email.'
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
