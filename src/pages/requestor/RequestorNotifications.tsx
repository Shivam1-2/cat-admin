import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RequestorNotifications: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">Stay updated with request status and catalog changes</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-orange-100 p-8 text-center">
        <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 7h6m0 10v-3M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M9 7H6a1 1 0 00-1 1v9a1 1 0 001 1h3" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Notifications Coming Soon</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          We're working on a notification system to keep you updated on request status changes, 
          new product availability, and important announcements.
        </p>
      </div>
    </div>
  );
};

export default RequestorNotifications;