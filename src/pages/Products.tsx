import React, { useState } from 'react';
import { mockProducts, Product } from '../data/mockData';
import { 
  Search, 
  Filter, 
  Package, 
  ChevronLeft,
  ChevronRight,
  FileText,
  Settings,
  X,
  RefreshCw
} from 'lucide-react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';

const Products: React.FC = () => {
  const [view, setView] = useState<'approval' | 'active'>('approval');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSupplier, setFilterSupplier] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('');
  const [showPriceChangeModal, setShowPriceChangeModal] = useState(false);
  const [showAuditTrailModal, setShowAuditTrailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Get unique suppliers for filter
  const suppliers = Array.from(new Set(mockProducts.map(product => product.supplierName)));
  
  // Filter products based on view, search, and filters
  const getFilteredProducts = () => {
    let filtered = [...mockProducts];
    
    // Filter by view
    if (view === 'approval') {
      filtered = filtered.filter(product => product.price.approvalStatus === 'pending');
    } else if (view === 'active') {
      filtered = filtered.filter(product => product.status === 'active');
    }
    
    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply supplier filter
    if (filterSupplier) {
      filtered = filtered.filter(product => product.supplierId === filterSupplier);
    }
    
    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(product => product.status === filterStatus);
    }
    
    // Apply date range filter
    if (filterDateRange) {
      const today = new Date();
      let startDate = new Date();
      
      if (filterDateRange === '7d') {
        startDate.setDate(today.getDate() - 7);
      } else if (filterDateRange === '30d') {
        startDate.setDate(today.getDate() - 30);
      } else if (filterDateRange === '90d') {
        startDate.setDate(today.getDate() - 90);
      }
      
      filtered = filtered.filter(product => 
        isAfter(new Date(product.lastModified), startDate)
      );
    }
    
    return filtered;
  };
  
  const filteredProducts = getFilteredProducts();
  
  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  
  const handlePriceChangeView = (product: Product) => {
    setSelectedProduct(product);
    setShowPriceChangeModal(true);
  };
  
  const handleViewAuditTrail = (product: Product) => {
    setSelectedProduct(product);
    setShowAuditTrailModal(true);
  };
  
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'pending_approval':
        return 'bg-warning-100 text-warning-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'approved':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Catalogs</h1>
      </div>
      
      {/* View Toggle */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            view === 'approval'
              ? 'bg-primary-100 text-primary-800 border border-primary-300'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setView('approval')}
        >
          Approval Queue ({mockProducts.filter(p => p.price.approvalStatus === 'pending').length})
        </button>
        
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            view === 'active'
              ? 'bg-primary-100 text-primary-800 border border-primary-300'
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setView('active')}
        >
          Active Catalog
        </button>
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier, index) => (
                  <option key={index} value={mockProducts.find(p => p.supplierName === supplier)?.supplierId || ''}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>
            
            {view === 'active' && (
              <div className="min-w-[150px]">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                  <option value="pending_approval">Pending Approval</option>
                </select>
              </div>
            )}
            
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
      
      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                        <Package size={20} className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.supplierName}</div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.current.toFixed(2)}</div>
                    {product.price.proposed && (
                      <div className={`text-sm ${
                        product.price.proposed > product.price.current 
                          ? 'text-danger-600' 
                          : 'text-success-600'
                      }`}>
                        {/* {product.price.proposed > product.price.current ? '↑' : '↓'} ${product.price.proposed.toFixed(2)} */}
                        <span className="text-xs text-gray-500 ml-1">
                          ({product.price.approvalStatus})
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getBadgeColor(product.status)
                    }`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(parseISO(product.price.expiryDate), 'MMM d, yyyy')}
                    </div>
                    {isBefore(parseISO(product.price.expiryDate), new Date(new Date().setDate(new Date().getDate() + 7))) && (
                      <div className="text-xs text-danger-600">
                        Expiring soon
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {product.price.approvalStatus === 'pending' && (
                        <button 
                          className="text-primary-600 hover:text-primary-900"
                          onClick={() => handlePriceChangeView(product)}
                        >
                          <Settings size={18} />
                        </button>
                      )}
                      <button 
                        className="text-primary-600 hover:text-primary-900"
                        onClick={() => handleViewAuditTrail(product)}
                      >
                        <FileText size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredProducts.length)}</span> of{' '}
                <span className="font-medium">{filteredProducts.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Price Change Modal */}
      {showPriceChangeModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowPriceChangeModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Price Change Approval
              </h3>
              
              <div className="mt-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center">
                      <Package size={20} className="text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{selectedProduct.name}</div>
                      <div className="text-sm text-gray-500">
                        {selectedProduct.supplierName} • SKU: {selectedProduct.sku}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm font-medium text-gray-500">Current Price</div>
                    <div className="mt-1 text-xl font-semibold text-gray-900">
                      ${selectedProduct.price.current.toFixed(2)}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Expiry: {format(parseISO(selectedProduct.price.expiryDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm font-medium text-gray-500">Proposed Price</div>
                    <div className={`mt-1 text-xl font-semibold ${
                      selectedProduct.price.proposed && selectedProduct.price.proposed > selectedProduct.price.current 
                        ? 'text-danger-600' 
                        : 'text-success-600'
                    }`}>
                      ${selectedProduct.price.proposed?.toFixed(2)}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {selectedProduct.price.proposed && selectedProduct.price.proposed > selectedProduct.price.current 
                        ? `Increase: +${((selectedProduct.price.proposed - selectedProduct.price.current) / selectedProduct.price.current * 100).toFixed(1)}%` 
                        : `Decrease: ${((selectedProduct.price.proposed! - selectedProduct.price.current) / selectedProduct.price.current * 100).toFixed(1)}%`
                      }
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Reason for Change</h4>
                  <div className="mt-2 bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                    {selectedProduct.price.proposed && selectedProduct.price.proposed > selectedProduct.price.current 
                      ? "Increase due to rising material costs and supply chain issues." 
                      : "Decrease due to improved manufacturing efficiency and volume discount."
                    }
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="approvalNotes" className="block text-sm font-medium text-gray-700">
                    Approval Notes (Optional)
                  </label>
                  <textarea
                    id="approvalNotes"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Add any notes about this price change approval..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-success-600 text-base font-medium text-white hover:bg-success-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success-500 sm:col-start-2 sm:text-sm"
                onClick={() => setShowPriceChangeModal(false)}
              >
                Approve
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger-600 text-base font-medium text-white hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowPriceChangeModal(false)}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Audit Trail Modal */}
      {showAuditTrailModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowAuditTrailModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Product Audit Trail
              </h3>
              
              <div className="mt-2">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md flex items-center justify-center">
                      <Package size={20} className="text-gray-500" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{selectedProduct.name}</div>
                      <div className="text-sm text-gray-500">
                        {selectedProduct.supplierName} • SKU: {selectedProduct.sku}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getBadgeColor(selectedProduct.status)
                      }`}>
                        {selectedProduct.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 hidden">
                  <h4 className="text-sm font-medium text-gray-900">Modification History</h4>
                  
                  <div className="mt-2 flow-root">
                    <ul className="-mb-8">
                      {selectedProduct.modificationHistory.length > 0 ? (
                        selectedProduct.modificationHistory.map((change, index) => (
                          <li key={index}>
                            <div className="relative pb-8">
                              {index !== selectedProduct.modificationHistory.length - 1 ? (
                                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                                    <RefreshCw size={16} className="text-gray-500" />
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      <span className="font-medium text-gray-900">{change.user}</span> changed {change.field} from{' '}
                                      <span className="font-medium">{change.oldValue}</span> to{' '}
                                      <span className="font-medium">{change.newValue}</span>
                                    </p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    {format(parseISO(change.timestamp), 'MMM d, yyyy')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 p-4 text-center bg-gray-50 rounded-md">
                          No modification history available
                        </div>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Product Details</h4>
                  
                  <div className="mt-2 bg-gray-50 p-4 rounded-md">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Category</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedProduct.category}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Created</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {format(parseISO(selectedProduct.createdAt), 'MMM d, yyyy')}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Current Price</dt>
                        <dd className="mt-1 text-sm text-gray-900">${selectedProduct.price.current.toFixed(2)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Price Expiry</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {format(parseISO(selectedProduct.price.expiryDate), 'MMM d, yyyy')}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                onClick={() => setShowAuditTrailModal(false)}
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

export default Products;