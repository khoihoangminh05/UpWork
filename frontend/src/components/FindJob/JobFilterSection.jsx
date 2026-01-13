import React from "react";
import { FILTER_OPTIONS } from "@/lib/constants"; // Hoặc import từ file của bạn
import { Filter, X, Check } from "lucide-react"; // Icon cho đẹp

export const JobFilterSection = ({ currentFilters, onFilterChange, onApply, onReset }) => {
  
  const handleToggle = (type, value) => {
    const currentValues = currentFilters[type] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value) // Bỏ chọn
      : [...currentValues, value]; // Chọn thêm

    onFilterChange(type, newValues);
  };

  const renderFilterGroup = (label, type, options) => (
    <div className="flex flex-col gap-3 w-full">
      <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-4 bg-purple-600 rounded-full inline-block"></span>
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = currentFilters[type]?.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleToggle(type, option)}
              className={`
                px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border flex items-center gap-1.5
                ${isSelected 
                  ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200" 
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50"}
              `}
            >
              {isSelected && <Check className="w-3 h-3" />}
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-20 z-30">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        
        {/* --- Header & Actions --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-xl">Bộ lọc tìm kiếm</h2>
              <p className="text-gray-500 text-xs">Tìm công việc phù hợp nhất với bạn</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
             {/* Nút Reset (Chỉ hiện khi có filter) */}
             <button
                type="button"
                onClick={onReset}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1"
             >
                <X className="w-4 h-4" /> Xóa lọc
             </button>

             {/* Nút Apply */}
             <button
                type="button"
                onClick={onApply}
                className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all text-sm"
             >
                Áp dụng
             </button>
          </div>
        </div>

        {/* --- Filter Options Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {renderFilterGroup("Danh mục dịch vụ", "categories", FILTER_OPTIONS.categories)}
          {renderFilterGroup("Hình thức trả lương", "paymentTypes", FILTER_OPTIONS.paymentTypes)}
          {renderFilterGroup("Mức giá", "prices", FILTER_OPTIONS.prices)}
          {renderFilterGroup("Khoảng cách", "distances", FILTER_OPTIONS.distances)}
        </div>

      </div>
    </section>
  );
};