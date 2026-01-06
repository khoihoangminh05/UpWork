const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

exports.createConversation = async (req, res) => {
    try {
        let { receiverId, jobId, type } = req.body;
        const senderId = req.user.id; 

        if (type === 'support') {  
            const adminUser = await User.findOne({ role: 'admin' });   
            if (!adminUser) {
                return res.status(404).json({ msg: "Hiện không có Admin nào trực tuyến" });
            }    
            receiverId = adminUser._id; 
            jobId = null; 
        }

        if (!receiverId) {
            return res.status(400).json({ msg: "Thiếu thông tin người nhận" });
        }
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
            jobId: jobId
        });
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
                jobId: jobId || null,
                type: type || 'job_chat'
            });
            await conversation.save();

            if(type === "support") {
                const newMessage = new Message({
                    conversationId: conversation._id,
                    sender: receiverId,
                    text:"Chào bạn, tôi là Admin. Tôi có thể giúp gì cho bạn?"
                });
                await newMessage.save();
                await Conversation.findByIdAndUpdate(conversation._id, {
                    lastMessage: {
                        text: newMessage.text,
                        sender: receiverId,
                        createdAt: new Date()
                    }
                });
            }
        }

        res.json(conversation);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.getMessagesByConversationId = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
}

exports.getConversationByAdmin = async (req, res) => {
    try {
        const chats = await Conversation.find({ type: 'support' })
            .populate('participants', 'fullName avatarSeed email')
            .sort({ updatedAt: -1 });
        res.json(chats);
    } catch (err) {
        res.status(500).json(err);
    }
}