import React from "react";
import { LoginFormSection } from "../components/Login/LoginFormSection";

export const LoginPage = ({isLogin}) => {
  return (
    <div className="flex flex-col  items-center pt-10 pb-0 px-0" >
      <LoginFormSection OpenedLogin={isLogin}/>
    </div>
  );
};