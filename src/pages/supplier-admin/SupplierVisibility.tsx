import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockOrganizations, mockVisibilityMatrix } from '../../data/mockData';
import { 
  Eye, 
  EyeOff, 
  Building2, 
  Users,
  ShoppingCart,
  TrendingUp,
  Info
} from 'lucide-react';

const SupplierVisibility: React.FC = () => {
  const { currentUser } = useAuth();

  // Get clients and their visibility status for this supplier
  const clients = mockOrganizations.filter(org => 
    org.type === 'client' && 
    org.status === 'active' && 
    org.name !== 'Master Organization'
  );

  // Check visibility status for each client
  const getVisibilityStatus = (clientId: string) => {
    const relation = mockVisibilityMatrix.find(
      rel => rel.supplierId === currentUser?.organizationId && rel.clientId === clientId
    );
    return relation ? relation.isVisible : false;
  };

  // Mock client stats
  const getClientStats = (clientId: string) => {
    return {
      users: Math.floor(Math.random() * 20) + 5,
      orders: Math.floor(Math.random() * 15) + 1,
      revenue: Math.floor(Math.random() * 5000) + 1000,
      lastOrder: Math.floor(Math.random() * 30) + 1
    };
  };

  const visibleClients = clients.filter(client => getVisibilityStatus(client.id));
  const totalRevenue = visibleClients.reduce((sum, client) => sum + getClientStats(client.id).revenue, 0);
  const totalOrders = visibleClients.reduce((sum, client) => sum + getClientStats(client.id).orders, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Client Visibility</h1>
          <p className="text-sm text-gray-600 mt-1">View which clients can access your catalog</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-teal-100 text-teal-600">
              <Building2 size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Clients</p>
              <p className="text-xl font-semibold text-gray-900">{clients.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 text-green-600">
              <Eye size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Visible To</p>
              <p className="text-xl font-semibold text-gray-900">{visibleClients.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
              <ShoppingCart size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-xl font-semibold text-gray-900">{totalOrders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-teal-100 p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 text-purple-600">
              <TrendingUp size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-xl font-semibold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Visibility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => {
          const isVisible = getVisibilityStatus(client.id);
          const stats = getClientStats(client.id);

          return (
            <div key={client.id} className="bg-white rounded-lg shadow-sm border border-teal-100 overflow-hidden">
              <div className="p-4 border-b border-teal-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center text-white">
                      <Building2 size={24} />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                      <div className="flex items-center mt-1">
                        {isVisible ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Eye size={12} className="mr-1" />
                            Visible
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <EyeOff size={12} className="mr-1" />
                            Hidden
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Contact:</span>
                    <span className="text-gray-900">{client.contactEmail}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Phone:</span>
                    <span className="text-gray-900">{client.contactPhone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                </div>
                
                {isVisible && (
                  <div className="mt-4 pt-3 border-t border-teal-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{stats.users}</div>
                        <div className="text-xs text-gray-500">Users</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{stats.orders}</div>
                        <div className="text-xs text-gray-500">Orders</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">${stats.revenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Revenue</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{stats.lastOrder}d</div>
                        <div className="text-xs text-gray-500">Last Order</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-4 py-3 bg-teal-25 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {isVisible ? 'Can access your catalog' : 'Cannot access your catalog'}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  client.defaultVisibility ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {client.defaultVisibility ? 'Default: Visible' : 'Default: Hidden'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visibility Management Info */}
      <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Info size={20} className="text-teal-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">About Client Visibility</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p className="mb-2">
                Client visibility is managed by the Master Admin and determines which clients can see and order from your catalog.
              </p>
              <div className="space-y-1">
                <div className="flex items-center">
                  <Eye size={14} className="mr-2 text-green-500" />
                  <span className="text-sm"><strong>Visible:</strong> Client can see your products and place orders</span>
                </div>
                <div className="flex items-center">
                  <EyeOff size={14} className="mr-2 text-gray-500" />
                  <span className="text-sm"><strong>Hidden:</strong> Client cannot see your products</span>
                </div>
                <div className="flex items-center">
                  <Building2 size={14} className="mr-2 text-blue-500" />
                  <span className="text-sm"><strong>Default:</strong> Organization's default visibility setting</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                To change visibility settings, contact your Master Admin or use the visibility matrix in the main admin panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierVisibility;