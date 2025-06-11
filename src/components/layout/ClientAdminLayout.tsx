import React, { useState } from 'react';
import ClientAdminSidebar from './ClientAdminSidebar';
import ClientAdminHeader from './ClientAdminHeader';
import { useAuth } from '../../context/AuthContext';

interface ClientAdminLayoutProps {
  children: React.ReactNode;
}

const ClientAdminLayout: React.FC<ClientAdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useAuth();

  return (
    <div className="flex h-screen bg-purple-50">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex">
        <ClientAdminSidebar />
      </div>
      
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex flex-col w-full max-w-xs h-full bg-white">
            <div className="absolute top-0 right-0 pt-2 pr-2">
              <button
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ClientAdminSidebar isMobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <ClientAdminHeader openSidebar={() => setSidebarOpen(true)} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-purple-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ClientAdminLayout;