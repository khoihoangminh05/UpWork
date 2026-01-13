const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },

    code: { 
        type: String, 
        required: true, 
        unique: true 
    }, 

    image: { 
        type: String,
        default: ""
    }, 
    basePrice: { 
        type: Number, 
        required: true,
        default: 0
    },
    unit: { 
        type: String, 
        required: true 
    },
    inputType: {
        type: String,
        enum: ['time', 'quantity', 'area', 'fixed'],
        required: true,
        default: 'quantity'
    },
    hint: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);