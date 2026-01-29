const nodemailer = require('nodemailer');

const sendCertificateEmail = async (email, studentName, certificateId, pdfBuffer) => {
    // Flexible Transporter (Works with Gmail, SendGrid, Mailgun etc.)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"${process.env.EMAIL_NAME || 'CertifyHub'}" <${process.env.EMAIL_FROM || 'no-reply@certifyhub.com'}>`,
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
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"${process.env.EMAIL_NAME || 'CertifyHub Security'}" <${process.env.EMAIL_FROM || 'no-reply@certifyhub.com'}>`,
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
