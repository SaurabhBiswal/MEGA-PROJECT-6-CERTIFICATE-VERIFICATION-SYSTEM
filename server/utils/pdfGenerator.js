const PDFDocument = require('pdfkit');

const generatePDF = (certificate) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 0
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        doc.on('error', reject);

        const width = doc.page.width;  // 842 for A4 landscape
        const height = doc.page.height; // 595 for A4 landscape

        // Safe area boundaries (inside the borders)
        const safeX = 80;
        const safeY = 80;
        const safeWidth = width - 160;
        const safeHeight = height - 160;

        // Background
        doc.rect(0, 0, width, height).fill('#ffffff');

        // Luxury Top Branding Bar (Royal Blue)
        doc.rect(0, 0, width, 60).fill('#0f172a');
        doc.fillColor('#fbbf24').fontSize(14).text('CERTIFYHUB DIGITAL VERIFICATION SYSTEM', 0, 25, {
            align: 'center',
            characterSpacing: 2
        });

        // Geometric Corner Elements (Golden)
        const cornerSize = 100;
        // Bottom Left
        doc.fillColor('#fbbf24')
            .polygon([0, height - cornerSize], [0, height], [cornerSize, height])
            .fill();
        // Top Right  
        doc.fillColor('#fbbf24')
            .polygon([width - cornerSize, 0], [width, 0], [width, cornerSize])
            .fill();

        // Sophisticated Border
        doc.rect(30, 30, width - 60, height - 60)
            .lineWidth(1.5)
            .strokeColor('#fbbf24')
            .stroke();

        doc.rect(40, 40, width - 80, height - 80)
            .lineWidth(0.5)
            .strokeColor('#0f172a')
            .stroke();

        // ========== MAIN CERTIFICATE CONTENT ==========
        // All content will be within safe area

        // Certificate Header
        doc.fillColor('#0f172a')
            .font('Helvetica-Bold')
            .fontSize(48) // Slightly reduced for better fit
            .text('CERTIFICATE', safeX, 100, {
                width: safeWidth,
                align: 'center'
            });

        doc.fillColor('#fbbf24')
            .font('Helvetica-Bold')
            .fontSize(20)
            .text('OF APPRECIATION', safeX, 160, {
                width: safeWidth,
                align: 'center'
            });

        // Presentation line
        doc.fillColor('#64748b')
            .font('Helvetica')
            .fontSize(16)
            .text('This certificate is proudly presented to', safeX, 200, {
                width: safeWidth,
                align: 'center'
            });

        // Student Name
        doc.fillColor('#1e293b')
            .font('Helvetica-Bold')
            .fontSize(36)
            .text(certificate.studentName.toUpperCase(), safeX, 240, {
                width: safeWidth,
                align: 'center'
            });

        // Horizontal decorative line
        doc.strokeColor('#fbbf24')
            .lineWidth(1)
            .moveTo(safeX + 50, 300)
            .lineTo(width - safeX - 50, 300)
            .stroke();

        // Internship description
        doc.fillColor('#64748b')
            .font('Helvetica')
            .fontSize(14)
            .text('for successfully completing a professional internship in', safeX, 320, {
                width: safeWidth,
                align: 'center'
            });

        // Internship Domain
        doc.fillColor('#0369a1')
            .font('Helvetica-Bold')
            .fontSize(22)
            .text(certificate.internshipDomain, safeX, 350, {
                width: safeWidth,
                align: 'center'
            });

        // Dates
        const startDate = new Date(certificate.startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const endDate = new Date(certificate.endDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        doc.fillColor('#64748b')
            .font('Helvetica')
            .fontSize(12)
            .text(`Conducted from ${startDate} to ${endDate}`, safeX, 390, {
                width: safeWidth,
                align: 'center'
            });

        // ========== SIGNATURES SECTION ==========
        const signaturesY = height - 150;
        const signatureLineY = signaturesY;
        const signatureTextY = signaturesY + 10;

        // Left Signature - PROGRAM DIRECTOR
        const leftSigX = safeX + 20;
        doc.strokeColor('#94a3b8')
            .lineWidth(0.5)
            .moveTo(leftSigX, signatureLineY)
            .lineTo(leftSigX + 150, signatureLineY)
            .stroke();

        doc.fillColor('#0f172a')
            .fontSize(10)
            .font('Helvetica-Bold')
            .text('PROGRAM DIRECTOR', leftSigX, signatureTextY, {
                width: 150,
                align: 'center'
            });

        // Center Signature - MANAGING ENTITY
        const centerSigX = width / 2 - 75;
        doc.strokeColor('#94a3b8')
            .lineWidth(0.5)
            .moveTo(centerSigX, signatureLineY)
            .lineTo(centerSigX + 150, signatureLineY)
            .stroke();

        doc.text('MANAGING ENTITY', centerSigX, signatureTextY, {
            width: 150,
            align: 'center'
        });

        // Right Signature - CERTIFYING AUTHORITY
        const rightSigX = width - safeX - 170;
        doc.strokeColor('#94a3b8')
            .lineWidth(0.5)
            .moveTo(rightSigX, signatureLineY)
            .lineTo(rightSigX + 150, signatureLineY)
            .stroke();

        doc.text('CERTIFYING AUTHORITY', rightSigX, signatureTextY, {
            width: 150,
            align: 'center'
        });

        // ========== QR CODE SECTION ==========
        if (certificate.qrCode) {
            try {
                const qrSize = 70;
                const qrX = width - safeX - qrSize;
                const qrY = height - 130;

                doc.image(certificate.qrCode, qrX, qrY, {
                    width: qrSize,
                    height: qrSize
                });

                doc.fillColor('#94a3b8')
                    .fontSize(8)
                    .text('SCAN TO VERIFY', qrX, qrY + qrSize + 3, {
                        width: qrSize,
                        align: 'center'
                    });
            } catch (error) {
                console.error('Error loading QR code:', error);
            }
        }

        // ========== BOTTOM INFO SECTION ==========
        const bottomY = height - 40;

        // Left: Verification ID
        doc.fillColor('#94a3b8')
            .font('Helvetica')
            .fontSize(9)
            .text(`VERIFICATION ID: ${certificate.certificateId || 'N/A'}`, safeX, bottomY);

        // Right: Date of Issue
        const issueDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        doc.text(`DATE OF ISSUE: ${issueDate}`, width - safeX - 200, bottomY, {
            width: 200,
            align: 'right'
        });

        doc.end();
    });
};

module.exports = { generatePDF };
