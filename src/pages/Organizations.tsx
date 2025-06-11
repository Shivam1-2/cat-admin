import React, { useState } from 'react';
import { mockOrganizations, mockUsers } from '../data/mockData';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  BarChart4, 
  RefreshCw,
  CheckSquare,
  XSquare, 
  X,
  Package,
  User
} from 'lucide-react';

const Organizations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'client' | 'supplier'>('client');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showConnectionsModal, setShowConnectionsModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [organizationType, setOrganizationType] = useState<'client' | 'supplier'>('client');
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    defaultVisibility: true,
    adminName: '',
    adminEmail: ''
  });
  const [formErrors, setFormErrors] = useState<any>({});

  const handleCreateOrg = () => {
    setFormData({
      name: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      defaultVisibility: true,
      adminName: '',
      adminEmail: ''
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const handleEdit = (org: any) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      contactEmail: org.contactEmail,
      contactPhone: org.contactPhone,
      address: org.address,
      defaultVisibility: org.defaultVisibility,
      adminName: '',
      adminEmail: ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleArchive = (org: any) => {
    setSelectedOrg(org);
    setShowArchiveModal(true);
  };

  const handleShowConnections = (org: any) => {
    setSelectedOrg(org);
    setShowConnectionsModal(true);
  };

  const validateForm = () => {
    const errors: any = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Organization name is required';
    }
    
    if (!formData.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = 'Contact phone is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (showCreateModal) {
      if (!formData.adminName.trim()) {
        errors.adminName = 'Admin name is required';
      }
      
      if (!formData.adminEmail.trim()) {
        errors.adminEmail = 'Admin email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.adminEmail)) {
        errors.adminEmail = 'Please enter a valid email address';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle form submission
      console.log('Form submitted:', formData);
      setShowCreateModal(false);
      setShowEditModal(false);
    }
  };

  // Filter organizations based on active tab and search term
  const filteredOrganizations = mockOrganizations.filter(
    org => 
      org.type === activeTab && 
      (searchTerm === '' || 
       org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       org.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get users count for each organization
  const getUsersCount = (orgId: string) => {
    return mockUsers.filter(user => user.organizationId === orgId).length;
  };

  // Get connected organizations count
  const getConnectionsCount = (orgId: string) => {
    // This would come from real data in production
    return Math.floor(Math.random() * 5) + 1;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Organization Management</h1>
        <button 
          onClick={handleCreateOrg}
          className="flex items-center bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Plus size={16} className="mr-2" />
          Create Organization
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'client'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            onClick={() => setActiveTab('client')}
          >
            Clients
          </button>
          <button
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'supplier'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            onClick={() => setActiveTab('supplier')}
          >
            Suppliers
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 hidden">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder={`Search ${activeTab}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <button 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setSearchTerm('')}
            >
              <Filter size={16} className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrganizations.map((org) => (
          <div key={org.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <Building2 size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
                    <p className="text-sm text-gray-500">{org.contactEmail}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium hidden ${
                  org.status === 'active' ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {org.status}
                </span>
              </div>
            </div>
            
            <div className="px-4 py-3 divide-y divide-gray-200">
              <div className="py-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Users</p>
                  <p className="text-sm font-semibold">{getUsersCount(org.id)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    {activeTab === 'client' ? 'Supplier Connections' : 'Client Connections'}
                  </p>
                  <p className="text-sm font-semibold">{getConnectionsCount(org.id)}</p>
                </div>
              </div>
              
              <div className="py-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Default Visibility</p>
                  <div className="mt-1">
                    {org.defaultVisibility ? (
                      <span className="inline-flex items-center text-success-600 text-sm">
                        <CheckSquare size={16} className="mr-1" />
                        Visible
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-gray-500 text-sm">
                        <XSquare size={16} className="mr-1" />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm">{new Date(org.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="px-4 py-3 bg-gray-50 flex justify-end">
              <button 
                onClick={() => handleShowConnections(org)}
                className="text-primary-600 hover:text-primary-900 text-sm font-medium flex items-center hidden"
              >
                <BarChart4 size={16} className="mr-1" />
                Connections
              </button>
              <div className="flex space-x-2">
                <button 
                  className="text-primary-600 hover:text-primary-900"
                  onClick={() => handleEdit(org)}
                >
                  <Edit size={18} />
                </button>
                <button 
                  className="text-danger-600 hover:text-danger-900"
                  onClick={() => handleArchive(org)}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowCreateModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Create New Organization
              </h3>
              
              <div className="mt-4 mb-6">
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setOrganizationType('client')}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-md
                      ${organizationType === 'client'
                        ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <User size={24} className="mb-1" />
                      Client
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setOrganizationType('supplier')}
                    className={`
                      px-4 py-2 text-sm font-medium rounded-md
                      ${organizationType === 'supplier'
                        ? 'bg-primary-100 text-primary-800 border-2 border-primary-300'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex flex-col items-center">
                      <Package size={24} className="mb-1" />
                      Supplier
                    </div>
                  </button>
                </div>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      formErrors.name ? 'border-red-300' : ''
                    }`}
                    placeholder="Acme Corp"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.contactEmail ? 'border-red-300' : ''
                      }`}
                      placeholder="contact@example.com"
                    />
                    {formErrors.contactEmail && <p className="mt-1 text-sm text-red-600">{formErrors.contactEmail}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.contactPhone ? 'border-red-300' : ''
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {formErrors.contactPhone && <p className="mt-1 text-sm text-red-600">{formErrors.contactPhone}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      formErrors.address ? 'border-red-300' : ''
                    }`}
                    placeholder="123 Main St, City, State, ZIP"
                  />
                  {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                </div>
                
                <div className="flex items-center">
                  <input
                    id="defaultVisibility"
                    type="checkbox"
                    checked={formData.defaultVisibility}
                    onChange={(e) => setFormData({...formData, defaultVisibility: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="defaultVisibility" className="ml-2 block text-sm text-gray-700">
                    Default visibility to {organizationType === 'client' ? 'suppliers' : 'clients'}
                  </label>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900">Admin Account Setup</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    An admin account will be automatically created for this organization.
                  </p>
                  
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
                        Admin Name *
                      </label>
                      <input
                        type="text"
                        id="adminName"
                        value={formData.adminName}
                        onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          formErrors.adminName ? 'border-red-300' : ''
                        }`}
                        placeholder="John Doe"
                      />
                      {formErrors.adminName && <p className="mt-1 text-sm text-red-600">{formErrors.adminName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
                        Admin Email *
                      </label>
                      <input
                        type="email"
                        id="adminEmail"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                        className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          formErrors.adminEmail ? 'border-red-300' : ''
                        }`}
                        placeholder="admin@example.com"
                      />
                      {formErrors.adminEmail && <p className="mt-1 text-sm text-red-600">{formErrors.adminEmail}</p>}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleSubmit}
              >
                Create Organization
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Organization Modal */}
      {showEditModal && selectedOrg && (
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
                Edit Organization
              </h3>
              
              <form className="mt-4 space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      formErrors.name ? 'border-red-300' : ''
                    }`}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edit-contactEmail" className="block text-sm font-medium text-gray-700">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      id="edit-contactEmail"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.contactEmail ? 'border-red-300' : ''
                      }`}
                    />
                    {formErrors.contactEmail && <p className="mt-1 text-sm text-red-600">{formErrors.contactEmail}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="edit-contactPhone" className="block text-sm font-medium text-gray-700">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      id="edit-contactPhone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.contactPhone ? 'border-red-300' : ''
                      }`}
                    />
                    {formErrors.contactPhone && <p className="mt-1 text-sm text-red-600">{formErrors.contactPhone}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <textarea
                    id="edit-address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      formErrors.address ? 'border-red-300' : ''
                    }`}
                  />
                  {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                </div>
                
                <div className="flex items-center">
                  <input
                    id="edit-defaultVisibility"
                    type="checkbox"
                    checked={formData.defaultVisibility}
                    onChange={(e) => setFormData({...formData, defaultVisibility: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit-defaultVisibility" className="ml-2 block text-sm text-gray-700">
                    Default visibility to {selectedOrg.type === 'client' ? 'suppliers' : 'clients'}
                  </label>
                </div>
              </form>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Organization Modal */}
      {showArchiveModal && selectedOrg && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowArchiveModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3 text-center sm:mt-5">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger-100">
                <Trash className="h-6 w-6 text-danger-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Archive Organization
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to archive <span className="font-medium">{selectedOrg.name}</span>? This action will make the organization inactive but preserve all data.
                </p>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-md text-left">
                <h4 className="text-sm font-medium text-gray-900">Reassign Users</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Select where to reassign the users of this organization.
                </p>
                
                <div className="mt-3">
                  <select
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Select organization</option>
                    {mockOrganizations
                      .filter(org => org.id !== selectedOrg.id && org.type === activeTab)
                      .map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger-600 text-base font-medium text-white hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 sm:col-start-2 sm:text-sm"
                onClick={() => setShowArchiveModal(false)}
              >
                Archive
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowArchiveModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connections Modal */}
      {showConnectionsModal && selectedOrg && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowConnectionsModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Organization Connections
              </h3>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">
                  {selectedOrg.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {activeTab === 'client' ? 'Connected to suppliers' : 'Connected to clients'}
                </p>
                
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-900">Connection Details</h5>
                  <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {activeTab === 'client' ? 'Supply Solutions' : 'Acme Corp'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          Active
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <div>Order Count: 12</div>
                        <div>Total Value: $24,550.00</div>
                        <div>Last Order: 3 days ago</div>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {activeTab === 'client' ? 'Tech Providers' : 'Global Industries'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                          Active
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <div>Order Count: 8</div>
                        <div>Total Value: $16,240.00</div>
                        <div>Last Order: 1 week ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                onClick={() => setShowConnectionsModal(false)}
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

export default Organizations;