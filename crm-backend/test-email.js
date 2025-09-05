require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  // Try both secure and non-secure options
  const configs = [
    {
      name: 'Option 1: relay-hosting.secureserver.net (SSL)',
      host: 'relay-hosting.secureserver.net',
      port: 465,
      secure: true
    },
    {
      name: 'Option 2: relay-hosting.secureserver.net (TLS)',
      host: 'relay-hosting.secureserver.net',
      port: 587,
      secure: false
    },
    {
      name: 'Option 3: smtpout.secureserver.net (SSL)',
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true
    },
    {
      name: 'Option 4: smtpout.secureserver.net (TLS)',
      host: 'smtpout.secureserver.net',
      port: 587,
      secure: false
    }
  ];

  for (const config of configs) {
    console.log(`\nTesting ${config.name}...`);
    
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    try {
      // Test connection
      await transporter.verify();
      console.log('✅ Server is ready to take our messages');
      
      // Try sending a test email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.SMTP_USER, // Send to self for testing
        subject: `Test Email - ${config.name}`,
        text: 'This is a test email from your Node.js application.'
      });
      
      console.log('✅ Test email sent successfully!');
      console.log('Message ID:', info.messageId);
      return; // Stop testing if successful
    } catch (error) {
      console.error('❌ Error:', error.message);
      console.log('Trying next configuration...');
    }
  }
  
  console.log('\n⚠️ All configurations failed. Please check your email settings and credentials.');
}

testEmail().catch(console.error);
