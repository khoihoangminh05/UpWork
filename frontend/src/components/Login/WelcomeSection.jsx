import React, { useState } from "react";
import vector200 from "../../assets/vector.svg";

export const WelcomeSection = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const options = [
    { id: "helper", label: "I need a Helper" },
    { id: "work", label: "I want to Work" },
  ];

  const handleOptionClick = (optionId) => {
    setSelectedOption(optionId);
  };

  return (
    <section
      className="flex items-center justify-center gap-[60px] px-[170px] py-[30px] relative self-stretch w-full flex-[0_0_auto] overflow-hidden"
      aria-labelledby="welcome-heading"
    >
      <div className="flex flex-col items-center gap-6 relative flex-1 grow">
        <h1
          id="welcome-heading"
          className="w-[520px] mt-[-1.00px] [font-family:'Roboto-Bold',Helvetica] font-bold text-black text-[40px] text-center leading-[48px] relative tracking-[0]"
        >
          Welcome to Service App
        </h1>

        <p className="w-[520px] text-center relative [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6">
          Connect with Helpers or find Work easily.
        </p>

        <div
          className="inline-flex items-center justify-center gap-3 relative flex-[0_0_auto]"
          role="group"
          aria-label="User type selection"
        >
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className="flex flex-col w-[120px] items-center gap-1 p-2 relative bg-[#d8d8d880] rounded-md hover:bg-[#d8d8d8cc] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors cursor-pointer"
              aria-pressed={selectedOption === option.id}
              type="button"
            >
              <span className="[display:-webkit-box] items-center justify-center self-stretch mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-sm text-center leading-5 overflow-hidden text-ellipsis [-webkit-line-clamp:1] [-webkit-box-orient:vertical] relative tracking-[0]">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <img
        className="absolute w-full left-0 bottom-px h-px object-cover"
        alt=""
        src={vector200}
        role="presentation"
      />
    </section>
  );
};