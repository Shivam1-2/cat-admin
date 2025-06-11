import React from 'react';
import { 
  Package, 
  Upload, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Users,
  Eye,
  TrendingUp
} from 'lucide-react';
import { 
  mockProducts, 
  mockUsers,
  mockActivityLogs
} from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow, parseISO, isBefore, addDays } from 'date-fns';

const SupplierDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Filter data for current supplier organization
  const supplierProducts = mockProducts.filter(product => 
    product.supplierId === currentUser?.organizationId
  );
  
  const internalUsers = mockUsers.filter(user => 
    user.organizationId === currentUser?.organizationId && user.id !== currentUser?.id
  );
  
  const activeProducts = supplierProducts.filter(product => product.status === 'active');
  const expiredProducts = supplierProducts.filter(product => 
    isBefore(parseISO(product.price.expiryDate), new Date())
  );
  
  const expiringProducts = supplierProducts.filter(product => 
    isBefore(parseISO(product.price.expiryDate), addDays(new Date(), 30)) &&
    !isBefore(parseISO(product.price.expiryDate), new Date())
  );

  const supplierActivityLogs = mockActivityLogs.filter(log => 
    log.user.role === 'supplier_admin' || log.user.role === 'supplier_user'
  ).slice(0, 8);

  // Mock connected clients (would come from visibility matrix)
  const connectedClients = 3;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-teal-600">{currentUser?.organizationName}</p>
          <p className="text-xs text-gray-500">Supplier Organization</p>
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-teal-100 text-teal-600">
            <Package size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <p className="text-2xl font-semibold text-gray-900">{supplierProducts.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <CheckCircle size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Products</p>
            <p className="text-2xl font-semibold text-gray-900">{activeProducts.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Clock size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
            <p className="text-2xl font-semibold text-gray-900">{expiringProducts.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Eye size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Connected Clients</p>
            <p className="text-2xl font-semibold text-gray-900">{connectedClients}</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-teal-100">
          <div className="px-4 py-5 sm:px-6 border-b border-teal-100">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {supplierActivityLogs.map((log) => (
                <li key={log.id} className="px-4 py-4 sm:px-6 hover:bg-teal-25 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 flex items-center justify-center text-white">
                        {log.user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {log.user.name}
                        <span className="ml-1 font-normal text-gray-500">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {log.details}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDistanceToNow(new Date(log.timestamp))} ago
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Alerts */}
        <div className="bg-white rounded-lg shadow-sm border border-teal-100">
          <div className="px-4 py-5 sm:px-6 border-b border-teal-100">
            <h3 className="text-lg font-medium text-gray-900">Alerts & Notifications</h3>
          </div>
          <div className="p-4 space-y-4">
            {expiringProducts.length > 0 && (
              <div className="border-l-4 border-teal-500 bg-teal-50 p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-teal-800">
                      {expiringProducts.length} Products Expiring Soon
                    </p>
                    <p className="mt-1 text-xs text-teal-700">
                      Update pricing before expiration
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-l-4 border-blue-500 bg-blue-50 p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">
                    Catalog Performance
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    {activeProducts.length} active products available to clients
                  </p>
                </div>
              </div>
            </div>
            
            {expiredProducts.length > 0 && (
              <div className="border-l-4 border-red-500 bg-red-50 p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {expiredProducts.length} Products Expired
                    </p>
                    <p className="mt-1 text-xs text-red-700">
                      Update or remove expired products
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;