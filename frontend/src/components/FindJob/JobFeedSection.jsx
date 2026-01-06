import React from "react";
//import vector200 from "./vector-200.svg";
import vector200 from "../../assets/image.svg";
import { useNavigate } from "react-router";
 

export const JobFeedSection = () => { 
  const navigate = useNavigate();
  return (
    <section className="flex items-center justify-center gap-[60px] px-[10px] py-[60px] relative self-stretch w-full flex-[0_0_auto] overflow-hidden">
      <div className="flex flex-col items-center gap-6 relative flex-1 grow">
        <h2 className="w-[520px] mt-[-1.00px] [font-family:'Roboto-Bold',Helvetica] font-bold text-black text-[40px] text-center leading-[48px] relative tracking-[0]">
          Available Jobs
        </h2>

        <p className="relative w-[520px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-6">
          Find jobs that match your skills.
        </p>

        <div className="inline-flex items-start gap-3 relative flex-[0_0_auto]">
          <button
            className="flex flex-col w-60 items-center justify-center p-3 relative rounded-lg border border-solid border-black bg-transparent cursor-pointer transition-colors hover:bg-gray-50"
            aria-label="View My Jobs"
            onClick={() => navigate("/portfolio")}
          >
            <span className="w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-base leading-6 whitespace-nowrap relative tracking-[0]">
              View My Jobs
            </span>
          </button>

          <button
            className="flex flex-col w-60 items-center justify-center p-3 relative bg-black rounded-lg cursor-pointer transition-colors hover:bg-gray-800"
            aria-label="Post a Job"
            onClick={() => navigate("/postjob")}
          >
            <span className="w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-white text-base leading-6 whitespace-nowrap relative tracking-[0]">
              Post a Job
            </span>
          </button>
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