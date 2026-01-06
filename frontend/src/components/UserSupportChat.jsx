import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Paperclip } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/config/axios';

const UserSupportChat = ({ user, socket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
     const initConversation = async () => {
         if (conversationId) return;
         try {
            let setup = { type: 'support', jobId: null }; 
            const res = await api.post('/chat/init', setup);
            const convoId = res.data?._id || res._id; 
            setConversationId(convoId);
            if (socket && convoId) {
                socket.emit("join_room", convoId);
                console.log("Joined room support:", convoId);
            }
         } catch(err) {
           toast.error("Không thể kết nối tới Admin!");
           console.log(err);
         }
     };

     if (isOpen) {
         initConversation();
     }
  }, [isOpen]); 

  useEffect(() => {
    const getMessages = async ()=> {
       let res = await api.get(`/chat/${conversationId}/messages`);
       if(res.data)
       setMessages(res.data);
       console.log(res.data);
    }
    if(conversationId) getMessages();
  }, [conversationId])

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
        if (data.conversationId === conversationId && data.senderId !== user.id) {
            const incomingMsg = {
                id: Date.now(),
                text: data.text,
                sender: 'admin', 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, incomingMsg]);
        }
    };
    socket.on("receive_message", handleReceiveMessage);

    return () => {
        socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, conversationId, user?.id]);


  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;
    
    const textToSend = input;
    setInput('');

    const messageData = {
        conversationId: conversationId,
        senderId: user._id,
        text: textToSend,
    };

    console.log(messageData);

    await socket.emit("send_message", messageData);

    const newMsg = {
      id: Date.now(),
      text: textToSend,
      sender: user._id, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  if(!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl mb-4 flex flex-col border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
  
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white shadow-sm">
            <div>
              <h3 className="font-bold text-sm">Hỗ trợ khách hàng</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Admin đang online
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === user._id ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === user._id 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 mx-1">{msg.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2 items-center">
            <button type="button" className="text-gray-400 hover:text-gray-600">
                <Paperclip size={20}/>
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..." 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={!conversationId} 
            />
            <button 
              type="submit" 
              disabled={!input.trim() || !conversationId}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors disabled:bg-gray-400"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}


      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default UserSupportChat;