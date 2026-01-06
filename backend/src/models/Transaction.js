const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['deposit', 'withdrawal', 'payment', 'refund'], 
        default: 'deposit'
    },
    amount: { type: Number, required: true }, // Số dương (+) hoặc âm (-)
    description: { type: String }, 
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);