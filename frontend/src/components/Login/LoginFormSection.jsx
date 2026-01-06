import React, { useState } from "react";
import image from "../../assets/image.svg";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export const LoginFormSection = ({OpenedLogin}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState("worker");
  const [isLogin, setIsLogin] = useState(OpenedLogin);
  const navigate = useNavigate();
  const { login } = useAuth();
  

  const handleSubmit = async (e) => {
     if(!isLogin) {
     setIsLogin(true);
     return;
    }
    e.preventDefault();
    
    const user = {email, password};
    try {
     
     const res = await api.post('/auth/login', user);
    
    login(res.data.token, res.data.user);

    toast.success("Đăng nhập thành công.");
     console.log(user);
    if(res.data.user.role == "worker") 
          navigate("/findjob");
    else  navigate("/postjob");
    // Bạn có thể redirect hoặc update state user ở đây
  } catch (err) {
    console.error('Login thất bại:', err.response?.data || err.message);
    toast.error("Đăng nhập thất bại.");
  }
  };

  const handleSignUp = async (e) => {
    if(isLogin) {
     setIsLogin(false);
     return;
    }
    e.preventDefault();
    
    const user = {
      fullName,
      email,
      password,
      role: selectedRole
    };
    console.log(user);

      try {
      const res = await api.post('/auth/register', user);
      console.log(res.status);
      toast.success("Đăng ký thành công.");
      setIsLogin(true);

    } catch (err) {
      console.error('Sign-up thất bại:', err.response?.data || err.message);
      toast.success("Đăng ký thất bại.");
    }
    };

  

  return (
    <section className="flex items-center justify-center gap-px px-40 py-15 relative self-stretch w-full flex-[0_0_auto] overflow-hidden">
      <div className="flex flex-col items-start gap-4 relative flex-1 grow ml-30">
        <h1 className="self-stretch mt-[-1.00px] font-roboto font-bold text-black text-4xl leading-[48px] relative tracking-[0]">
          Login / Sign-up
        </h1>

        <p className="self-stretch relative [font-family:'Roboto-Regular',Helvetica] font-normal text-black text-base tracking-[0] leading-6">
          Please enter your details below.
        </p>
      </div>

      <form className="flex-col items-start justify-center gap-7 flex-1 grow flex relative ">
       { !isLogin &&
        (<div className="items-start gap-20 self-stretch w-full flex-[0_0_auto] flex relative">
          <div className="flex flex-col w-[520px] items-start justify-center gap-1 relative">
            <label
              htmlFor="fullname-input"
              className="self-stretch mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-sm leading-5 relative tracking-[0]"
            >
              FullName
            </label>

            <div className="flex items-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-md border border-solid border-[#0000001a]">
              <input
                id="fullnam-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-5 text-black bg-transparent border-none outline-none overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] relative mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap placeholder:text-[#00000080]"
                required
                aria-required="true"
              />
            </div>
          </div>
        </div>)
        }

        <div className="items-start gap-20 self-stretch w-full flex-[0_0_auto] flex relative">
          <div className="flex flex-col w-[520px] items-start justify-center gap-1 relative">
            <label
              htmlFor="email-input"
              className="self-stretch mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-sm leading-5 relative tracking-[0]"
            >
              Email
            </label>

            <div className="flex items-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-md border border-solid border-[#0000001a]">
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-5 text-black bg-transparent border-none outline-none overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] relative mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap placeholder:text-[#00000080]"
                required
                aria-required="true"
              />
            </div>
          </div>
        </div>

        <div className="items-start gap-20 self-stretch w-full flex-[0_0_auto] flex relative">
          <div className="flex flex-col w-[520px] items-start justify-center gap-1 relative">
            <label
              htmlFor="password-input"
              className="self-stretch mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-sm leading-5 relative tracking-[0]"
            >
              Password
            </label>

            <div className="flex items-center gap-1 px-3 py-2 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-md border border-solid border-[#0000001a]">
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="flex-1 h-5 text-black bg-transparent border-none outline-none overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] relative mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap placeholder:text-[#00000080]"
                required
                aria-required="true"
              />
            </div>
          </div>
        </div>
        { !isLogin && 
        <fieldset className="items-start gap-20 self-stretch w-full flex-[0_0_auto] flex relative border-none p-0 m-0">
          <div className="flex flex-col w-[520px] items-center gap-1 relative">
            <legend className="self-stretch mt-[-1.00px] [font-family:'Roboto-Medium',Helvetica] font-medium text-black text-sm leading-5 relative tracking-[0]">
              Toggle Role
            </legend>

            <div
              className="items-start gap-2 self-stretch w-full flex-[0_0_auto] flex relative"
              role="group"
              aria-label="User role selection"
            >
              <button
                type="button"
                onClick={() => setSelectedRole("client")}
                className={`flex-col items-center justify-center p-2 flex-1 grow rounded-md overflow-hidden flex relative transition-colors ${
                  selectedRole === "client"
                    ? "bg-[#0000001a]"
                    : "bg-[#0000000d]"
                }`}
                aria-pressed={selectedRole === "client"}
              >
                <span className="w-fit text-black relative mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap">
                  I need a Helper
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("worker")}
                className={`flex-col items-center justify-center p-2 flex-1 grow rounded-md overflow-hidden flex relative transition-colors ${
                  selectedRole === "worker"
                    ? "bg-[#0000001a]"
                    : "bg-[#0000000d]"
                }`}
                aria-pressed={selectedRole === "worker"}
              >
                <span className="w-fit text-black relative mt-[-1.00px] [font-family:'Roboto-Regular',Helvetica] font-normal text-sm tracking-[0] leading-5 whitespace-nowrap">
                  I want to Work
                </span>
              </button>
            </div>

            <p className="relative self-stretch [font-family:'Roboto-Regular',Helvetica] font-normal text-[#00000080] text-xs tracking-[0] leading-4">
              Choose your role
            </p>
          </div>
        </fieldset>
        }

        <div className="inline-flex items-start gap-3 relative flex-[0_0_auto]">
          <Button 
            variant={isLogin ? "outline" : ""}
            onClick={handleSignUp}
          >
            Sign-up
          </Button>

          <Button 
            variant={!isLogin ? "outline" : ""}
            onClick={handleSubmit}
          >
            Login
          </Button>
        </div>
      </form>

      <img
        className="absolute w-full left-0 bottom-px h-px object-cover"
        alt=""
        src={image}
        aria-hidden="true"
      />
    </section>
  );
};