const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['client', 'worker', 'admin'], 
        default: 'client' 
    },
    createdAt: { type: Date, default: Date.now },
    workerStats: {
        averageRating: { type: Number, default: 0 }, 
        totalReviews: { type: Number, default: 0 }  
    },
    avatarSeed: {
      type: String,
      default: "fullname"
    },
    walletBalance: { 
        type: Number, 
        default: 0, 
        min: 0 
    }
});

UserSchema.pre('save', async function () {

  if (!this.isModified('password')) return;

  if (!this.password) {
    throw new Error('Password is required');
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});



module.exports = mongoose.model('User', UserSchema);