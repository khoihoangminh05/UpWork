import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import api from "@/config/axios";

// --- ICONS ---
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>);
const WorkIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>);

export const LoginFormSection = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("client");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const user = { email, password };
        const res = await api.post('/auth/login', user);
        login(res.data.token, res.data.user);
        toast.success("Đăng nhập thành công!");
        if (res.data.user.role === "worker") navigate("/findjob");
        else navigate("/postjob");
      } else {
        const user = { fullName, email, password, role };
        await api.post('/auth/register', user);
        toast.success("Đăng ký thành công! Hãy đăng nhập.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(isLogin ? "Đăng nhập thất bại." : "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // CHANGE 1: Bỏ 'pt-20', dùng 'h-full' để fit vào Layout cha
    <div className="flex w-full h-full bg-white overflow-hidden">
      
      {/* --- CỘT TRÁI (45%) --- */}
      {/* CHANGE 2: Đổi màu nền sang Gradient Indigo-Purple đẹp hơn */}
      <div className="hidden lg:flex w-[45%] bg-[#0f172a] flex-col justify-between p-12 relative text-white">
        
        {/* Modern Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900 via-[#2e1065] to-indigo-900 opacity-90 z-0"></div>
        
        {/* Animated Decor Blobs */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Nội dung bên trái */}
        <div className="relative z-10 mt-10">
          <div className="mb-6 inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium tracking-wide text-purple-200">
             ✨ Nền tảng dịch vụ số 1
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
            Kết nối giá trị, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200">
              kiến tạo niềm tin.
            </span>
          </h1>
          <p className="text-indigo-100/80 text-lg mb-8 max-w-md leading-relaxed">
            Tham gia cộng đồng hàng nghìn người dùng để tìm kiếm sự hỗ trợ hoặc phát triển sự nghiệp của bạn ngay hôm nay.
          </p>
          
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl inline-flex items-center gap-4 shadow-2xl shadow-indigo-900/50">
             <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full border-2 border-indigo-900" alt="User" />
                <img src="https://i.pravatar.cc/100?img=32" className="w-10 h-10 rounded-full border-2 border-indigo-900" alt="User" />
                <img src="https://i.pravatar.cc/100?img=9" className="w-10 h-10 rounded-full border-2 border-indigo-900" alt="User" />
             </div>
             <div className="text-sm">
                <p className="font-bold text-white">10k+ Thành viên</p>
                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                    <span>★★★★★</span>
                    <span className="text-indigo-200 ml-1">(4.9/5)</span>
                </div>
             </div>
          </div>
        </div>

        {/* Footer nhỏ */}
        <div className="relative z-10 text-sm text-indigo-300/60 font-medium">
          © 2024 Khoi's App Service. Built for better life.
        </div>
      </div>

      {/* --- CỘT PHẢI (55%): Form --- */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 md:p-12 bg-white relative">
        {/* Decor nền nhẹ cho bên phải */}
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

        <div className="w-full max-w-md bg-white p-2 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">
              {isLogin ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? "Vui lòng đăng nhập để tiếp tục trải nghiệm" : "Điền thông tin bên dưới để bắt đầu"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {!isLogin && (
               <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Họ tên</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 group-hover:border-indigo-300"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
               </div>
            )}

            <div className="group">
               {/* CHANGE 3: Label đổi thành Email/Username */}
               <label className="block text-sm font-semibold text-slate-700 mb-2">Email hoặc Tên đăng nhập</label>
               {/* CHANGE 4: type="text" để không bắt buộc @ */}
               <input 
                  type="text" 
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 group-hover:border-indigo-300"
                  placeholder="name@example.com hoặc username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
               />
            </div>

            <div className="group">
               <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu</label>
               <input 
                  type="password" 
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 group-hover:border-indigo-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
            </div>

            {!isLogin && (
              <div className="mt-2 p-1 bg-slate-100 rounded-2xl">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("client")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                      role === "client" 
                      ? "bg-white text-indigo-700 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                  >
                    <UserIcon /> Tìm người giúp
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("worker")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                      role === "worker" 
                      ? "bg-white text-indigo-700 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
                  >
                    <WorkIcon /> Tìm việc làm
                  </button>
                </div>
              </div>
            )}

            {/* CHANGE 5: Nút bấm dùng Gradient đẹp hơn */}
            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/30 transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Đang xử lý...
                </span>
              ) : (
                isLogin ? "Đăng nhập ngay" : "Tạo tài khoản"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors ml-1"
            >
              {isLogin ? "Đăng ký miễn phí" : "Đăng nhập tại đây"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};