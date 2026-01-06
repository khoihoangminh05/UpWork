import React from "react";

export const Footer = () => {
  const footerLinks = [
    { text: "Privacy Policy", width: "w-[124px]" },
    { text: "Terms of Service", width: "w-[150px]" },
    { text: "Contact Us", width: "w-[99px]" },
  ];

  return (
    <footer className="p-[60px] flex items-center justify-center gap-[60px] relative self-stretch w-full flex-[0_0_auto]">
      <nav
        className="inline-flex h-[100px] justify-center gap-[60px] flex-[0_0_auto] items-center relative"
        aria-label="Footer navigation"
      >
        {footerLinks.map((link, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center justify-center self-stretch ${link.width} mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-xl text-center leading-7 relative tracking-[0] hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2`}
          >
            {link.text}
          </a>
        ))}
      </nav>
    </footer>
  );
};