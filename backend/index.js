const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
const http = require('http'); 
const { Server } = require("socket.io");
const Conversation = require('./src/models/Conversation.js');
const Message = require('./src/models/Message.js');
require('dotenv').config();


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (conversationId) => {
        socket.join(conversationId);
        console.log(`User with ID: ${socket.id} joined room: ${conversationId}`);
    });

    socket.on("send_message", async (data) => {
        const { conversationId, senderId, text } = data;
        const newMessage = new Message({
            conversationId,
            sender: senderId,
            text
        });
        console.log(newMessage);
        await newMessage.save();

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: {
                text,
                sender: senderId,
                createdAt: new Date()
            }
        });
        socket.to(conversationId).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

connectDB();

app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./src/routes/auth.js'));
app.use('/api/jobs', require('./src/routes/jobs.js'));
app.use('/api/category', require('./src/routes/category.js'));
app.use('/api/wallet', require('./src/routes/wallet.js'));
app.use('/api/chat', require('./src/routes/chat.js'));

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));