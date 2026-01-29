const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API Key (trim to remove any whitespace/newlines)
const apiKey = (process.env.SENDGRID_API_KEY || process.env.EMAIL_PASS || '').trim();
sgMail.setApiKey(apiKey);

const sendCertificateEmail = async (email, studentName, certificateId, pdfBuffer) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'punpunsaurabh2002@gmail.com',
        subject: `Your Internship Certificate - ${certificateId}`,
        text: `Congratulations ${studentName}! Your internship certificate is ready.`,
        html: `
            <h2>Congratulations ${studentName}!</h2>
            <p>Your internship certificate is ready.</p>
            <p><strong>Certificate ID:</strong> ${certificateId}</p>
            <p>Please find your certificate attached.</p>
        `,
        attachments: [
            {
                content: pdfBuffer.toString('base64'),
                filename: `Certificate_${certificateId}.pdf`,
                type: 'application/pdf',
                disposition: 'attachment'
            }
        ]
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent to ${email}`);
    } catch (err) {
        console.error('Email sending failed:', err.response ? err.response.body : err);
    }
};

const sendPasswordResetEmail = async (email, resetLink) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_FROM || 'punpunsaurabh2002@gmail.com',
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
        await sgMail.send(msg);
        console.log(`Reset email sent to ${email}`);
    } catch (err) {
        console.error('Reset email sending failed:', err.response ? err.response.body : err);
    }
};

module.exports = { sendCertificateEmail, sendPasswordResetEmail };
