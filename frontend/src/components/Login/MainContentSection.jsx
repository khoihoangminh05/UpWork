import React from "react";
import vector2002 from "../../assets/vector.svg";

export const MainContentSection = () => {
  const socialLoginOptions = [
    {
      id: 1,
      name: "Google",
      description: "Log in using your Google account.",
      icons: ["🌐", "📘"],
    },
    {
      id: 2,
      name: "Facebook",
      description: "Log in using your Facebook account.",
      icons: ["🌐", "📘"],
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-[60px] px-[170px] py-[60px] relative self-stretch w-full flex-[0_0_auto] overflow-hidden">
      <header className="flex flex-col items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
        <h2 className="w-[520px] mt-[-1.00px] [font-family:'Roboto-Bold',Helvetica] font-bold text-black text-[40px] text-center leading-[48px] relative tracking-[0]">
          Or log in with
        </h2>

        <p className="w-[520px] text-center relative [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6">
          Choose your social media account
        </p>
      </header>

      <div className="flex-col items-center justify-center gap-10 px-0 py-5 self-stretch w-full flex-[0_0_auto] flex relative">
        <div className="flex items-center gap-10 relative self-stretch w-full flex-[0_0_auto]">
          {socialLoginOptions.map((option) => (
            <button
              key={option.id}
              className="flex items-start justify-center gap-4 p-4 relative flex-1 grow rounded-md border border-solid border-[#0000001a] bg-transparent cursor-pointer hover:bg-gray-50 transition-colors"
              aria-label={`Log in with ${option.name}`}
            >
              <div
                className="flex w-[100px] h-[100px] items-start relative"
                aria-hidden="true"
              >
                <div className="relative flex-1 self-stretch grow bg-[#d8d8d880]" />
              </div>

              <div className="flex flex-col items-start gap-2 relative flex-1 grow">
                <h3 className="self-stretch mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-xl leading-7 relative tracking-[0]">
                  {option.name}
                </h3>

                <p className="relative self-stretch [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6">
                  {option.description}
                </p>

                <div className="flex items-center gap-2 px-0 py-1 relative self-stretch w-full flex-[0_0_auto]">
                  <div
                    className="inline-flex gap-2 flex-[0_0_auto] items-center relative"
                    aria-hidden="true"
                  >
                    {option.icons.map((icon, index) => (
                      <div
                        key={index}
                        className="[display:-webkit-box] justify-center w-6 h-6 mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-6 whitespace-nowrap overflow-hidden text-ellipsis [-webkit-line-clamp:1] [-webkit-box-orient:vertical] items-center relative"
                      >
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <img
        className="absolute w-full left-0 bottom-px h-px object-cover"
        alt=""
        src={vector2002}
        role="presentation"
      />
    </section>
  );
};