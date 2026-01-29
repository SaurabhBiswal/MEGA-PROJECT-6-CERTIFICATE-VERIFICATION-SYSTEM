const nodemailer = require('nodemailer');

const sendCertificateEmail = async (email, studentName, certificateId, pdfBuffer) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"CertifyHub" <no-reply@certifyhub.com>',
        to: email,
        subject: `Your Internship Certificate - ${certificateId}`,
        text: `Congratulations ${studentName}! Your internship certificate is ready. Attachment: ${certificateId}.pdf`,
        attachments: [
            {
                filename: `Certificate_${certificateId}.pdf`,
                content: pdfBuffer
            }
        ]
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (err) {
        console.error('Email sending failed:', err);
    }
};

const sendPasswordResetEmail = async (email, resetLink) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"CertifyHub Security" <no-reply@certifyhub.com>',
        to: email,
        subject: 'Password Reset Request',
        html: `
            <h3>Reset Your Password</h3>
            <p>You requested a password reset. Please click the link below to verify your email and set a new password:</p>
            <a href="${resetLink}" style="padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link expires in 1 hour.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reset email sent to ${email}`);
    } catch (err) {
        console.error('Reset email sending failed:', err);
    }
};

module.exports = { sendCertificateEmail, sendPasswordResetEmail };
