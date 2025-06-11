import React from 'react';
import { 
  Users as UsersIcon, 
  ShoppingCart, 
  Clock, 
  AlertTriangle, 
  DollarSign 
} from 'lucide-react';
import { 
  mockActivityLogs, 
  getActiveUsers, 
  getRecentOrders, 
  getPendingPriceApprovals, 
  getExpiringPrices
} from '../data/mockData';
import { formatDistanceToNow } from 'date-fns';

const Dashboard: React.FC = () => {
  const activeUsers = getActiveUsers();
  const recentOrders = getRecentOrders();
  const pendingPriceApprovals = getPendingPriceApprovals();
  const expiringPrices = getExpiringPrices();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-primary-100 text-primary-600">
            <UsersIcon size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Active Users</p>
            <p className="text-2xl font-semibold text-gray-900">{activeUsers.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-warning-100 text-warning-600">
            <ShoppingCart size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
            <p className="text-2xl font-semibold text-gray-900">
              {mockActivityLogs.filter(log => log.action === 'placed_order').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-success-100 text-success-600">
            <DollarSign size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Price Approvals</p>
            <p className="text-2xl font-semibold text-gray-900">{pendingPriceApprovals.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className="p-3 rounded-full bg-danger-100 text-danger-600">
            <Clock size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Expiring Prices</p>
            <p className="text-2xl font-semibold text-gray-900">{expiringPrices.length}</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-0 gap-6">
        {/* Activity Feed */}
        
        <div className="lg:col-span-2 bg-white rounded-lg shadow hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="max-h-96-test overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {mockActivityLogs.slice(0, 10).map((log) => (
                <li key={log.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
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
        
        {/* Priority Alerts */}
        <div className="bg-white rounded-lg shadow hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Priority Alerts</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="border-l-4 border-warning-500 bg-warning-50 p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-warning-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-warning-800">
                    {pendingPriceApprovals.length} Pending Price Approvals
                  </p>
                  <p className="mt-1 text-xs text-warning-700">
                    Requires your attention to approve or reject
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-danger-500 bg-danger-50 p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-danger-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-danger-800">
                    {expiringPrices.length} Prices Expiring Soon
                  </p>
                  <p className="mt-1 text-xs text-danger-700">
                    Prices will expire within the next 7 days
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-primary-500 bg-primary-50 p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShoppingCart className="h-5 w-5 text-primary-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-primary-800">
                    {recentOrders.length} Recent Orders
                  </p>
                  <p className="mt-1 text-xs text-primary-700">
                    Orders placed in the last 2 days
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

export default Dashboard;