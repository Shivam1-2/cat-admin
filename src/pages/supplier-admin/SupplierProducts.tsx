import React, { useState } from 'react';
import { mockProducts } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  Filter, 
  Package, 
  Edit,
  Trash,
  Eye,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';
import { format, parseISO, isBefore, addDays } from 'date-fns';

const SupplierProducts: React.FC = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    expiryDate: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});

  // Filter products for current supplier organization
  const supplierProducts = mockProducts.filter(product => 
    product.supplierId === currentUser?.organizationId
  );

  // Apply filters
  const filteredProducts = supplierProducts.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || product.status === filterStatus;
    const matchesCategory = filterCategory === '' || product.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(supplierProducts.map(product => product.category)));

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.current.toString(),
      expiryDate: product.price.expiryDate.split('T')[0]
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDelete = (product: any) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    const errors: any = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!formData.price.trim()) {
      errors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = 'Please enter a valid price';
    }
    
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (new Date(formData.expiryDate) <= new Date()) {
      errors.expiryDate = 'Expiry date must be in the future';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setShowEditModal(false);
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        expiryDate: ''
      });
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    return isBefore(parseISO(expiryDate), addDays(new Date(), 30));
  };

  const isExpired = (expiryDate: string) => {
    return isBefore(parseISO(expiryDate), new Date());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your product catalog and pricing</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-teal-100 text-teal-600">
              <Package size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-xl font-semibold text-gray-900">{supplierProducts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <Check size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-xl font-semibold text-gray-900">
                {supplierProducts.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
              <AlertTriangle size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
              <p className="text-xl font-semibold text-gray-900">
                {supplierProducts.filter(p => isExpiringSoon(p.price.expiryDate) && !isExpired(p.price.expiryDate)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <X size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Expired</p>
              <p className="text-xl font-semibold text-gray-900">
                {supplierProducts.filter(p => isExpired(p.price.expiryDate)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-teal-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-teal-200 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="pending_approval">Pending Approval</option>
              </select>
            </div>
            
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-teal-200 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
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
              className="inline-flex items-center px-4 py-2 border border-teal-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('');
                setFilterCategory('');
              }}
            >
              <Filter size={16} className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-teal-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-teal-200">
            <thead className="bg-teal-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
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
            <tbody className="bg-white divide-y divide-teal-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-teal-25">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-teal-100 rounded-md flex items-center justify-center">
                        <Package size={20} className="text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.current.toFixed(2)}</div>
                    {product.price.proposed && (
                      <div className={`text-sm ${
                        product.price.proposed > product.price.current 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {product.price.proposed > product.price.current ? '↑' : '↓'} ${product.price.proposed.toFixed(2)}
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
                    {isExpired(product.price.expiryDate) && (
                      <div className="text-xs text-red-600">Expired</div>
                    )}
                    {isExpiringSoon(product.price.expiryDate) && !isExpired(product.price.expiryDate) && (
                      <div className="text-xs text-yellow-600">Expiring soon</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-teal-600 hover:text-teal-900"
                        onClick={() => handleEdit(product)}
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(product)}
                        title="Archive Product"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowEditModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Edit Product
              </h3>
              
              <form className="mt-4 space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                      formErrors.name ? 'border-red-300' : ''
                    }`}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    id="edit-description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                      formErrors.description ? 'border-red-300' : ''
                    }`}
                  />
                  {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <input
                      type="text"
                      id="edit-category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                        formErrors.category ? 'border-red-300' : ''
                      }`}
                    />
                    {formErrors.category && <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      id="edit-price"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                        formErrors.price ? 'border-red-300' : ''
                      }`}
                    />
                    {formErrors.price && <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-expiry" className="block text-sm font-medium text-gray-700">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    id="edit-expiry"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${
                      formErrors.expiryDate ? 'border-red-300' : ''
                    }`}
                  />
                  {formErrors.expiryDate && <p className="mt-1 text-sm text-red-600">{formErrors.expiryDate}</p>}
                </div>
              </form>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Product Modal */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowDeleteModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3 text-center sm:mt-5">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Archive Product
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to archive <span className="font-medium">{selectedProduct.name}</span>? 
                  This will make the product unavailable to clients but preserve all data.
                </p>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                onClick={() => {
                  console.log('Archiving product:', selectedProduct.id);
                  setShowDeleteModal(false);
                }}
              >
                Archive
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowDeleteModal(false)}
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

export default SupplierProducts;