import React from "react";
import { Search, UserCheck, MapPin } from "lucide-react";
import vector2003 from "../../assets/vector.svg";

export const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      title: "Search for Services",
      description: "Simply enter a service request in the search bar.",
      icon: <Search className="w-8 h-8" />,
      color: "from-purple-600 to-blue-500",
    },
    {
      id: 2,
      title: "Choose a Provider",
      description: "Review the profiles and choose the right provider.",
      icon: <UserCheck className="w-8 h-8" />,
      color: "from-green-400 to-emerald-600",
    },
    {
      id: 3,
      title: "Get Help",
      description: "Your chosen service provider will arrive at your doorstep.",
      icon: <MapPin className="w-8 h-8" />,
      color: "from-pink-300 to-purple-400",
    },
  ];

  return (
    <section className="flex flex-col items-center justify-center gap-8 px-6 md:px-12 lg:px-36 py-16 relative w-full overflow-hidden">
      <header className="flex flex-col items-center gap-4 w-full max-w-4xl text-center">
        <h2 className="font-bold text-black text-[40px] leading-[48px]">How it Works</h2>
        <p className="text-base text-gray-700 max-w-xl">
          Simple steps to get the help you need.
        </p>
      </header>

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <article
              key={step.id}
              className="flex flex-col gap-4 p-4 rounded-md border border-[#0000001a] hover:shadow-md transition-shadow duration-200 bg-white"
            >
              <div className="flex items-center gap-4">
                <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                  <div className="text-white">
                    {step.icon}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium text-lg text-black">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <img
        className="absolute w-full left-0 bottom-px h-px object-cover"
        alt=""
        src={vector2003}
        role="presentation"
      />
    </section>
  );
};
