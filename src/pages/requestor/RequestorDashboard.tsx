import React from 'react';
import { 
  ClipboardList, 
  Search, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  FileText,
  TrendingUp,
  Package
} from 'lucide-react';
import { 
  mockRequests,
  mockActivityLogs
} from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const RequestorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Filter requests for current user
  const myRequests = mockRequests.filter(request => 
    request.requestorId === currentUser?.id
  );
  
  // Recent activity for requestor
  const requestorActivityLogs = mockActivityLogs.filter(log => 
    log.user.role === 'requestor' || log.action === 'submitted_request'
  ).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requestor Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-orange-600">{currentUser?.organizationName}</p>
          <p className="text-xs text-gray-500">Requestor</p>
        </div>
      </div>
      
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600">
            <FileText size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Requests</p>
            <p className="text-2xl font-semibold text-gray-900">{myRequests.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <Clock size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Pending Approval</p>
            <p className="text-2xl font-semibold text-gray-900">
              {myRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <CheckCircle size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Approved</p>
            <p className="text-2xl font-semibold text-gray-900">
              {myRequests.filter(r => r.status === 'approved' || r.status === 'fulfilled').length}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-4 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Package size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Items</p>
            <p className="text-2xl font-semibold text-gray-900">
              {myRequests.reduce((sum, request) => sum + request.items.length, 0)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-orange-100">
          <div className="px-4 py-5 sm:px-6 border-b border-orange-100">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {requestorActivityLogs.map((log) => (
                <li key={log.id} className="px-4 py-4 sm:px-6 hover:bg-orange-25 transition-colors">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-600 to-orange-700 flex items-center justify-center text-white">
                        {log.user.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {log.user.name}
                        <span className="ml-1 font-normal text-gray-500">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {log.details}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {formatDistanceToNow(new Date(log.timestamp))} ago
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-100">
            <div className="px-4 py-5 sm:px-6 border-b border-orange-100">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              <button 
                onClick={() => navigate('/browse')}
                className="w-full flex items-center justify-between p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <Search size={16} className="text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Browse Catalogs</span>
                </div>
                <span className="text-orange-600">→</span>
              </button>
              
              <button 
                onClick={() => navigate('/requests')}
                className="w-full flex items-center justify-between p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <FileText size={16} className="text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">My Requests</span>
                </div>
                <span className="text-orange-600">→</span>
              </button>
              
              <button 
                onClick={() => navigate('/notifications')}
                className="w-full flex items-center justify-between p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <ClipboardList size={16} className="text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-gray-900">Notifications</span>
                </div>
                <span className="text-orange-600">→</span>
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-100">
            <div className="px-4 py-5 sm:px-6 border-b border-orange-100">
              <h3 className="text-lg font-medium text-gray-900">Alerts & Notifications</h3>
            </div>
            <div className="p-4 space-y-4">
              {myRequests.filter(r => r.status === 'pending').length > 0 && (
                <div className="border-l-4 border-orange-500 bg-orange-50 p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-orange-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-orange-800">
                        {myRequests.filter(r => r.status === 'pending').length} Requests Pending
                      </p>
                      <p className="mt-1 text-xs text-orange-700">
                        Awaiting admin approval
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-l-4 border-blue-500 bg-blue-50 p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">
                      New Products Available
                    </p>
                    <p className="mt-1 text-xs text-blue-700">
                      Check out the latest additions to supplier catalogs
                    </p>
                  </div>
                </div>
              </div>
              
              {myRequests.filter(r => r.status === 'approved').length > 0 && (
                <div className="border-l-4 border-green-500 bg-green-50 p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800">
                        {myRequests.filter(r => r.status === 'approved').length} Requests Approved
                      </p>
                      <p className="mt-1 text-xs text-green-700">
                        Ready for procurement
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestorDashboard;