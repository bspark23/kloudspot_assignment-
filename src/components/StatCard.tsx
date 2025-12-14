// Reusable stat card component for dashboard metrics
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  comparison?: number; // percentage change
  icon?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  suffix?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  comparison,
  icon,
  loading = false,
  error = null,
  suffix = ''
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
        <div className="text-red-600">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
          <p className="text-sm font-medium text-red-600">Connection Error</p>
          <p className="text-xs text-gray-500 mt-1">
            {error.includes('Network error') ? 'Check network connection' : 
             error.includes('Cannot connect') ? 'Server unreachable' : 
             'API error'}
          </p>
        </div>
      </div>
    );
  }

  // Remove the "waiting for simulation data" logic - zero values are valid real data

  const isPositive = comparison !== undefined && comparison > 0;
  const isNegative = comparison !== undefined && comparison < 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-2xl font-semibold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix && <span className="text-sm font-normal text-gray-500 ml-1">{suffix}</span>}
          </p>
          
          {/* Show real-time status for zero values */}
          {(value === 0 || value === '00min 00sec') && !loading && !error && (
            <p className="text-xs text-gray-500 mt-1">Live data - no activity yet</p>
          )}
          
          {comparison !== undefined && (
            <div className="flex items-center mt-2">
              {isPositive && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium text-green-600">
                    +{Math.abs(comparison).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">more than yesterday</span>
                </>
              )}
              {isNegative && (
                <>
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm font-medium text-red-600">
                    -{Math.abs(comparison).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">less than yesterday</span>
                </>
              )}
              {comparison === 0 && (
                <span className="text-sm font-medium text-gray-500">
                  0% vs yesterday
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};