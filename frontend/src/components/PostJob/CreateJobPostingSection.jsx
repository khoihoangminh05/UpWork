import React from "react";
import vector200 from "../../assets/vector.svg";
import { useNavigate } from "react-router";

export const CreateJobPostingSection = () => {

  const navigate = useNavigate();
  const buttons = [
    {
      id: 1,
      label: "Help",
      variant: "outline",
      bgColor: "bg-transparent",
      textColor: "text-black",
      borderColor: "border-black",
    },
    {
      id: 2,
      label: "View Listings",
      variant: "filled",
      bgColor: "bg-black",
      textColor: "text-white",
      borderColor: "border-black",
    },
  ];

  return (
    <section className="px-[170px] py-[60px] overflow-hidden flex items-center justify-center gap-[60px] relative self-stretch w-full flex-[0_0_auto]">
      <div className="flex flex-col gap-6 flex-1 grow items-center relative">
        <h1 className="w-[520px] mt-[-1.00px] [font-family:'Roboto-Bold',Helvetica] font-bold text-black text-[40px] text-center leading-[48px] relative tracking-[0]">
          Create a Job Posting
        </h1>

        <p className="relative w-[520px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-6">
          Fill in the details below to publish your job.
        </p>

        <div
          className="inline-flex items-start gap-3 relative flex-[0_0_auto]"
          role="group"
        >
          {buttons.map((button) => (
            <button
              key={button.id}
              type="button"
              className={`flex flex-col w-60 items-center justify-center p-3 relative rounded-lg border border-solid ${button.borderColor} ${button.bgColor}`}
              aria-label={button.label}
              onClick={() => navigate("/findjob")}
            >
              <span
                className={`w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium ${button.textColor} text-base leading-6 whitespace-nowrap relative tracking-[0]`}
              >
                {button.label}
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