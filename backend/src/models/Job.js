const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
   
    title: { type: String, required: true }, 
    description: { type: String },
    price: { type: Number, required: true }, 
    paymentType: { 
        type: String, 
        default: 'for all' 
     },
    address: { type: String, required: true }, 
    phone: { type: String, required: true },

   
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người đăng
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Người làm 
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

    
    status: { 
        type: String, 
        enum: ['Open', 'In progress', 'Completed', 'Cancelled'], 
        default: 'Open' 
    },

   
    review: {
        rating: { type: Number, min: 1, max: 5 }, // 1-5 sao
        comment: { type: String }
    }
}, { timestamps: true });


module.exports = mongoose.model('Job', JobSchema);