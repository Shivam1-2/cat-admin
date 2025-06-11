import React, { useState } from 'react';
import { mockUsers } from '../data/mockData';
import { User, useAuth } from '../context/AuthContext';
import { 
  Search, 
  UserPlus, 
  Filter, 
  Edit, 
  Trash, 
  UserCheck, 
  X,
  Check
} from 'lucide-react';

const Users: React.FC = () => {
  const { currentUser, impersonateUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterOrg, setFilterOrg] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showImpersonateModal, setShowImpersonateModal] = useState(false);
  const [userToImpersonate, setUserToImpersonate] = useState<User | null>(null);
  const [securityCode, setSecurityCode] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'client_user',
    organization: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState<any>({});

  // Apply filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === '' || user.role === filterRole;
    const matchesOrg = filterOrg === '' || user.organizationId === filterOrg;
    const matchesStatus = filterStatus === '' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesOrg && matchesStatus;
  });

  const handleImpersonate = (user: User) => {
    setUserToImpersonate(user);
    setShowImpersonateModal(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organizationId,
      status: user.status
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleCreateUser = () => {
    setFormData({
      name: '',
      email: '',
      role: 'client_user',
      organization: '',
      status: 'active'
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const validateForm = () => {
    const errors: any = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    } else {
      // Check for duplicate email (excluding current user in edit mode)
      const existingUser = mockUsers.find(u => 
        u.email.toLowerCase() === formData.email.toLowerCase() && 
        (!selectedUser || u.id !== selectedUser.id)
      );
      if (existingUser) {
        errors.email = 'This email address is already in use';
      }
    }
    
    if (!formData.organization) {
      errors.organization = 'Please select an organization';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setShowCreateModal(false);
      setShowEditModal(false);
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: 'client_user',
        organization: '',
        status: 'active'
      });
    }
  };

  const confirmImpersonation = () => {
    if (userToImpersonate && securityCode === '1234') { // Demo security code
      impersonateUser(userToImpersonate);
      setShowImpersonateModal(false);
      setSecurityCode('');
    }
  };

  // Get unique organizations for filter
  const organizations = Array.from(new Set(mockUsers.map(user => user.organizationName)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <div className="flex space-x-2">
          <button 
            onClick={handleCreateUser}
            className="flex items-center bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <UserPlus size={16} className="mr-2" />
            Create User
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4 hidden">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="master_admin">Master Admin</option>
                <option value="client_admin">Client Admin</option>
                <option value="supplier_admin">Supplier Admin</option>
                <option value="client_user">Client User</option>
                <option value="supplier_user">Supplier User</option>
              </select>
            </div>

            <div className="min-w-[150px]">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={filterOrg}
                onChange={(e) => setFilterOrg(e.target.value)}
              >
                <option value="">All Organizations</option>
                {organizations.map((org, index) => (
                  <option key={index} value={mockUsers.find(u => u.organizationName === org)?.organizationId || ''}>
                    {org}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <button 
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => {
                setSearchTerm('');
                setFilterRole('');
                setFilterOrg('');
                setFilterStatus('');
              }}
            >
              <Filter size={16} className="mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
                          {user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'master_admin' ? 'bg-purple-100 text-purple-800' :
                      user.role.includes('admin') ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.organizationName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-success-100 text-success-800' :
                      user.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-warning-100 text-warning-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="text-sm">{new Date(user.lastLogin.timestamp).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button 
                        className="text-primary-600 hover:text-primary-900 hidden"
                        onClick={() => handleImpersonate(user)}
                        disabled={user.id === currentUser?.id}
                        title="Impersonate User"
                      >
                        <UserCheck size={18} />
                      </button>
                      <button 
                        className="text-primary-600 hover:text-primary-900"
                        onClick={() => handleEdit(user)}
                        title="Edit User"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="text-danger-600 hover:text-danger-900"
                        onClick={() => handleDelete(user)}
                        title="Delete User"
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

      {/* Create User Modal */}
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
                Create New User
              </h3>
              
              <form className="mt-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      formErrors.name ? 'border-red-300' : ''
                    }`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      formErrors.email ? 'border-red-300' : ''
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role *
                    </label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="client_admin">Client Admin</option>
                      <option value="supplier_admin">Supplier Admin</option>
                      <option value="client_user">Client User</option>
                      <option value="supplier_user">Supplier User</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                      Organization *
                    </label>
                    <select
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({...formData, organization: e.target.value})}
                      className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                        formErrors.organization ? 'border-red-300' : ''
                      }`}
                    >
                      <option value="">Select organization</option>
                      {organizations.map((org, index) => (
                        <option key={index} value={mockUsers.find(u => u.organizationName === org)?.organizationId || ''}>
                          {org}
                        </option>
                      ))}
                    </select>
                    {formErrors.organization && <p className="mt-1 text-sm text-red-600">{formErrors.organization}</p>}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="send-invite"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="send-invite" className="ml-2 block text-sm text-gray-700">
                    Send email invitation to set password
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
                Create User
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

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
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
                Edit User
              </h3>
              
              <form className="mt-4 space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Full Name *
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
                
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                      formErrors.email ? 'border-red-300' : ''
                    }`}
                  />
                  {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700">
                      Role *
                    </label>
                    <select
                      id="edit-role"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="client_admin">Client Admin</option>
                      <option value="supplier_admin">Supplier Admin</option>
                      <option value="client_user">Client User</option>
                      <option value="supplier_user">Supplier User</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      id="edit-status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
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

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
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
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger-100">
                <Trash className="h-6 w-6 text-danger-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Delete User
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <span className="font-medium">{selectedUser.name}</span>? 
                  This action cannot be undone and will remove all user data and access permissions.
                </p>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger-600 text-base font-medium text-white hover:bg-danger-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger-500 sm:col-start-2 sm:text-sm"
                onClick={() => {
                  console.log('Deleting user:', selectedUser.id);
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Impersonate User Modal */}
      {showImpersonateModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  setShowImpersonateModal(false);
                  setSecurityCode('');
                }}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3 text-center sm:mt-5">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-warning-100">
                <UserCheck className="h-6 w-6 text-warning-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Security Verification
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  You are about to impersonate {userToImpersonate?.name}. 
                  This is a security-sensitive operation. Please enter the security code to continue.
                </p>
                <input
                  type="text"
                  className="mt-4 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter security code"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                />
                <p className="mt-2 text-xs text-gray-400">
                  Demo: Use code "1234"
                </p>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                onClick={confirmImpersonation}
              >
                Impersonate
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => {
                  setShowImpersonateModal(false);
                  setSecurityCode('');
                }}
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

export default Users;