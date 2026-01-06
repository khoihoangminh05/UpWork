import React, { useState } from "react";
import image from "../../assets/image.svg";

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  return (
    <section className="px-[170px] py-[60px] bg-gradient-to-l from-purple-600 to-blue-400 overflow-hidden flex items-center justify-center gap-[60px] relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex flex-col items-start gap-6 relative flex-1 grow">
        <h1 className="relative self-stretch mt-[-1.00px] font-roboto font-bold text-white text-[40px] tracking-[0] leading-[48px]">
          What help do you need today?
        </h1>

        <p className="self-stretch text-white relative [font-family:'Roboto-Regular',Helvetica] font-normal text-base tracking-[0] leading-6">
          Find trusted services in your area.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col w-[360px] items-start justify-center gap-1 relative flex-[0_0_auto]"
        >
          <label htmlFor="service-search" className="sr-only">
            Enter your service needs
          </label>
          <input
            id="service-search"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Enter your service needs..."
            className="flex items-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-md border border-solid border-[#0000001a] h-9 [font-family:'Roboto-Regular',Helvetica] font-normal text-[#00000080] text-sm tracking-[0] leading-5 placeholder:text-[#00000080] focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            aria-label="Search for services"
          />

          <button
            type="submit"
            className="inline-flex flex-col items-start gap-3 relative flex-[0_0_auto] mt-5"
            aria-label="Search for services"
          >
            <div className="flex flex-col w-60 items-center justify-center p-3 relative flex-[0_0_auto] bg-black rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200 focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-[#00000099]">
              <span className="relative w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-white text-base tracking-[0] leading-6 whitespace-nowrap">
                Search
              </span>
            </div>
          </button>
        </form>
      </div>

      <div
        className="h-[400px] flex-1 grow flex items-start relative"
        role="img"
        aria-label="Hero section image placeholder"
      >
        <img src="abc.jpg" />
        <div className="flex-1 grow bg-[#d8d8d880] relative self-stretch" />
      </div>

      <img
        className="absolute w-full left-0 bottom-px h-px object-cover"
        alt=""
        src={image}
        role="presentation"
      />
    </section>
  );
};