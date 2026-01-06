import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../config/axios"; 
import { useNavigate } from "react-router";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const navigate = useNavigate();

  // Khi app load, kiểm tra token trong localStorage và fetch user nếu cần
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.get("/auth/me")
        .then(res => {console.log(res); setUser(res.data.user)})
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setInitializing(false)); // chỉ set false khi fetch xong
    } else {
      setInitializing(false); // không có token thì mới set false ngay
    }
  }, []);


 
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData || null); 
  };

  const logout = async () => {
    try {
      // nếu server có api logout thì gọi, không thì chỉ xoá client
      await api.post("/auth/logout").catch(() => {});
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/"); // chuyển về trang login
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, initializing, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
