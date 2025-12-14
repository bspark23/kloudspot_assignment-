import React from 'react';
import { Power } from 'lucide-react';
import { authApi } from '../api/auth';

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    // Use the auth API logout method which handles socket disconnection
    authApi.logout();
    
    // Force page reload to ensure clean state
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center text-white hover:bg-gray-700 hover:bg-opacity-50 rounded-md px-2 py-1 transition-colors duration-150"
    >
      <Power className="h-4 w-4 text-white mr-2" />
      <span className="text-sm font-normal text-white">Logout</span>
    </button>
  );
};

export default LogoutButton;