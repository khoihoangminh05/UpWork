const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({

    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
    type: { type: String, enum: ['job_chat', 'support'], default: 'job_chat' },

    lastMessage: {
        text: String,
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: Date
    }
}, { timestamps: true });

ConversationSchema.index({ participants: 1 });

module.exports = mongoose.model('Conversation', ConversationSchema);