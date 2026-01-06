import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) return <div>Loading...</div>; 
  if (user?.role !== "admin") return <Navigate to="/login" replace />;

  return children;
}

