// Authentication card container matching Figma design
import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      {/* Kloudspot Logo */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">kloudspot</span>
        </div>
      </div>
      
      {children}
    </div>
  );
};