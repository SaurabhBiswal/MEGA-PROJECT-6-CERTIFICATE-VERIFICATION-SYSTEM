require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const setupSwagger = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Swagger Documentation
setupSwagger(app);


// Database Connection
const User = require('./models/User');

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/certifyhub')
    .then(async () => {
        console.log('MongoDB connected');

        // Auto-seed Admin
        try {
            const adminExists = await User.findOne({ email: 'admin@certifyhub.com' });
            if (!adminExists) {
                const admin = new User({
                    name: 'System Admin',
                    email: 'admin@certifyhub.com',
                    password: 'admin123',
                    role: 'admin'
                });
                await admin.save();
                console.log('✅ Default Admin Account Created: admin@certifyhub.com / admin123');
            }
        } catch (err) {
            console.error('Admin Seed Failed:', err);
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/students', require('./routes/students'));
app.use('/api/audit', require('./routes/audit'));


app.get('/', (req, res) => res.send('CertifyHub API is running...'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
