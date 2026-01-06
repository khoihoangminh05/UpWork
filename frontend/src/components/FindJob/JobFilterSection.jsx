import { FILTER_OPTIONS } from "@/lib/constants";
import React from "react";

export const JobFilterSection = ({ currentFilters, onFilterChange, onApply }) => {
  
  const handleToggle = (type, value) => {
    const currentValues = currentFilters[type];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    onFilterChange(type, newValues);
  };

  const renderFilterGroup = (label, type, options) => (
    <div className="flex flex-col gap-3 w-full min-w-[200px]">
      <label className="font-bold text-black text-sm uppercase tracking-wide border-l-4 border-black pl-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = currentFilters[type].includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleToggle(type, option)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                ${isSelected 
                  ? "bg-black text-white border-black shadow-lg transform scale-105" 
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-800 hover:text-black"}
              `}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className="flex flex-col lg:flex-row gap-8 px-6 lg:px-[100px] py-8 w-full border-b border-gray-100 bg-gray-50/50">
      
      <div className="lg:w-1/5 flex flex-col justify-between">
        <div>
          <h2 className="font-extrabold text-black text-3xl leading-tight mb-2">
            Tìm việc
          </h2>
          <p className="text-gray-500 text-sm">Lọc theo nhu cầu của bạn</p>
        </div>
        
        <button
            type="button"
            onClick={onApply}
            className="hidden lg:block mt-6 bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md"
          >
            Áp dụng bộ lọc
          </button>
      </div>

     
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderFilterGroup("Danh mục", "categories", FILTER_OPTIONS.categories)}
        {renderFilterGroup("Hình thức trả lương", "paymentTypes", FILTER_OPTIONS.paymentTypes)}
        {renderFilterGroup("Mức giá", "prices", FILTER_OPTIONS.prices)}
        {renderFilterGroup("Khoảng cách", "distances", FILTER_OPTIONS.distances)}
      </div>

       {/* Nút Apply Mobile */}
       <button
            type="button"
            onClick={onApply}
            className="lg:hidden w-full bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md"
          >
            Áp dụng bộ lọc
      </button>
    </section>
  );
};