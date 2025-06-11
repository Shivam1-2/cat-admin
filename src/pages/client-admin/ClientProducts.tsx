import React, { useState } from 'react';
import { mockProducts } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Package, 
  Upload,
  Check,
  X,
  Clock,
  DollarSign,
  FileText,
  Download,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ClientProducts: React.FC = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'supplier' | 'internal'>('supplier');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSupplier, setFilterSupplier] = useState<string>(location.state?.filterSupplier || '');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Mock internal products uploaded by buyers
  const internalProducts = [
    {
      id: 'INT-001',
      name: 'Custom Office Supplies Bundle',
      description: 'Bulk office supplies for quarterly needs',
      category: 'Office Supplies',
      proposedPrice: 299.99,
      uploadedBy: 'Jessica User',
      uploadDate: '2023-09-15T10:30:00Z',
      status: 'pending_approval',
      internalId: 'BULK-Q3-2023'
    },
    {
      id: 'INT-002',
      name: 'Marketing Materials Package',
      description: 'Brochures, business cards, and promotional items',
      category: 'Marketing',
      proposedPrice: 450.00,
      uploadedBy: 'Alex New',
      uploadDate: '2023-09-14T14:20:00Z',
      status: 'approved',
      internalId: 'MKT-PACK-001'
    }
  ];

  // Filter products based on active tab
  const getFilteredProducts = () => {
    if (activeTab === 'supplier') {
      return mockProducts.filter(product => {
        const matchesSearch = searchTerm === '' || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesSupplier = filterSupplier === '' || product.supplierId === filterSupplier;
        const matchesCategory = filterCategory === '' || product.category === filterCategory;
        
        return matchesSearch && matchesSupplier && matchesCategory;
      });
    } else {
      return internalProducts.filter(product =>
        searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  const filteredProducts = getFilteredProducts();

  // Get unique suppliers and categories
  const suppliers = Array.from(new Set(mockProducts.map(product => product.supplierName)));
  const categories = Array.from(new Set([
    ...mockProducts.map(product => product.category),
    ...internalProducts.map(product => product.category)
  ]));

  const handleApproveProduct = (product: any) => {
    setSelectedProduct(product);
    setShowApprovalModal(true);
  };

  const handleViewProductDetail = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetailModal(true);
  };

  const handleAddToCart = (product: any) => {
    console.log('Adding to cart:', product);
    // Implement add to cart functionality
  };

  const handleDownloadTemplate = () => {
    // Create a sample CSV content
    const csvContent = `name,description,category,price,internal_id
"Sample Product 1","Description for product 1","Office Supplies",29.99,"SAMPLE-001"
"Sample Product 2","Description for product 2","Electronics",149.99,"SAMPLE-002"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-600 mt-1">Browse supplier catalogs and manage internal products</p>
          {location.state?.supplierName && (
            <p className="text-sm text-purple-600 mt-1">Viewing products from: {location.state.supplierName}</p>
          )}
        </div>
        {activeTab === 'internal' && (
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center bg-purple-600 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
          >
            <Upload size={16} className="mr-2" />
            Upload Products
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-purple-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'supplier'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('supplier')}
          >
            Supplier Catalogs ({mockProducts.length})
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'internal'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('internal')}
          >
            Internal Products ({internalProducts.length})
          </button>
        </nav>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <Package size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-xl font-semibold text-gray-900">
                {activeTab === 'supplier' ? mockProducts.length : internalProducts.length}
              </p>
            </div>
          </div>
        </div>
        
        {activeTab === 'internal' && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                  <Clock size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {internalProducts.filter(p => p.status === 'pending_approval').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-600">
                  <Check size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Approved</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {internalProducts.filter(p => p.status === 'approved').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                  <DollarSign size={20} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Value</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${internalProducts.reduce((sum, p) => sum + p.proposedPrice, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {activeTab === 'supplier' && (
              <div className="min-w-[150px]">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-purple-200 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
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
            )}
            
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-purple-200 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <button 
              className="inline-flex items-center px-4 py-2 border border-purple-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => {
                setSearchTerm('');
                setFilterSupplier('');
                setFilterCategory('');
              }}
            >
              <Filter size={16} className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                    <Package size={20} className="text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500">
                      {activeTab === 'supplier' ? product.supplierName : `By ${product.uploadedBy}`}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  getBadgeColor(product.status)
                }`}>
                  {product.status?.replace('_', ' ')}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    ${activeTab === 'supplier' ? product.price?.current?.toFixed(2) : product.proposedPrice?.toFixed(2)}
                  </p>
                  {activeTab === 'supplier' && product.price?.proposed && (
                    <p className="text-sm text-purple-600">
                      Proposed: ${product.price.proposed.toFixed(2)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
              
              {activeTab === 'supplier' && product.price?.expiryDate && (
                <p className="text-xs text-gray-500 mb-3">
                  Expires: {format(parseISO(product.price.expiryDate), 'MMM d, yyyy')}
                </p>
              )}
              
              {activeTab === 'internal' && (
                <div className="text-xs text-gray-500 mb-3">
                  <p>Internal ID: {product.internalId}</p>
                  <p>Uploaded: {format(parseISO(product.uploadDate), 'MMM d, yyyy')}</p>
                </div>
              )}
            </div>
            
            <div className="px-4 py-3 bg-purple-25 border-t border-purple-100">
              {activeTab === 'supplier' ? (
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => handleViewProductDetail(product)}
                    className="text-purple-600 hover:text-purple-900 text-sm font-medium flex items-center"
                  >
                    <Eye size={14} className="mr-1" />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center"
                  >
                    <ShoppingCart size={14} className="mr-1" />
                    Add to Cart
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  {product.status === 'pending_approval' ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleApproveProduct(product)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                      >
                        <Check size={14} className="mr-1" />
                        Approve
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center">
                        <X size={14} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {product.status === 'approved' ? 'Approved for use' : 'Rejected'}
                    </span>
                  )}
                  <button className="text-purple-600 hover:text-purple-900 text-sm">
                    <FileText size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowUploadModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Upload Internal Products
              </h3>
              
              <div className="mt-4">
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center">
                  <Upload size={48} className="mx-auto text-purple-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload CSV or XLSX file with product information
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Required fields: name, description, category, price, internal_id
                  </p>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm cursor-pointer"
                  >
                    Choose File
                  </label>
                </div>
                
                <div className="mt-4">
                  <button 
                    onClick={handleDownloadTemplate}
                    className="text-purple-600 hover:text-purple-900 text-sm flex items-center"
                  >
                    <Download size={16} className="mr-1" />
                    Download Template
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowUploadModal(false)}
              >
                Upload
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowUploadModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductDetailModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowProductDetailModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Product Details
              </h3>
              
              <div className="mt-4">
                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Supplier:</span> {selectedProduct.supplierName}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span> {selectedProduct.category}
                    </div>
                    <div>
                      <span className="font-medium">SKU:</span> {selectedProduct.sku}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> ${selectedProduct.price?.current?.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {selectedProduct.status}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {format(parseISO(selectedProduct.price?.expiryDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setShowProductDetailModal(false);
                }}
              >
                <ShoppingCart size={16} className="mr-2" />
                Add to Cart
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowProductDetailModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowApprovalModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Approve Internal Product
              </h3>
              
              <div className="mt-4">
                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span> {selectedProduct.category}
                    </div>
                    <div>
                      <span className="font-medium">Price:</span> ${selectedProduct.proposedPrice?.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Uploaded by:</span> {selectedProduct.uploadedBy}
                    </div>
                    <div>
                      <span className="font-medium">Internal ID:</span> {selectedProduct.internalId}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="approval-notes" className="block text-sm font-medium text-gray-700">
                    Approval Notes (Optional)
                  </label>
                  <textarea
                    id="approval-notes"
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="Add any notes about this approval..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                onClick={() => setShowApprovalModal(false)}
              >
                <Check size={16} className="mr-2" />
                Approve
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowApprovalModal(false)}
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

export default ClientProducts;