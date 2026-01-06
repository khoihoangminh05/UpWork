
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, Briefcase, Search, Users, Settings, ChevronLeft, ChevronRight, MessageSquareText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

// Định nghĩa cấu trúc cho các mục điều hướng
const _navItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: Briefcase, label: 'Post Job', path: '/postjob' },
  { icon: Search, label: 'Find Job', path: '/findjob' },
  { icon: Users, label: 'Portfolio', path: '/portfolio' },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [navItems, setNavItems] = useState(_navItems);
  const { user } = useAuth();

  if(user.role === "admin" && _navItems[3].label === 'Portfolio') {  
     _navItems[4] = { icon: Users, label: 'Management', path: '/management' };
     _navItems[3] = { icon: MessageSquareText, label: 'Support', path: '/support' };
     setNavItems(_navItems);
   }  

    if(user.role !== "admin" && _navItems[3].label !== 'Portfolio') { 
     _navItems[3] =  { icon: Users, label: 'Portfolio', path: '/portfolio' };
     setNavItems(_navItems);
   }
  const containerClass = `
    sticky top-20 left-0 z-10
    flex flex-col h-screen sticky 
    bg-white text-gray-800 border-r
    shadow-lg transition-all duration-300 ease-in-out
    ${isCollapsed ? 'w-20' : 'w-50'} 
  `;

  return (
    <TooltipProvider delayDuration={0}>
      <div className={containerClass} style={{ height: 'calc(100vh - 5rem)' }}>
        
        <div className={`p-4 ${isCollapsed ? 'justify-center' : 'justify-end'} flex`}>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 rounded-full"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <Separator className="bg-gray-200" />

        <nav className="flex flex-col p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarLink 
              key={item.label} 
              icon={item.icon} 
              label={item.label} 
              isCollapsed={isCollapsed} 
              path={item.path} 
            />
          ))}
        </nav>

      </div>
    </TooltipProvider>
  );
};

const SidebarLink = ({ icon: Icon, label, isCollapsed, path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = 
    path === '/' ? currentPath === path : currentPath.startsWith(path);

  // Class CSS cho Button
  const buttonClass = `
    w-full justify-start h-10 
    ${isActive ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'text-gray-700 hover:bg-gray-100'} 
    ${isCollapsed ? 'p-0 justify-center' : 'px-3'}
  `;

  const content = (
    <Button 
      variant="ghost" 
      className={buttonClass}
      onClick={() => navigate(path)}
    >
      <Icon className={`h-5 w-5 ${isCollapsed ? 'mr-0' : 'mr-3'}`} />
      {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
    </Button>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
};

export default Sidebar;