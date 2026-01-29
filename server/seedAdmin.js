const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/certifyhub');
        console.log('MongoDB Connected');

        const adminExists = await User.findOne({ email: 'admin@certifyhub.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = new User({
            name: 'System Admin',
            email: 'admin@certifyhub.com',
            password: 'admin123', // Will be hashed by pre-save hook
            role: 'admin'
        });

        await admin.save();
        console.log('Admin created successfully');
        console.log('Email: admin@certifyhub.com');
        console.log('Password: admin123');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
