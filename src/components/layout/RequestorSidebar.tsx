import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  FileText,
  Bell,
  ClipboardList
} from 'lucide-react';

interface RequestorSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const RequestorSidebar: React.FC<RequestorSidebarProps> = ({ isMobile, onClose }) => {
  const { currentUser } = useAuth();
  
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/browse', name: 'Browse Catalogs', icon: <Search size={20} /> },
    { path: '/requests', name: 'My Requests', icon: <FileText size={20} /> },
    { path: '/notifications', name: 'Notifications', icon: <Bell size={20} /> },
  ];
  
  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white text-gray-900 border-r border-orange-200 shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 border-b border-orange-200 bg-gradient-to-r from-orange-600 to-orange-700">
        <div className="flex items-center space-x-3">
          <ClipboardList className="h-8 w-8 text-white" />
          <h1 className="text-xl font-bold tracking-wider text-white">Requestor Portal</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-5 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-sm font-medium rounded-md group transition-colors ${
                  isActive
                    ? 'bg-orange-100 text-orange-700 border-r-4 border-orange-500'
                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                }`
              }
            >
              <div className="mr-3 text-gray-500 group-hover:text-orange-600">{item.icon}</div>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-orange-200 bg-orange-25">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-lg font-semibold">
              {currentUser?.name.charAt(0)}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
            <p className="text-xs text-orange-600 font-medium">{currentUser?.organizationName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestorSidebar;