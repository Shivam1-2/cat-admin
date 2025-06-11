import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ClientAdminLayout from './components/layout/ClientAdminLayout';
import SupplierAdminLayout from './components/layout/SupplierAdminLayout';
import BuyerLayout from './components/layout/BuyerLayout';
import RequestorLayout from './components/layout/RequestorLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Organizations from './pages/Organizations';
import Products from './pages/Products';
import VisibilityMatrix from './pages/VisibilityMatrix';
import Orders from './pages/Orders';
import ClientDashboard from './pages/client-admin/ClientDashboard';
import ClientUsers from './pages/client-admin/ClientUsers';
import ClientSuppliers from './pages/client-admin/ClientSuppliers';
import ClientProducts from './pages/client-admin/ClientProducts';
import ClientOrders from './pages/client-admin/ClientOrders';
import ClientNotifications from './pages/client-admin/ClientNotifications';
import SupplierDashboard from './pages/supplier-admin/SupplierDashboard';
import SupplierUsers from './pages/supplier-admin/SupplierUsers';
import SupplierProducts from './pages/supplier-admin/SupplierProducts';
import SupplierUpload from './pages/supplier-admin/SupplierUpload';
import SupplierAnalytics from './pages/supplier-admin/SupplierAnalytics';
import SupplierVisibility from './pages/supplier-admin/SupplierVisibility';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import BrowseCatalogs from './pages/buyer/BrowseCatalogs';
import UploadNeeds from './pages/buyer/UploadNeeds';
import MyCart from './pages/buyer/MyCart';
import MyOrders from './pages/buyer/MyOrders';
import BuyerNotifications from './pages/buyer/BuyerNotifications';
import RequestorDashboard from './pages/requestor/RequestorDashboard';
import RequestorBrowseCatalogs from './pages/requestor/RequestorBrowseCatalogs';
import RequestorRequests from './pages/requestor/RequestorRequests';
import RequestorNotifications from './pages/requestor/RequestorNotifications';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';

function App() {
  const { currentUser, isImpersonating } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  // Requestor Interface
  if (currentUser.role === 'requestor') {
    return (
      <RequestorLayout>
        {isImpersonating && (
          <div className="bg-orange-100 border-orange-300 border-b px-4 py-2 text-orange-800 flex justify-between items-center">
            <span>
              <span className="font-semibold">Viewing as:</span> {currentUser.name} ({currentUser.role})
            </span>
            <button 
              className="text-sm bg-orange-200 hover:bg-orange-300 px-3 py-1 rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Exit Impersonation
            </button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<RequestorDashboard />} />
          <Route path="/browse" element={<RequestorBrowseCatalogs />} />
          <Route path="/requests" element={<RequestorRequests />} />
          <Route path="/notifications" element={<RequestorNotifications />} />
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </RequestorLayout>
    );
  }

  // Buyer Interface
  if (currentUser.role === 'client_user') {
    return (
      <BuyerLayout>
        {isImpersonating && (
          <div className="bg-emerald-100 border-emerald-300 border-b px-4 py-2 text-emerald-800 flex justify-between items-center">
            <span>
              <span className="font-semibold">Viewing as:</span> {currentUser.name} ({currentUser.role})
            </span>
            <button 
              className="text-sm bg-emerald-200 hover:bg-emerald-300 px-3 py-1 rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Exit Impersonation
            </button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<BuyerDashboard />} />
          <Route path="/browse" element={<BrowseCatalogs />} />
          <Route path="/upload" element={<UploadNeeds />} />
          <Route path="/cart" element={<MyCart />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/notifications" element={<BuyerNotifications />} />
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </BuyerLayout>
    );
  }

  // Supplier Admin Interface
  if (currentUser.role === 'supplier_admin') {
    return (
      <SupplierAdminLayout>
        {isImpersonating && (
          <div className="bg-teal-100 border-teal-300 border-b px-4 py-2 text-teal-800 flex justify-between items-center">
            <span>
              <span className="font-semibold">Viewing as:</span> {currentUser.name} ({currentUser.role})
            </span>
            <button 
              className="text-sm bg-teal-200 hover:bg-teal-300 px-3 py-1 rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Exit Impersonation
            </button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<SupplierDashboard />} />
          <Route path="/users" element={<SupplierUsers />} />
          <Route path="/products" element={<SupplierProducts />} />
          <Route path="/upload" element={<SupplierUpload />} />
          <Route path="/analytics" element={<SupplierAnalytics />} />
          <Route path="/visibility" element={<SupplierVisibility />} />
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </SupplierAdminLayout>
    );
  }

  // Client Admin Interface
  if (currentUser.role === 'client_admin') {
    return (
      <ClientAdminLayout>
        {isImpersonating && (
          <div className="bg-purple-100 border-purple-300 border-b px-4 py-2 text-purple-800 flex justify-between items-center">
            <span>
              <span className="font-semibold">Viewing as:</span> {currentUser.name} ({currentUser.role})
            </span>
            <button 
              className="text-sm bg-purple-200 hover:bg-purple-300 px-3 py-1 rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Exit Impersonation
            </button>
          </div>
        )}
        <Routes>
          <Route path="/" element={<ClientDashboard />} />
          <Route path="/users" element={<ClientUsers />} />
          <Route path="/suppliers" element={<ClientSuppliers />} />
          <Route path="/products" element={<ClientProducts />} />
          <Route path="/orders" element={<ClientOrders />} />
          <Route path="/notifications" element={<ClientNotifications />} />
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </ClientAdminLayout>
    );
  }

  // Master Admin Interface
  return (
    <Layout>
      {isImpersonating && (
        <div className="bg-warning-100 border-warning-300 border-b px-4 py-2 text-warning-800 flex justify-between items-center">
          <span>
            <span className="font-semibold">Viewing as:</span> {currentUser.name} ({currentUser.role})
          </span>
          <button 
            className="text-sm bg-warning-200 hover:bg-warning-300 px-3 py-1 rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            Exit Impersonation
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/organizations" element={<Organizations />} />
        <Route path="/products" element={<Products />} />
        <Route path="/visibility-matrix" element={<VisibilityMatrix />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;