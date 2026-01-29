require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('Testing Email Configuration...');
    console.log('User:', process.env.EMAIL_USER);
    console.log('Pass:', process.env.EMAIL_PASS ? '********' : 'Not Set');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ Error: EMAIL_USER or EMAIL_PASS is missing in .env file');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"CertifyHub Test" <no-reply@certifyhub.com>',
        to: process.env.EMAIL_USER, // Sending to self for testing
        subject: 'CertifyHub Email Test',
        text: 'If you are reading this, your email configuration is working perfectly! 🚀'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Success! Test email sent to ' + process.env.EMAIL_USER);
    } catch (err) {
        console.error('❌ Failed to send email:', err.message);
        if (err.message.includes('Username and Password not accepted')) {
            console.log('👉 Tip: Make sure you are using an "App Password" and not your Gmail login password.');
        }
    }
};

testEmail();
