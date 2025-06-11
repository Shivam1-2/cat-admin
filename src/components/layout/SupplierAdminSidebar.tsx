import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Upload,
  BarChart3,
  Eye
} from 'lucide-react';

interface SupplierAdminSidebarProps {
  isMobile?: boolean;
  onClose?: () => void;
}

const SupplierAdminSidebar: React.FC<SupplierAdminSidebarProps> = ({ isMobile, onClose }) => {
  const { currentUser } = useAuth();
  
  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/users', name: 'Internal Users', icon: <Users size={20} /> },
    { path: '/products', name: 'Product Catalog', icon: <Package size={20} /> },
    { path: '/upload', name: 'Upload Products', icon: <Upload size={20} /> },
    { path: '/analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
    { path: '/visibility', name: 'Client Visibility', icon: <Eye size={20} /> },
  ];
  
  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full w-64 bg-white text-gray-900 border-r border-teal-200 shadow-lg">
      <div className="flex items-center justify-center h-16 px-4 border-b border-teal-200 bg-gradient-to-r from-teal-600 to-teal-700">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-white" />
          <h1 className="text-xl font-bold tracking-wider text-white">Supplier Portal</h1>
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
                    ? 'bg-teal-100 text-teal-700 border-r-4 border-teal-500'
                    : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                }`
              }
            >
              <div className="mr-3 text-gray-500 group-hover:text-teal-600">{item.icon}</div>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-teal-200 bg-teal-25">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white text-lg font-semibold">
              {currentUser?.name.charAt(0)}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
            <p className="text-xs text-teal-600 font-medium">{currentUser?.organizationName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierAdminSidebar;