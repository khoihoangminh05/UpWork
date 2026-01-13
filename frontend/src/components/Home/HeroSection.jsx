import React, { useState } from "react";

// Icon kính lúp đơn giản (SVG)
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Nội dung tìm kiếm:", searchQuery);
  };

  return (
    <section className="relative w-full bg-gradient-to-r from-purple-600 to-blue-500 overflow-hidden">
      {/* Trang trí nền (Optional): Các hình tròn mờ tạo chiều sâu */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800 opacity-20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20 lg:py-28 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        
        {/* --- NỘI DUNG BÊN TRÁI --- */}
        <div className="flex flex-col items-start gap-6 flex-1 w-full md:w-1/2 z-10">
          <div className="space-y-4">
            <h1 className="font-bold text-white text-3xl md:text-5xl lg:text-6xl leading-tight md:leading-tight">
              Bạn đang cần <br className="hidden md:block" />
              <span className="text-yellow-300">hỗ trợ gì hôm nay?</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-light max-w-md">
              Tìm kiếm các dịch vụ uy tín quanh khu vực của bạn một cách nhanh chóng và dễ dàng.
            </p>
          </div>

          {/* Thanh tìm kiếm hiện đại */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-lg mt-4"
          >
            <div className="relative flex items-center w-full bg-white rounded-full shadow-xl p-2 transition-transform hover:scale-[1.01] duration-300">
              {/* Ô nhập liệu */}
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="VD: Dọn dẹp nhà, Sửa điều hòa..."
                className="flex-grow px-4 md:px-6 py-2 md:py-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base md:text-lg rounded-full"
                aria-label="Tìm kiếm dịch vụ"
              />
              
              {/* Nút tìm kiếm */}
              <button
                type="submit"
                className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                <SearchIcon />
                <span className="hidden sm:inline">Tìm kiếm</span>
              </button>
            </div>
          </form>

          {/* Dòng cam kết uy tín (Trust badges) */}
          <div className="flex items-center gap-4 text-white/70 text-sm mt-2">
            <span>✓ Đối tác đã xác thực</span>
            <span>✓ Báo giá miễn phí</span>
          </div>
        </div>

        {/* --- HÌNH ẢNH BÊN PHẢI --- */}
        <div className="flex-1 w-full md:w-1/2 flex justify-center md:justify-end relative z-10">
          {/* Khung chứa ảnh */}
          <div className="relative w-full max-w-md aspect-[4/3] group">
            {/* Lớp trang trí xoay nghiêng phía sau */}
            <div className="absolute inset-0 bg-white/20 rounded-2xl transform rotate-3 scale-105 blur-sm transition-transform group-hover:rotate-6 duration-500"></div>
            
            {/* Ảnh chính */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img 
                src="abc.jpg" 
                alt="Minh họa dịch vụ" 
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Lớp phủ gradient nhẹ */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Thẻ nổi (Floating Card) tạo điểm nhấn */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg hidden sm:block animate-bounce-slow">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">★</div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Đánh giá 4.9/5</p>
                        <p className="text-xs text-gray-500">Được khách hàng tin dùng</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};