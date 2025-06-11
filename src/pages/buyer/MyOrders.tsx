import React, { useState } from 'react';
import { mockOrders } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Filter, 
  Package, 
  Clock,
  CheckCircle,
  XCircle,
  Building,
  User,
  DollarSign
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const MyOrders: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('');

  // Filter orders for current user
  const myOrders = mockOrders.filter(order => 
    order.buyer.email === currentUser?.email
  );

  // Apply filters
  const filteredOrders = myOrders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || order.status === filterStatus;
    
    // Date range filtering
    let matchesDateRange = true;
    if (filterDateRange) {
      const orderDate = new Date(order.orderDate);
      const today = new Date();
      
      if (filterDateRange === '7d') {
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        matchesDateRange = orderDate >= lastWeek;
      } else if (filterDateRange === '30d') {
        const lastMonth = new Date();
        lastMonth.setDate(today.getDate() - 30);
        matchesDateRange = orderDate >= lastMonth;
      } else if (filterDateRange === '90d') {
        const lastQuarter = new Date();
        lastQuarter.setDate(today.getDate() - 90);
        matchesDateRange = orderDate >= lastQuarter;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'processed':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock size={16} />;
      case 'processed':
        return <Package size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-600 mt-1">Track your submitted material lists and orders</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
              <Package size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold text-gray-900">{myOrders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <Clock size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-gray-900">
                {myOrders.filter(o => o.status === 'submitted' || o.status === 'processed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <CheckCircle size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-xl font-semibold text-gray-900">
                {myOrders.filter(o => o.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <DollarSign size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-xl font-semibold text-gray-900">
                ${myOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-emerald-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-emerald-200 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="processed">Processed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-emerald-200 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
              >
                <option value="">All Time</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            
            <button 
              className="inline-flex items-center px-4 py-2 border border-emerald-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
                setFilterDateRange('');
              }}
            >
              <Filter size={16} className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white rounded-lg shadow-sm border border-emerald-100 overflow-hidden"
            >
              <div className="px-4 py-4 border-b border-emerald-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{order.id}</h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span>{format(parseISO(order.orderDate), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>${order.total.toFixed(2)}</span>
                        <span>•</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{order.supplierName}</p>
                    <p className="text-xs text-gray-500">{order.items.length} items</p>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-emerald-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <Building size={16} className="mr-1" /> Supplier
                    </h4>
                    <p className="mt-1 text-sm">{order.supplierName}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <User size={16} className="mr-1" /> Buyer
                    </h4>
                    <p className="mt-1 text-sm">{order.buyer.name}</p>
                    <p className="text-xs text-gray-500">{order.buyer.department}</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <Package size={16} className="mr-1" /> Items
                    </h4>
                    <p className="mt-1 text-sm">{order.items.length} products</p>
                    <p className="text-xs text-gray-500">Total: ${order.total.toFixed(2)}</p>
                  </div>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-emerald-200">
                    <thead className="bg-emerald-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-emerald-100">
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${item.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-emerald-50">
                      <tr>
                        <th scope="row" colSpan={3} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                          Total
                        </th>
                        <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {/* Order Status Timeline */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center mb-4">
                    <Package size={16} className="mr-2" /> Order Status
                  </h4>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-emerald-300"></div>
                    </div>
                    <div className="relative flex justify-between">
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          order.status !== 'cancelled' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Package size={16} />
                        </div>
                        <span className="mt-2 text-xs text-gray-500">Submitted</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          order.status === 'processed' || order.status === 'completed' 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <Clock size={16} />
                        </div>
                        <span className="mt-2 text-xs text-gray-500">Processed</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          order.status === 'completed' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <CheckCircle size={16} />
                        </div>
                        <span className="mt-2 text-xs text-gray-500">Completed</span>
                      </div>
                      
                      {order.status === 'cancelled' && (
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-red-600 text-white">
                            <XCircle size={16} />
                          </div>
                          <span className="mt-2 text-xs text-gray-500">Cancelled</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-emerald-100 p-8 text-center">
            <Package size={48} className="mx-auto text-emerald-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;