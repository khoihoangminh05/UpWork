// Giả định bạn có một Context/Hook quản lý trạng thái đăng nhập
import { useAuth } from './context/AuthContext';
import  Sidebar  from "./components/AppSidebar.jsx";
import { NavigationBarSection } from './components/NavigationBarSection';
import { Button } from './components/ui/button';
import UserSupportChat from './components/UserSupportChat';
import io from 'socket.io-client';
const socket = io.connect("https://upwork-th3j.onrender.com");

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  console.log(user); 
  return (
    <div className="flex h-screen flex-col w-full">
         { 
            (user?.role !== "admin") && 
            <UserSupportChat user={user} socket={socket}/>
        }
        <NavigationBarSection />
        <div className="flex flex-1 ">
            <div className="flex w-full h-full relative">
            {user &&  <Sidebar />}
            
            <main className="flex-1 w-full">
                {children}
            </main>
            </div>
        </div>
    </div>  
  );    
};

export default AppLayout;