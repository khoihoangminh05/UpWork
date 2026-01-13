import React from "react";
import { LoginPage } from "./pages/LoginPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { FindJobPage } from "./pages/FindJobPage.jsx";
import {BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import { PostJobPage } from "./pages/PostJobPage.jsx";
import AppLayout from "./AppLayout.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import AdminRoute from "./context/AdminRoute.jsx";
import ManagementPage from "./pages/ManagementPage.jsx";
import AdminSupportDashboard from "./components/AdminSupportDashboard.jsx";

export const App = () => {

  return (
    <BrowserRouter>
      <Toaster richColors />
      <AuthProvider>

             <AppLayout className="h-full"> 

              {/* Content area */}
              <main className="flex-1 overflow-auto">
    
                <Routes>
                  <Route path="*" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage isLogin={true} />} />
                  <Route path="/register" element={<LoginPage isLogin={false} />} />

                  <Route
                    path="/findjob"
                    element={
                      <ProtectedRoute>
                        <FindJobPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/postjob"
                    element={ 
                      <ProtectedRoute>
                        <PostJobPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/portfolio"
                    element={ 
                      <ProtectedRoute>
                        <PortfolioPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/support"
                    element={ 
                      <ProtectedRoute>
                        <AdminSupportDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/management"
                    element={ 
                      <AdminRoute>
                        <ManagementPage />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </main>

              </AppLayout> 
              {/* Footer */}
              
      </AuthProvider>
    </BrowserRouter>
  );
};
