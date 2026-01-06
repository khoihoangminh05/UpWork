import React from "react";
import vector2002 from "../../assets/vector.svg";
import { Baby, Cog, Home, Wrench } from "lucide-react";

export const OurServicesSection = () => {
  const services = [
  {
    id: 1,
    badge: "Best Choice",
    icon: <Home className="size-25 text-blue-600" />,
    title: "House Cleaning",
    description: "Affordable and thorough cleaning.",
  },
  {
    id: 2,
    badge: "Reliable",
    icon: <Wrench className="size-25 text-green-600" />,
    title: "Plumbing",
    description: "Expert plumbers available.",
  },
  {
    id: 3,
    badge: "Trusted",
    icon: <Baby className="size-25 text-purple-600" />,
    title: "Babysitting",
    description: "Safe and caring babysitters.",
  },
  {
    id: 4,
    badge: "Quick",
    icon: <Cog className="size-25 text-orange-600" />,
    title: "Repairs",
    description: "Fast and efficient repairs.",
  },
];


  return (
    <section className="flex flex-col items-center justify-center gap-[60px] px-[20px] py-[60px] relative  w-full flex-[0_0_auto] overflow-hidden">
      <header className="flex flex-col items-center gap-6 relative self-stretch w-full flex-[0_0_auto]">
        <h2 className="relative w-[520px] mt-[-1.00px] [font-family:'Roboto-Bold',Helvetica] font-bold text-black text-[40px] text-center tracking-[0] leading-[48px]">
          Our Services
        </h2>
      </header>

      <div className=" w-full flex-[0_0_auto] flex flex-col items-center justify-center gap-10 relative">
        <div className="items-start flex gap-5 relative self-stretch w-full flex-[0_0_auto]">
          {services.map((service) => (
            <article
              key={service.id}
              className="border border-solid border-[#0000001a] flex flex-col items-center relative flex-1 grow rounded-md overflow-hidden"
            >
              <div className="flex h-[245px] items-start w-full relative self-stretch">
                <div className="flex-1 grow bg-[#d8d8d880] relative self-stretch">
                  <div className="absolute w-[calc(100%_-_32px)] top-[calc(50.00%_-_8px)] left-4 h-4 flex items-center justify-center [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-xs text-center tracking-[0] leading-4 whitespace-nowrap">
                    {service.icon}
                    {/* <img src="abc.jpg" /> */}
                  </div>

                  <div className="inline-flex flex-col items-center justify-center px-2 py-1 absolute top-0 left-0 bg-[#0000000d] rounded-[6px_0px_6px_0px]">
                    <span className="relative w-fit mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-xs tracking-[0] leading-4 whitespace-nowrap">
                      {service.badge}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start gap-1 p-3 relative self-stretch w-full flex-[0_0_auto]">
                <h3 className="relative self-stretch mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6">
                  {service.title}
                </h3>

                <p className="h-7 [font-family:'Roboto-Medium',Helvetica] font-medium text-xl leading-7 whitespace-nowrap overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] relative self-stretch text-black tracking-[0]">
                  {service.description}
                </p>
              </div>
            </article>
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