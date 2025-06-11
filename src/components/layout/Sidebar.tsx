import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Package, 
  Eye, 
  ShoppingCart
} from 'lucide-react';

interface SidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile, onClose }) => {
  const { currentUser } = useAuth();
  
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/users', name: 'Users', icon: <Users size={20} /> },
    { path: '/organizations', name: 'Organizations', icon: <Building2 size={20} /> },
    { path: '/products', name: 'Products', icon: <Package size={20} /> },
    { path: '/visibility-matrix', name: 'Visibility Matrix', icon: <Eye size={20} /> },
    { path: '/orders', name: 'Orders', icon: <ShoppingCart size={20} /> },
  ];
  
  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white text-gray-900 border-r border-gray-200">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <LayoutDashboard className="h-8 w-8 text-primary-600" />
          <h1 className="text-xl font-bold tracking-wider text-gray-900">Catalogue Admin</h1>
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
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <div className="mr-3 text-gray-500 group-hover:text-gray-700">{item.icon}</div>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-lg font-semibold">
              {currentUser?.name.charAt(0)}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;