import React, { useState } from 'react';
import { mockOrganizations, mockVisibilityMatrix } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  Search, 
  Eye, 
  EyeOff, 
  Package, 
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientSuppliers: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<{ [key: string]: boolean }>({
    '3': true, // Supply Solutions
    '5': true, // Tech Providers
    '6': false, // Factory Direct
  });

  // Get suppliers that are visible to this client
  const availableSuppliers = mockOrganizations.filter(org => 
    org.type === 'supplier' && org.status === 'active'
  );

  // Filter suppliers based on search
  const filteredSuppliers = availableSuppliers.filter(supplier =>
    searchTerm === '' || 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if supplier is visible based on visibility matrix
  const isSupplierVisible = (supplierId: string) => {
    const relation = mockVisibilityMatrix.find(
      rel => rel.supplierId === supplierId && rel.clientId === currentUser?.organizationId
    );
    return relation ? relation.isVisible : false;
  };

  // Toggle connection to supplier
  const toggleConnection = (supplierId: string) => {
    setConnectionStatus(prev => ({
      ...prev,
      [supplierId]: !prev[supplierId]
    }));
  };

  // Handle view catalog
  const handleViewCatalog = (supplierId: string, supplierName: string) => {
    // Navigate to products page with supplier filter
    navigate('/products', { state: { filterSupplier: supplierId, supplierName } });
  };

  // Handle view order history
  const handleViewOrderHistory = (supplierId: string, supplierName: string) => {
    // Navigate to orders page with supplier filter
    navigate('/orders', { state: { filterSupplier: supplierId, supplierName } });
  };

  // Get mock stats for suppliers
  const getSupplierStats = (supplierId: string) => {
    return {
      products: Math.floor(Math.random() * 50) + 10,
      orders: Math.floor(Math.random() * 20) + 1,
      lastOrder: Math.floor(Math.random() * 30) + 1
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supplier Connections</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your supplier relationships and catalog access</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <Building2 size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Available Suppliers</p>
              <p className="text-xl font-semibold text-gray-900">{availableSuppliers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <Eye size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Connected</p>
              <p className="text-xl font-semibold text-gray-900">
                {Object.values(connectionStatus).filter(Boolean).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <Package size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-xl font-semibold text-gray-900">
                {filteredSuppliers.reduce((sum, supplier) => sum + getSupplierStats(supplier.id).products, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-purple-100 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-purple-200 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => {
          const isVisible = isSupplierVisible(supplier.id);
          const isConnected = connectionStatus[supplier.id] || false;
          const stats = getSupplierStats(supplier.id);

          return (
            <div key={supplier.id} className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
              <div className="p-4 border-b border-purple-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                      <Building2 size={24} />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                      <div className="flex items-center mt-1">
                        {isVisible ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Eye size={12} className="mr-1" />
                            Visible
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <EyeOff size={12} className="mr-1" />
                            Not Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {isVisible && (
                    <button
                      onClick={() => toggleConnection(supplier.id)}
                      className="flex items-center"
                      title={isConnected ? 'Disconnect from supplier' : 'Connect to supplier'}
                    >
                      {isConnected ? (
                        <ToggleRight size={32} className="text-purple-500" />
                      ) : (
                        <ToggleLeft size={32} className="text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="px-4 py-3">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail size={14} className="mr-2 text-gray-400" />
                    <span>{supplier.contactEmail}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={14} className="mr-2 text-gray-400" />
                    <span>{supplier.contactPhone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2 text-gray-400" />
                    <span className="truncate">{supplier.address}</span>
                  </div>
                </div>
                
                {isVisible && isConnected && (
                  <div className="mt-4 pt-3 border-t border-purple-100">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{stats.products}</div>
                        <div className="text-xs text-gray-500">Products</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{stats.orders}</div>
                        <div className="text-xs text-gray-500">Orders</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{stats.lastOrder}d</div>
                        <div className="text-xs text-gray-500">Last Order</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-4 py-3 bg-purple-25 flex justify-between items-center">
                {isVisible ? (
                  isConnected ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewCatalog(supplier.id, supplier.name)}
                        className="text-purple-600 hover:text-purple-900 text-sm font-medium flex items-center"
                      >
                        <Package size={14} className="mr-1" />
                        View Catalog
                      </button>
                      <button 
                        onClick={() => handleViewOrderHistory(supplier.id, supplier.name)}
                        className="text-purple-600 hover:text-purple-900 text-sm font-medium flex items-center"
                      >
                        <ShoppingCart size={14} className="mr-1" />
                        Order History
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Connect to access catalog</span>
                  )
                ) : (
                  <span className="text-sm text-gray-500">Not available for connection</span>
                )}
                
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {supplier.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Building2 size={20} className="text-purple-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">About Supplier Connections</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                Connect to suppliers to access their product catalogs and place orders. 
                Only suppliers made visible by your administrator will appear here.
              </p>
              <div className="mt-3 space-y-1">
                <div className="flex items-center">
                  <Eye size={14} className="mr-2 text-green-500" />
                  <span className="text-sm">Visible: Available for connection</span>
                </div>
                <div className="flex items-center">
                  <ToggleRight size={14} className="mr-2 text-purple-500" />
                  <span className="text-sm">Connected: Can access catalog and place orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSuppliers;