import React, { useState } from 'react';
import { mockOrders, mockProducts, Order } from '../data/mockData';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  Clock,
  XCircle,
  ShoppingCart,
  BarChart,
  User,
  Building,
  DollarSign,
  AlertTriangle,
  Edit,
  Check
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClient, setFilterClient] = useState<string>('');
  const [filterSupplier, setFilterSupplier] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  
  // Get unique clients and suppliers for filters
  const clients = Array.from(new Set(mockOrders.map(order => order.clientName)));
  const suppliers = Array.from(new Set(mockOrders.map(order => order.supplierName)));
  
  // Filter orders
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClient = filterClient === '' || order.clientId === filterClient;
    const matchesSupplier = filterSupplier === '' || order.supplierId === filterSupplier;
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
    
    return matchesSearch && matchesClient && matchesSupplier && matchesStatus && matchesDateRange;
  });
  
  const toggleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  const handleStatusChange = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setShowStatusModal(true);
  };
  
  const updateOrderStatus = () => {
    if (selectedOrder && newStatus) {
      console.log('Updating order status:', {
        orderId: selectedOrder.id,
        oldStatus: selectedOrder.status,
        newStatus,
        note: statusNote,
        updatedBy: 'Current User',
        timestamp: new Date().toISOString()
      });
      setShowStatusModal(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-primary-100 text-primary-800';
      case 'processed':
        return 'bg-warning-100 text-warning-800';
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'cancelled':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock size={16} />;
      case 'processed':
        return <BarChart size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };
  
  const getProductById = (productId: string) => {
    return mockProducts.find(p => p.id === productId);
  };
  
  const getProductPriceApprovalStatus = (item: { productId: string, priceApproved: boolean }) => {
    if (item.priceApproved) {
      return <span className="text-success-600">✓ Approved</span>;
    }
    
    const product = getProductById(item.productId);
    if (product?.price.approvalStatus === 'pending') {
      return <span className="text-warning-600">⚠ Pending Approval</span>;
    }
    
    return <span className="text-danger-600">✗ Not Approved</span>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100 text-primary-600">
              <ShoppingCart size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold text-gray-900">{mockOrders.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-warning-100 text-warning-600">
              <Clock size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-gray-900">
                {mockOrders.filter(o => o.status === 'submitted').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-success-100 text-success-600">
              <CheckCircle size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-xl font-semibold text-gray-900">
                {mockOrders.filter(o => o.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 text-gray-600">
              <DollarSign size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-xl font-semibold text-gray-900">
                ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 hidden">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
              >
                <option value="">All Clients</option>
                {clients.map((client, index) => (
                  <option key={index} value={mockOrders.find(o => o.clientName === client)?.clientId || ''}>
                    {client}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier, index) => (
                  <option key={index} value={mockOrders.find(o => o.supplierName === supplier)?.supplierId || ''}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
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
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => {
                setSearchTerm('');
                setFilterClient('');
                setFilterSupplier('');
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
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div 
                className="px-4 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => toggleOrderExpand(order.id)}
              >
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order);
                        }}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium hover:opacity-80 ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                        <Edit size={12} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {expandedOrder === order.id ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </div>
              </div>
              
              {expandedOrder === order.id && (
                <div className="px-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <Building size={16} className="mr-1" /> Client
                      </h4>
                      <p className="mt-1 text-sm">{order.clientName}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <Building size={16} className="mr-1" /> Supplier
                      </h4>
                      <p className="mt-1 text-sm">{order.supplierName}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <User size={16} className="mr-1" /> Buyer
                      </h4>
                      <p className="mt-1 text-sm">{order.buyer.name}</p>
                      <p className="text-xs text-gray-500">{order.buyer.department}</p>
                    </div>
                  </div>
                  
                  {/* Status History */}
                  <div className="mb-4 bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Status History</h4>
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Current Status: <span className="font-medium">{order.status}</span></span>
                        <span>Last Updated: {format(parseISO(order.orderDate), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                      <div className="mt-1">
                        <span>Approved by: <span className="font-medium">John Admin</span></span>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {getProductPriceApprovalStatus(item)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <th scope="row" colSpan={3} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            Total
                          </th>
                          <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                            ${order.total.toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  {/* Order Status Timeline */}
                  <div className="mt-6 hidden">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center mb-4">
                      <BarChart size={16} className="mr-2" /> Order Status Timeline
                    </h4>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-between">
                        <div className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            order.status !== 'cancelled' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                          }`}>
                            <ShoppingCart size={16} />
                          </div>
                          <span className="mt-2 text-xs text-gray-500">Submitted</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            order.status === 'processed' || order.status === 'completed' 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            <BarChart size={16} />
                          </div>
                          <span className="mt-2 text-xs text-gray-500">Processed</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            order.status === 'completed' 
                              ? 'bg-success-600 text-white' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            <CheckCircle size={16} />
                          </div>
                          <span className="mt-2 text-xs text-gray-500">Completed</span>
                        </div>
                        
                        {order.status === 'cancelled' && (
                          <div className="flex flex-col items-center">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-danger-600 text-white">
                              <XCircle size={16} />
                            </div>
                            <span className="mt-2 text-xs text-gray-500">Cancelled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Warning section for price inconsistencies */}
                  {order.items.some(item => !item.priceApproved) && (
                    <div className="mt-6 bg-warning-50 border-l-4 border-warning-400 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-warning-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-warning-800">Price Approval Warning</h3>
                          <div className="mt-2 text-sm text-warning-700">
                            <p>
                              One or more items in this order have prices that are not yet approved.
                              Please review and approve pricing to finalize the order.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ShoppingCart size={48} className="mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
      
      {/* Status Change Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowStatusModal(false)}
              >
                <span className="sr-only">Close</span>
                <Edit size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Update Order Status
              </h3>
              
              <div className="mt-4">
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Order: {selectedOrder.id}</div>
                    <div className="text-gray-500">Current Status: {selectedOrder.status}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="new-status" className="block text-sm font-medium text-gray-700">
                      New Status
                    </label>
                    <select
                      id="new-status"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="submitted">Submitted</option>
                      <option value="processed">Processed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="status-note" className="block text-sm font-medium text-gray-700">
                      Status Update Note (Optional)
                    </label>
                    <textarea
                      id="status-note"
                      rows={3}
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Add a note about this status change..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                onClick={updateOrderStatus}
              >
                <Check size={16} className="mr-2" />
                Update Status
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;