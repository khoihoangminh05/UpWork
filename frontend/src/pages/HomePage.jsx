import React from "react";
import { HeroSection } from "../components/Home/HeroSection";
import { OurServicesSection } from "../components/Home/OurServicesSection";
import { HowItWorksSection } from "../components/Home/HowItWorksSection";
import { TrustedReviewsSection } from "../components/Home/TrustedReviewsSection";
import Sidebar from "@/components/AppSidebar";

export const HomePage = () => {
  
  return (

    <main className="flex flex-col items-center pt-20 pb-0 px-0 relative bg-white">
        <HeroSection />
        <OurServicesSection />
        <HowItWorksSection /> 
        <TrustedReviewsSection />
      </main>
   
  );
};