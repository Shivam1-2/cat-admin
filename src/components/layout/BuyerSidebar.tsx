import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Search, 
  Upload,
  ShoppingCart,
  Package,
  Bell
} from 'lucide-react';

interface BuyerSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const BuyerSidebar: React.FC<BuyerSidebarProps> = ({ isMobile, onClose }) => {
  const { currentUser } = useAuth();
  
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/browse', name: 'Browse Catalogs', icon: <Search size={20} /> },
    { path: '/upload', name: 'Upload Needs', icon: <Upload size={20} /> },
    { path: '/cart', name: 'My Cart', icon: <ShoppingCart size={20} /> },
    { path: '/orders', name: 'My Orders', icon: <Package size={20} /> },
    { path: '/notifications', name: 'Notifications', icon: <Bell size={20} /> },
  ];
  
  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white text-gray-900 border-r border-emerald-200 shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 border-b border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="flex items-center space-x-3">
          <ShoppingCart className="h-8 w-8 text-white" />
          <h1 className="text-xl font-bold tracking-wider text-white">Buyer Portal</h1>
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
                    ? 'bg-emerald-100 text-emerald-700 border-r-4 border-emerald-500'
                    : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                }`
              }
            >
              <div className="mr-3 text-gray-500 group-hover:text-emerald-600">{item.icon}</div>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-emerald-200 bg-emerald-25">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-lg font-semibold">
              {currentUser?.name.charAt(0)}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
            <p className="text-xs text-emerald-600 font-medium">{currentUser?.organizationName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerSidebar;