import { useAuth } from './context/AuthContext';
import Sidebar from "./components/AppSidebar.jsx";
import { NavigationBarSection } from './components/NavigationBarSection';
import UserSupportChat from './components/UserSupportChat';
import io from 'socket.io-client';

const socket = io.connect("https://upwork-th3j.onrender.com");

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen flex-col w-full bg-white overflow-hidden">
        
        {user?.role !== "admin" && (
            <UserSupportChat user={user} socket={socket}/>
        )}

        <NavigationBarSection />

        <div className="flex flex-1 w-full overflow-hidden relative">
            {user && (
                <aside className="h-full hidden md:block border-r"> 
                    <Sidebar />
                </aside>
            )}
            <main className="flex-1 w-full h-full overflow-y-auto bg-gray-50/50 relative">
                {children}
            </main>
        </div>
    </div>  
  );    
};

export default AppLayout;