const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    title: { type: String, required: true },
    description: { type: String },
 
    address: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
    
    paymentType: { type: String, default: "VND" }, 
    
    startDate: { type: String }, 
    startTime: { type: String }, 
    endTime: { type: String },   
    
    status: {
        type: String,
        enum: ['Open',  'In progress', 'Completed', 'Cancelled'],
        default: 'Open'
    },
    review: {
        rating: { type: Number },
        comment: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);