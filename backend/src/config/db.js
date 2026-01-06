const mongoose = require('mongoose');

const connectDB = async () => {
    try {console.log('MongoDB Connected...');
        await mongoose.connect(process.env.MONGO_URI);
        
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;