import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

interface SupplierAdminHeaderProps {
  openSidebar: () => void;
}

const SupplierAdminHeader: React.FC<SupplierAdminHeaderProps> = ({ openSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white shadow-sm flex items-center justify-between md:justify-end px-4 md:px-6 border-b border-teal-200">
      {/* Mobile menu button */}
      <button
        type="button"
        className="md:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
        onClick={openSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu size={24} />
      </button>

      <div className="flex items-center space-x-4">
        {/* Profile dropdown */}
        <div className="relative flex-shrink-0">
          <div>
            <button
              className="flex bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 flex items-center justify-center text-white">
                {currentUser?.name.charAt(0)}
              </div>
            </button>
          </div>

          {showDropdown && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              <div className="border-b border-gray-200 px-4 py-2">
                <p className="text-sm font-medium text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                <p className="text-xs text-teal-600 font-medium">{currentUser?.organizationName}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SupplierAdminHeader;