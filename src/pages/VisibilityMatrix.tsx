import React, { useState } from 'react';
import { mockOrganizations, mockVisibilityMatrix, Organization } from '../data/mockData';
import { Eye, EyeOff, RefreshCw, AlertTriangle, Check, X, Info, Save, Settings } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const VisibilityMatrix: React.FC = () => {
  const [showLogs, setShowLogs] = useState(false);
  const [defaultVisible, setDefaultVisible] = useState(true);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictDetails, setConflictDetails] = useState<{ supplier: string; client: string } | null>(null);
  const [visibilityMatrix, setVisibilityMatrix] = useState(mockVisibilityMatrix);
  const [hasChanges, setHasChanges] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState<'show' | 'hide'>('show');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  
  // Get clients and suppliers (excluding Master Organization as it's not a typical supplier/client)
  const clients = mockOrganizations.filter(org => 
    org.type === 'client' && 
    org.status === 'active' && 
    org.name !== 'Master Organization'
  );
  const suppliers = mockOrganizations.filter(org => 
    org.type === 'supplier' && 
    org.status === 'active'
  );
  
  // Check if a client-supplier pair is visible
  const isVisible = (supplierId: string, clientId: string) => {
    const relation = visibilityMatrix.find(
      rel => rel.supplierId === supplierId && rel.clientId === clientId
    );
    return relation ? relation.isVisible : defaultVisible;
  };
  
  // Get the last update details for a client-supplier pair
  const getLastUpdate = (supplierId: string, clientId: string) => {
    const relation = visibilityMatrix.find(
      rel => rel.supplierId === supplierId && rel.clientId === clientId
    );
    return relation 
      ? { 
          timestamp: relation.lastUpdated,
          updatedBy: relation.updatedBy,
          updaterIp: relation.updaterIp
        }
      : null;
  };
  
  // Toggle visibility for a client-supplier pair
  const toggleVisibility = (supplier: Organization, client: Organization) => {
    const currentVisibility = isVisible(supplier.id, client.id);
    
    // Check for active relationships before allowing toggle to invisible
    if (currentVisibility) {
      // Simulate checking for active orders or relationships
      const hasActiveRelationship = Math.random() > 0.7; // 30% chance of conflict for demo
      
      if (hasActiveRelationship) {
        setConflictDetails({ 
          supplier: supplier.name,
          client: client.name
        });
        setShowConflictModal(true);
        return;
      }
    }
    
    // Update the visibility matrix
    const existingRelationIndex = visibilityMatrix.findIndex(
      rel => rel.supplierId === supplier.id && rel.clientId === client.id
    );
    
    const newRelation = {
      supplierId: supplier.id,
      clientId: client.id,
      isVisible: !currentVisibility,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'Current User',
      updaterIp: '192.168.1.100'
    };
    
    if (existingRelationIndex >= 0) {
      const newMatrix = [...visibilityMatrix];
      newMatrix[existingRelationIndex] = newRelation;
      setVisibilityMatrix(newMatrix);
    } else {
      setVisibilityMatrix([...visibilityMatrix, newRelation]);
    }
    
    setHasChanges(true);
  };
  
  // Force toggle visibility (used when user confirms despite conflicts)
  const forceToggleVisibility = (supplier: string, client: string) => {
    const supplierOrg = suppliers.find(s => s.name === supplier);
    const clientOrg = clients.find(c => c.name === client);
    
    if (supplierOrg && clientOrg) {
      const currentVisibility = isVisible(supplierOrg.id, clientOrg.id);
      
      const existingRelationIndex = visibilityMatrix.findIndex(
        rel => rel.supplierId === supplierOrg.id && rel.clientId === clientOrg.id
      );
      
      const newRelation = {
        supplierId: supplierOrg.id,
        clientId: clientOrg.id,
        isVisible: !currentVisibility,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'Current User',
        updaterIp: '192.168.1.100'
      };
      
      if (existingRelationIndex >= 0) {
        const newMatrix = [...visibilityMatrix];
        newMatrix[existingRelationIndex] = newRelation;
        setVisibilityMatrix(newMatrix);
      } else {
        setVisibilityMatrix([...visibilityMatrix, newRelation]);
      }
      
      setHasChanges(true);
    }
  };
  
  // Save all changes
  const saveChanges = () => {
    // In a real app, this would save to the database
    console.log('Saving visibility matrix changes:', visibilityMatrix);
    setHasChanges(false);
  };
  
  // Bulk visibility operations
  const handleBulkOperation = () => {
    if (!selectedSupplier) return;
    
    clients.forEach(client => {
      const existingRelationIndex = visibilityMatrix.findIndex(
        rel => rel.supplierId === selectedSupplier && rel.clientId === client.id
      );
      
      const newRelation = {
        supplierId: selectedSupplier,
        clientId: client.id,
        isVisible: bulkAction === 'show',
        lastUpdated: new Date().toISOString(),
        updatedBy: 'Current User',
        updaterIp: '192.168.1.100'
      };
      
      if (existingRelationIndex >= 0) {
        const newMatrix = [...visibilityMatrix];
        newMatrix[existingRelationIndex] = newRelation;
        setVisibilityMatrix(newMatrix);
      } else {
        setVisibilityMatrix([...visibilityMatrix, newRelation]);
      }
    });
    
    setHasChanges(true);
    setShowBulkModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Visibility Matrix</h1>
        <div className="flex space-x-2">
          {hasChanges && (
            <button 
              onClick={saveChanges}
              className="flex items-center bg-success-600 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-success-700"
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
          )}
          
          <button 
            onClick={() => setShowBulkModal(true)}
            className="flex hidden items-center bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Settings size={16} className="mr-2" />
            Bulk Operations
          </button>
          
          <button 
            onClick={() => setShowLogs(!showLogs)}
            className={`flex  hidden items-center rounded-md px-4 py-2 text-sm font-medium ${
              showLogs 
                ? 'bg-primary-100 text-primary-800 border border-primary-300' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {showLogs ? 'Hide Logs' : 'Show Logs'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-primary-100 text-primary-600">
              <Eye size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Visible</p>
              <p className="text-xl font-semibold text-gray-900">
                {visibilityMatrix.filter(rel => rel.isVisible).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-100 text-gray-600">
              <EyeOff size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Hidden</p>
              <p className="text-xl font-semibold text-gray-900">
                {visibilityMatrix.filter(rel => !rel.isVisible).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-success-100 text-success-600">
              <Check size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Suppliers</p>
              <p className="text-xl font-semibold text-gray-900">{suppliers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-warning-100 text-warning-600">
              <RefreshCw size={20} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending Changes</p>
              <p className="text-xl font-semibold text-gray-900">{hasChanges ? '1' : '0'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Client-Supplier Visibility Controls</h2>
          <p className="mt-1 text-sm text-gray-500">
            Control which suppliers are visible to which clients. Click a cell to toggle visibility.
            {hasChanges && <span className="text-warning-600 font-medium"> You have unsaved changes.</span>}
          </p>
          <div className="mt-2 text-sm text-gray-600">
            <p><strong>Note:</strong> Master Organization is the platform administrator and manages all relationships. 
            Acme Corp and Global Industries are client organizations that purchase from suppliers.</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th scope="col" className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 sticky left-0 z-10">
                    Suppliers ↓ / Clients →
                  </th>
                  {clients.map(client => (
                    <th key={client.id} scope="col" className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="min-w-[120px]">
                        <div className="font-semibold">{client.name}</div>
                        <div className="text-xs text-gray-400 normal-case">
                          {visibilityMatrix.filter(rel => rel.clientId === client.id && rel.isVisible).length} visible
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suppliers.map(supplier => {
                  const visibleCount = clients.filter(client => isVisible(supplier.id, client.id)).length;
                  
                  return (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0">
                        <div className="min-w-[160px] flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{supplier.name}</div>
                            <div className="text-xs text-gray-500">
                              {visibleCount}/{clients.length} clients can see
                            </div>
                          </div>
                          {supplier.defaultVisibility !== defaultVisible && (
                            <span className="text-xs text-warning-600 bg-warning-100 px-2 py-1 rounded">
                              Custom
                            </span>
                          )}
                        </div>
                      </td>
                      {clients.map(client => {
                        const visible = isVisible(supplier.id, client.id);
                        const lastUpdate = getLastUpdate(supplier.id, client.id);
                        
                        return (
                          <td key={client.id} className="py-4 px-4 text-center">
                            <div className="flex flex-col items-center space-y-2">
                              <button
                                onClick={() => toggleVisibility(supplier, client)}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                  visible
                                    ? 'bg-success-100 text-success-700 hover:bg-success-200 border-2 border-success-300'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-2 border-gray-300'
                                }`}
                                title={`${visible ? 'Visible' : 'Hidden'} - Click to toggle`}
                              >
                                {visible ? <Eye size={18} /> : <EyeOff size={18} />}
                              </button>
                              
                              {showLogs && lastUpdate && (
                                <div className="text-xs text-gray-500 text-center">
                                  <div className="font-medium">{lastUpdate.updatedBy}</div>
                                  <div>
                                    {format(parseISO(lastUpdate.timestamp), 'MMM d, h:mm a')}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Override Logs (when logs are enabled) */}
      {showLogs && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Visibility Changes</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {visibilityMatrix
                .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
                .slice(0, 20)
                .map((relation, index) => {
                  const supplier = mockOrganizations.find(org => org.id === relation.supplierId);
                  const client = mockOrganizations.find(org => org.id === relation.clientId);
                  
                  return (
                    <li key={index} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            relation.isVisible ? 'bg-success-100 text-success-600' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {relation.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </div>
                          <div className="ml-3 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {relation.updatedBy}
                              <span className="ml-1 font-normal text-gray-500">
                                changed visibility of <span className="font-medium">{supplier?.name}</span> for <span className="font-medium">{client?.name}</span> to {relation.isVisible ? 'visible' : 'hidden'}
                              </span>
                            </p>
                            <p className="mt-1 flex items-center text-xs text-gray-500">
                              <span>{format(parseISO(relation.lastUpdated), 'MMM d, yyyy h:mm a')}</span>
                              <span className="mx-1">•</span>
                              <span>{relation.updaterIp}</span>
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            relation.isVisible ? 'bg-success-100 text-success-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {relation.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      )}
      
      {/* Help and Legend */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Info size={20} className="text-primary-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">About Visibility Control</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>
                The visibility matrix controls which suppliers are visible to which clients. 
                When a supplier is visible to a client, users from that client organization can see and order products from that supplier.
              </p>
              <div className="mt-3 flex space-x-6">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded bg-success-100 text-success-700 flex items-center justify-center">
                    <Eye size={14} />
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Visible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded bg-gray-100 text-gray-500 flex items-center justify-center">
                    <EyeOff size={14} />
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Hidden</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded bg-warning-100 text-warning-600 flex items-center justify-center text-xs font-bold">
                    !
                  </div>
                  <span className="ml-2 text-sm text-gray-700">Has unsaved changes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bulk Operations Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowBulkModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Bulk Visibility Operations
              </h3>
              
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="supplier-select" className="block text-sm font-medium text-gray-700">
                    Select Supplier
                  </label>
                  <select
                    id="supplier-select"
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Choose a supplier...</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Action
                  </label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        id="show-all"
                        name="bulk-action"
                        type="radio"
                        checked={bulkAction === 'show'}
                        onChange={() => setBulkAction('show')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="show-all" className="ml-2 block text-sm text-gray-700">
                        Show to all clients
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="hide-all"
                        name="bulk-action"
                        type="radio"
                        checked={bulkAction === 'hide'}
                        onChange={() => setBulkAction('hide')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="hide-all" className="ml-2 block text-sm text-gray-700">
                        Hide from all clients
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                disabled={!selectedSupplier}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleBulkOperation}
              >
                Apply Changes
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowBulkModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Conflict Detection Modal */}
      {showConflictModal && conflictDetails && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-md w-full mx-auto p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowConflictModal(false)}
              >
                <span className="sr-only">Close</span>
                <X size={24} />
              </button>
            </div>
            
            <div className="mt-3 text-center sm:mt-5">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-warning-100">
                <AlertTriangle className="h-6 w-6 text-warning-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Active Relationship Detected
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Disabling visibility between <span className="font-medium">{conflictDetails.supplier}</span> and <span className="font-medium">{conflictDetails.client}</span> may affect active orders or relationships.
                </p>
                
                <div className="mt-4 bg-warning-50 border border-warning-200 rounded-md p-3 text-left">
                  <h4 className="text-sm font-medium text-warning-800">Potential Impacts:</h4>
                  <ul className="mt-2 text-sm text-warning-700 list-disc pl-5 space-y-1">
                    <li>Existing orders may become inaccessible to users</li>
                    <li>Users may lose access to historical product data</li>
                    <li>Reporting and analytics may be affected</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-warning-600 text-base font-medium text-white hover:bg-warning-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning-500 sm:col-start-2 sm:text-sm"
                onClick={() => {
                  forceToggleVisibility(conflictDetails.supplier, conflictDetails.client);
                  setShowConflictModal(false);
                }}
              >
                Disable Anyway
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                onClick={() => setShowConflictModal(false)}
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

export default VisibilityMatrix;