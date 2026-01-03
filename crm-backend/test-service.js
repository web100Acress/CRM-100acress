require('dotenv').config();
const { sendMail } = require('./src/services/emailService');

async function testEmail() {
  try {
    console.log('Sending test email...');
    const info = await sendMail(
      'officialhundredacress@gmail.com',
      'Test from Email Service',
      'This is a test email from the email service.',
      '<p>This is a test email from the email service.</p>'
    );
    console.log('✅ Email sent successfully!', info.messageId);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

testEmail();
