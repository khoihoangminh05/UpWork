import { useAuth } from "@/context/AuthContext";
import multiavatar from "@multiavatar/multiavatar";
import React, { useState } from "react";
import { Link } from "react-router";

export const NavigationBarSection = () => {

  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const svg = multiavatar(user?.avatarSeed || "example");
  const encoded = btoa(unescape(encodeURIComponent(svg)));

  const navigationLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="flex w-full h-20 items-center justify-center gap-5 p-5 absolute top-0 left-0 bg-white shadow-custom-md z-10 sticky">
      <div
        className="relative w-10 h-10 bg-[#0000001a] rounded-4xl cursor-pointer"
        aria-hidden="true"
      >
      <Link to="/dashboard" >
      <div
        className="relative w-10 h-10 bg-[#0000001a] rounded-4xl cursor-pointer"
        aria-hidden="true"
      >
        <img src={"/upwork.png"} /> 
      </div>
      </Link>
      </div>

      <h1 className="flex-1 font-roboto font-medium text-black text-3xl leading-9 relative tracking-[0] ">
        Khoi's App
      </h1>

      <nav
        className="inline-flex items-center justify-center gap-10 relative flex-[0_0_auto] bg-white"
        aria-label="Main navigation"
      >
        {navigationLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="relative w-fit mt-[-1.00px] font-roboto font-normal text-black text-base tracking-[0] leading-6 whitespace-nowrap hover:opacity-70 transition-opacity"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {!isAuthenticated && (
            <>
              <Link to="/login" className="px-3 py-2 rounded-md bg-blue-600 text-white">Đăng nhập</Link>
              <Link to="/register" className="px-3 py-2 rounded-md border">Đăng ký</Link>
            </>
          )}

          {isAuthenticated && (
            <div className="relative z-10">
              <button
                onClick={() => setOpen(prev => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100"
              >
                <img src={`data:image/svg+xml;base64,${encoded}`} 
                             className="size-8 rounded-full mr-2 self-end mb-1"
                        />
                <span className="text-sm">{user?.name || "Bạn"}</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-100 ">
                  <Link to="/profile" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm hover:bg-gray-100">Thông tin</Link>
                  <button
                    onClick={() => { setOpen(false); logout(); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
    </header>
  );
};