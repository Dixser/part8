const mongoose = require('mongoose');
const { mongoUrl } = require('./config')
const dns = require('dns');


async function connectDB() {
    try {

        dns.setServers([
            '1.1.1.1',
            '8.8.8.8'
        ]);
        await mongoose.connect(mongoUrl);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error conecting to MongoDB:', error);
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        console.error('Cause:', error.cause);

    }
}

module.exports = connectDB;