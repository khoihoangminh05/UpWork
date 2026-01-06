import React from "react";
import { WelcomeSection } from "../components/Login/WelcomeSection";
import { LoginFormSection } from "../components/Login/LoginFormSection";
import { MainContentSection } from "../components/Login/MainContentSection";

export const LoginPage = ({isLogin}) => {
  return (
    <div className="flex flex-col  items-center pt-10 pb-0 px-0" >
      <WelcomeSection />
      <LoginFormSection OpenedLogin={isLogin}/>
      <MainContentSection />
    </div>
  );
};