import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Search
} from 'lucide-react';
import { 
  mockProducts, 
  mockOrders,
  mockActivityLogs
} from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const BuyerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Mock cart items (would come from cart context/state)
  const cartItems = 3;
  
  // Filter orders for current user
  const myOrders = mockOrders.filter(order => 
    order.buyer.email === currentUser?.email
  );
  
  // Mock uploaded needs
  const uploadedNeeds = 2;
  
  // Recent activity for buyer
  const buyerActivityLogs = mockActivityLogs.filter(log => 
    log.user.role === 'client_user' || log.action === 'placed_order'
  ).slice(0, 6);

  // Mock expiring products
  const expiringProducts = mockProducts.filter(product => 
    new Date(product.price.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 7))
  ).slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-emerald-600">{currentUser?.organizationName}</p>
          <p className="text-xs text-gray-500">Buyer</p>
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-600">
            <ShoppingCart size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Items in Cart</p>
            <p className="text-2xl font-semibold text-gray-900">{cartItems}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Package size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">My Orders</p>
            <p className="text-2xl font-semibold text-gray-900">{myOrders.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Upload size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Uploaded Needs</p>
            <p className="text-2xl font-semibold text-gray-900">{uploadedNeeds}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Clock size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pending Orders</p>
            <p className="text-2xl font-semibold text-gray-900">
              {myOrders.filter(o => o.status === 'submitted' || o.status === 'processed').length}
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-emerald-100">
          <div className="px-4 py-5 sm:px-6 border-b border-emerald-100">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {buyerActivityLogs.map((log) => (
                <li key={log.id} className="px-4 py-4 sm:px-6 hover:bg-emerald-25 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 flex items-center justify-center text-white">
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
        
        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100">
            <div className="px-4 py-5 sm:px-6 border-b border-emerald-100">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              <button 
                onClick={() => navigate('/browse')}
                className="w-full flex items-center justify-between p-3 text-left bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <Search size={16} className="text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Browse Catalogs</span>
                </div>
                <span className="text-emerald-600">→</span>
              </button>
              
              <button 
                onClick={() => navigate('/upload')}
                className="w-full flex items-center justify-between p-3 text-left bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <Upload size={16} className="text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Upload Needs</span>
                </div>
                <span className="text-emerald-600">→</span>
              </button>
              
              <button 
                onClick={() => navigate('/cart')}
                className="w-full flex items-center justify-between p-3 text-left bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <ShoppingCart size={16} className="text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">View Cart</span>
                </div>
                <span className="text-emerald-600">→</span>
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100">
            <div className="px-4 py-5 sm:px-6 border-b border-emerald-100">
              <h3 className="text-lg font-medium text-gray-900">Alerts & Notifications</h3>
            </div>
            <div className="p-4 space-y-4">
              {cartItems > 0 && (
                <div className="border-l-4 border-emerald-500 bg-emerald-50 p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShoppingCart className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-emerald-800">
                        {cartItems} Items in Cart
                      </p>
                      <p className="mt-1 text-xs text-emerald-700">
                        Complete your order before prices expire
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {expiringProducts.length > 0 && (
                <div className="border-l-4 border-yellow-500 bg-yellow-50 p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-yellow-800">
                        {expiringProducts.length} Products Expiring Soon
                      </p>
                      <p className="mt-1 text-xs text-yellow-700">
                        Order now before prices change
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
                      New Products Available
                    </p>
                    <p className="mt-1 text-xs text-blue-700">
                      Check out the latest additions to supplier catalogs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;