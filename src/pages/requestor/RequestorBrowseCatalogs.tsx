import React, { useState } from 'react';
import { mockProducts, mockOrganizations } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Filter, 
  Package, 
  Plus,
  Eye,
  X,
  Minus,
  ChevronLeft,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { format, parseISO, isBefore } from 'date-fns';

const RequestorBrowseCatalogs: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSupplier, setFilterSupplier] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [requestList, setRequestList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid

  // Get available products (only active and not expired)
  const availableProducts = mockProducts.filter(product => 
    product.status === 'active' && 
    !isBefore(parseISO(product.price.expiryDate), new Date())
  );

  // Apply filters
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSupplier = filterSupplier === '' || product.supplierId === filterSupplier;
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    
    return matchesSearch && matchesSupplier && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Get unique suppliers and categories
  const suppliers = Array.from(new Set(availableProducts.map(product => product.supplierName)));
  const categories = Array.from(new Set(availableProducts.map(product => product.category)));

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowProductModal(true);
  };

  const handleAddToRequest = (product: any, qty: number = 1) => {
    const existingItem = requestList.find(item => item.id === product.id);
    
    if (existingItem) {
      setRequestList(requestList.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + qty }
          : item
      ));
    } else {
      setRequestList([...requestList, { ...product, quantity: qty }]);
    }
    
    setShowProductModal(false);
    console.log('Added to request list:', product.name, 'Quantity:', qty);
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = parseISO(expiryDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    return isBefore(expiry, sevenDaysFromNow);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Catalogs</h1>
          <p className="text-sm text-gray-600 mt-1">Discover products from connected suppliers</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {requestList.reduce((sum, item) => sum + item.quantity, 0)} items in request list
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-orange-100 text-orange-600">
              <Package size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Available Products</p>
              <p className="text-xl font-semibold text-gray-900">{availableProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Search size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Suppliers</p>
              <p className="text-xl font-semibold text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <Filter size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-xl font-semibold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <ClipboardList size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Request Items</p>
              <p className="text-xl font-semibold text-gray-900">{requestList.reduce((sum, item) => sum + item.quantity, 0)}</p>
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-orange-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                value={filterSupplier}
                onChange={(e) => setFilterSupplier(e.target.value)}
              >
                <option value="">All Suppliers</option>
                {suppliers.map((supplier, index) => (
                  <option key={index} value={availableProducts.find(p => p.supplierName === supplier)?.supplierId || ''}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-orange-200 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
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
              className="inline-flex items-center px-4 py-2 border border-orange-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              onClick={() => {
                setSearchTerm('');
                setFilterSupplier('');
                setFilterCategory('');
                setCurrentPage(1);
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
        {currentProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm border border-orange-100 overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-orange-100 rounded-md flex items-center justify-center">
                    <Package size={20} className="text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500">{product.supplierName}</p>
                  </div>
                </div>
                {isExpiringSoon(product.price.expiryDate) && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Expiring Soon
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    ${product.price.current.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires: {format(parseISO(product.price.expiryDate), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-orange-25 border-t border-orange-100">
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => handleViewProduct(product)}
                  className="text-orange-600 hover:text-orange-900 text-sm font-medium flex items-center"
                >
                  <Eye size={14} className="mr-1" />
                  View Details
                </button>
                <button 
                  onClick={() => handleAddToRequest(product)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <Plus size={14} className="mr-1" />
                  Add to Request
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-orange-50 border-orange-500 text-orange-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
      )}

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-8 text-center">
          <Package size={48} className="mx-auto text-orange-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowProductModal(false)}
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
                <div className="bg-orange-50 p-4 rounded-md">
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
                      <span className="font-medium">Price:</span> ${selectedProduct.price.current.toFixed(2)}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {selectedProduct.status}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {format(parseISO(selectedProduct.price.expiryDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Total: ${(selectedProduct.price.current * quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => handleAddToRequest(selectedProduct, quantity)}
              >
                <Plus size={16} className="mr-2" />
                Add to Request
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowProductModal(false)}
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

export default RequestorBrowseCatalogs;