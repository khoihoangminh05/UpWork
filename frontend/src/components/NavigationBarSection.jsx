import { useAuth } from "@/context/AuthContext";
import multiavatar from "@multiavatar/multiavatar";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; 

export const NavigationBarSection = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null); 

  const svg = multiavatar(user?.avatarSeed || "example");
  const encoded = btoa(unescape(encodeURIComponent(svg)));

  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const navigationLinks = [
    { label: "Trang chủ", href: "#home" },
    { label: "Về chúng tôi", href: "#about" },
    { label: "Liên hệ", href: "#contact" },
  ];

  return (

    <header className="sticky  top-0 left-0 w-full h-20 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 h-full flex items-center justify-between">
        
        
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
            <img src="/upwork.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-roboto font-bold text-gray-800 text-2xl tracking-tight group-hover:text-purple-600 transition-colors">
            Iclean
          </h1>
        </Link>

        {/* --- MENU LINKS (Ẩn trên mobile, hiện trên Desktop) --- */}
        <nav className="hidden md:flex items-center gap-8">
          {navigationLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-gray-600 font-medium hover:text-purple-600 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-purple-600 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* --- AUTH BUTTONS / USER DROPDOWN --- */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              {/* Nút Đăng nhập: Ghost button */}
              <Link 
                to="/login" 
                className="hidden sm:block px-4 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Đăng nhập
              </Link>
              
              {/* Nút Đăng ký: Primary button gradient */}
              <Link 
                to="/register" 
                className="px-5 py-2.5 rounded-full bg-black text-white font-medium shadow-lg hover:shadow-xl hover:bg-gray-800 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Đăng ký
              </Link>
            </>
          ) : (
            // --- USER LOGGED IN ---
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:shadow-md bg-white transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                  <img
                    src={`data:image/svg+xml;base64,${encoded}`}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Ẩn tên trên màn hình quá nhỏ */}
                <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">
                  {user?.name || "Bạn"}
                </span>
                
                {/* Icon mũi tên nhỏ */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50 mb-1">
                    <p className="text-sm font-medium text-gray-900">{user?.name || "Người dùng"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  >
                    👤 Thông tin cá nhân
                  </Link>
                   <Link
                    to="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  >
                    ⚙️ Cài đặt
                  </Link>
                  
                  <div className="border-t border-gray-50 my-1"></div>
                  
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};