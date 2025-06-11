import React from 'react';
import { 
  Users as UsersIcon, 
  ShoppingCart, 
  Package, 
  Building2,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { 
  mockUsers, 
  mockOrganizations, 
  mockProducts, 
  mockOrders,
  mockActivityLogs
} from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const ClientDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Filter data for current client organization
  const internalUsers = mockUsers.filter(user => 
    user.organizationId === currentUser?.organizationId && user.id !== currentUser?.id
  );
  
  const connectedSuppliers = mockOrganizations.filter(org => 
    org.type === 'supplier' && org.status === 'active'
  ).slice(0, 3); // Simulate connected suppliers
  
  const recentOrders = mockOrders.filter(order => 
    order.clientId === currentUser?.organizationId
  ).slice(0, 5);
  
  const pendingApprovals = mockProducts.filter(product => 
    product.price.approvalStatus === 'pending'
  ).length;

  const clientActivityLogs = mockActivityLogs.filter(log => 
    log.user.role === 'client_admin' || log.user.role === 'client_user'
  ).slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-purple-600">{currentUser?.organizationName}</p>
          <p className="text-xs text-gray-500">Client Organization</p>
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <UsersIcon size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Internal Users</p>
            <p className="text-2xl font-semibold text-gray-900">{internalUsers.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
            <Building2 size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Connected Suppliers</p>
            <p className="text-2xl font-semibold text-gray-900">{connectedSuppliers.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <ShoppingCart size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Recent Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{recentOrders.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <Clock size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
            <p className="text-2xl font-semibold text-gray-900">{pendingApprovals}</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-purple-100">
          <div className="px-4 py-5 sm:px-6 border-b border-purple-100">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {clientActivityLogs.map((log) => (
                <li key={log.id} className="px-4 py-4 sm:px-6 hover:bg-purple-25 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white">
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
        <div className="bg-white rounded-lg shadow-sm border border-purple-100">
          <div className="px-4 py-5 sm:px-6 border-b border-purple-100">
            <h3 className="text-lg font-medium text-gray-900">Alerts & Notifications</h3>
          </div>
          <div className="p-4 space-y-4">
            {pendingApprovals > 0 && (
              <div className="border-l-4 border-purple-500 bg-purple-50 p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-800">
                      {pendingApprovals} Price Approvals Pending
                    </p>
                    <p className="mt-1 text-xs text-purple-700">
                      Review and approve product pricing
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
                    New Supplier Connected
                  </p>
                  <p className="mt-1 text-xs text-blue-700">
                    Tech Providers is now available
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 bg-green-50 p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Order Completed
                  </p>
                  <p className="mt-1 text-xs text-green-700">
                    Order #ORD-003 has been delivered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;