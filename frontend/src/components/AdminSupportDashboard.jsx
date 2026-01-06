import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, MoreVertical, Phone, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/config/axios'; 
import { io } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import multiavatar from '@multiavatar/multiavatar';
const socket = io.connect("http://localhost:5001");
const AdminSupportDashboard = () => {
  const { user } = useAuth();
  let currentUser = user;
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/admin/support-tickets');
      setConversations(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải danh sách hỗ trợ");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (conversation) => {
    setActiveChat(conversation);
 
    if (socket) socket.emit("join_room", conversation._id);
    
    // setConversations(prev => prev.map(c => c._id === conversation._id ? {...c, unread: 0} : c));

    try {
      const res = await api.get(`/chat/${conversation._id}/messages`);
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.log(err);
      toast.error("Lỗi tải tin nhắn");
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (activeChat && data.conversationId === activeChat._id) {
        setMessages((prev) => [...prev, {
            ...data,
            sender: data.senderId,
            createdAt: new Date().toISOString()
        }]);
        scrollToBottom();
      }

      setConversations((prev) => {
        const updated = prev.map(conv => {
          if (conv._id === data.conversationId) {
             return {
               ...conv,
               lastMessage: {
                 text: data.text,
                 createdAt: new Date()
               },
               // unread: (activeChat?._id !== data.conversationId) ? (conv.unread + 1) : 0
             }
          }
          return conv;
        });
        return updated.sort((a, b) => new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt));
      });
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [activeChat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeChat) return;

    const textToSend = input;
    setInput('');

    const newMsg = {
        _id: Date.now(), 
        conversationId: activeChat._id,
        sender: currentUser._id, 
        text: textToSend,
        createdAt: new Date().toISOString()
    };
    console.log(newMsg);
    setMessages(prev => [...prev, newMsg]);
    scrollToBottom();

    try {
        socket.emit("send_message", {
            conversationId: activeChat._id,
            senderId: currentUser._id,
            text: textToSend
        });
        setConversations(prev => prev.map(c => 
            c._id === activeChat._id 
            ? { ...c, lastMessage: { text: textToSend, createdAt: new Date() } } 
            : c
        ));

    } catch (err) {
        console.log(err);
        toast.error("Gửi thất bại");
    }
  };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ 
                behavior: "smooth", 
                block: "nearest", // <-- QUAN TRỌNG: Giữ nó nằm gọn trong khung
                inline: "nearest"
            });
        }, 100);
    };

  const getPartnerInfo = (participants) => {
    const partner = participants.find(p => p._id !== currentUser._id) || {};
    console.log(partner);
    const svg = multiavatar(partner.avatarSeed || "example");
    const encoded = btoa(unescape(encodeURIComponent(svg)));
    return {
        name: partner.fullName || "Unknown User",
        avatar: encoded,
        status: 'online' 
    };
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-100 rounded-xl overflow-hidden shadow-xl border border-gray-200 my-4 mx-4">
      
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Hộp thư hỗ trợ</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
             <div className="flex justify-center items-center h-40 text-gray-400"><Loader2 className="animate-spin"/></div>
          ) : (
             conversations.map((chat) => {
                const partner = getPartnerInfo(chat.participants);
                const isActive = activeChat?._id === chat._id;
                
                return (
                    <div 
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 ${isActive ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                    >
                    <div className="relative">
                        <img src={`data:image/svg+xml;base64,${partner.avatar}`} 
                             className="size-10"
                         />
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                        <h3 className={`font-semibold truncate ${isActive ? 'text-blue-700' : 'text-gray-800'}`}>{partner.name}</h3>
                        <span className="text-xs text-gray-400">
                            {chat.lastMessage?.createdAt ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                        </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                            {chat.lastMessage?.text || "Bắt đầu cuộc trò chuyện"}
                        </p>
                    </div>
                    </div>
                );
             })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        {activeChat ? (
          <>
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                <img src={`data:image/svg+xml;base64,${getPartnerInfo(activeChat.participants).avatar}`} 
                             className="size-10"
                />
                <div>
                  <h3 className="font-bold text-gray-800">{getPartnerInfo(activeChat.participants).name}</h3>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Đang hỗ trợ
                  </p>
                </div>
              </div>
              <div className="flex gap-2 text-gray-500">
                <button className="p-2 hover:bg-gray-100 rounded-full"><Phone size={20}/></button>
                <button className="p-2 hover:bg-gray-100 rounded-full"><MoreVertical size={20}/></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => {

                const isAdmin = msg.sender === currentUser._id;
                
                return (
                  <div key={index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    {!isAdmin && (
                        <img src={`data:image/svg+xml;base64,${getPartnerInfo(activeChat.participants).avatar}`} 
                             className="size-8 rounded-full mr-2 self-end mb-1"
                        />
                    )}
                    
                    <div className={`max-w-[70%]`}>
                        <div className={`px-5 py-3 rounded-2xl text-sm shadow-sm ${
                          isAdmin 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}>
                          {msg.text}
                        </div>
                        <p className={`text-[10px] text-gray-400 mt-1 ${isAdmin ? 'text-right mr-1' : 'ml-1'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSend} className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl border focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu trả lời..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 h-10"
                />
                <button type="submit" className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors">
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <User size={40} />
            </div>
            <p className="text-lg font-medium text-gray-500">Chọn một cuộc hội thoại để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupportDashboard;