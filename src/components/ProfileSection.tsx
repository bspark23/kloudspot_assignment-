// Profile section component - simple display without dropdown
import React from 'react';
import { User } from 'lucide-react';
import { authApi } from '../api/auth';

export const ProfileSection: React.FC = () => {
  const user = authApi.getStoredUser();

  return (
    <div className="flex items-center space-x-3">
      {/* Profile Avatar */}
      <div className="relative">
        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        {/* Online status indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
      </div>
      
      {/* User Info */}
      <div className="text-left">
        <p className="text-sm font-medium text-gray-900">
          {user?.name || 'John Doe'}
        </p>
        <p className="text-xs text-gray-500">
          {user?.role || 'Administrator'}
        </p>
      </div>
    </div>
  );
};