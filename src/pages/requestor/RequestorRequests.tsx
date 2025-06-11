import React, { useState } from 'react';
import { mockRequests } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Filter, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  Building,
  User,
  Package,
  DollarSign,
  Eye,
  X
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const RequestorRequests: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Filter requests for current user
  const myRequests = mockRequests.filter(request => 
    request.requestorId === currentUser?.id
  );

  // Apply filters
  const filteredRequests = myRequests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.items.some(item => item.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === '' || request.status === filterStatus;
    
    // Date range filtering
    let matchesDateRange = true;
    if (filterDateRange) {
      const requestDate = new Date(request.requestDate);
      const today = new Date();
      
      if (filterDateRange === '7d') {
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        matchesDateRange = requestDate >= lastWeek;
      } else if (filterDateRange === '30d') {
        const lastMonth = new Date();
        lastMonth.setDate(today.getDate() - 30);
        matchesDateRange = requestDate >= lastMonth;
      } else if (filterDateRange === '90d') {
        const lastQuarter = new Date();
        lastQuarter.setDate(today.getDate() - 90);
        matchesDateRange = requestDate >= lastQuarter;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'fulfilled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'fulfilled':
        return <Package size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-sm text-gray-600 mt-1">Track your submitted material requests</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-orange-100 text-orange-600">
              <FileText size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-xl font-semibold text-gray-900">{myRequests.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <Clock size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-gray-900">
                {myRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <CheckCircle size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-xl font-semibold text-gray-900">
                {myRequests.filter(r => r.status === 'approved' || r.status === 'fulfilled').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <DollarSign size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-xl font-semibold text-gray-900">
                ${myRequests.reduce((sum, request) => sum + request.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-orange-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-orange-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
            </div>
            
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-orange-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
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
              className="inline-flex items-center px-4 py-2 border border-orange-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div 
              key={request.id} 
              className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden"
            >
              <div className="px-4 py-4 border-b border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{request.id}</h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span>{format(parseISO(request.requestDate), 'MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>${request.total.toFixed(2)}</span>
                        <span>•</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{request.items.length} items</p>
                    <button
                      onClick={() => handleViewRequest(request)}
                      className="text-orange-600 hover:text-orange-900 text-sm font-medium flex items-center"
                    >
                      <Eye size={14} className="mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-orange-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <User size={16} className="mr-1" /> Requestor
                    </h4>
                    <p className="mt-1 text-sm">{request.requestorName}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <Building size={16} className="mr-1" /> Organization
                    </h4>
                    <p className="mt-1 text-sm">{request.clientName}</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center">
                      <Package size={16} className="mr-1" /> Items
                    </h4>
                    <p className="mt-1 text-sm">{request.items.length} products</p>
                    <p className="text-xs text-gray-500">Total: ${request.total.toFixed(2)}</p>
                  </div>
                </div>
                
                {request.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Request Notes</h4>
                    <p className="text-sm text-gray-600">{request.notes}</p>
                  </div>
                )}
                
                {request.adminComments && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Admin Comments</h4>
                    <p className="text-sm text-blue-700">{request.adminComments}</p>
                  </div>
                )}
                
                <h4 className="font-medium text-gray-900 mb-2">Request Items</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-orange-200">
                    <thead className="bg-orange-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supplier
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
                    <tbody className="bg-white divide-y divide-orange-100">
                      {request.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.supplierName}
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
                    <tfoot className="bg-orange-50">
                      <tr>
                        <th scope="row" colSpan={4} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                          Total
                        </th>
                        <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                          ${request.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-8 text-center">
            <FileText size={48} className="mx-auto text-orange-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-4xl w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowRequestModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Request Details - {selectedRequest.id}
              </h3>
              
              <div className="mt-4">
                <div className="bg-orange-50 p-4 rounded-md mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Request Date:</span> {format(parseISO(selectedRequest.requestDate), 'MMM d, yyyy h:mm a')}
                    </div>
                    <div>
                      <span className="font-medium">Total Items:</span> {selectedRequest.items.length}
                    </div>
                    <div>
                      <span className="font-medium">Total Value:</span> ${selectedRequest.total.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                {selectedRequest.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Request Notes</h4>
                    <p className="text-sm text-gray-600">{selectedRequest.notes}</p>
                  </div>
                )}
                
                {selectedRequest.adminComments && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Admin Comments</h4>
                    <p className="text-sm text-blue-700">{selectedRequest.adminComments}</p>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-orange-200">
                    <thead className="bg-orange-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Supplier
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
                    <tbody className="bg-white divide-y divide-orange-100">
                      {selectedRequest.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.productName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.supplierName}
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
                    <tfoot className="bg-orange-50">
                      <tr>
                        <th scope="row" colSpan={4} className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                          Total
                        </th>
                        <td className="px-6 py-3 text-left text-sm font-medium text-gray-900">
                          ${selectedRequest.total.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:text-sm"
                onClick={() => setShowRequestModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestorRequests;