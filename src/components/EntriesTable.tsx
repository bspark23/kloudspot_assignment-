// Entries table component with pagination
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { EntryRecord } from '../api/analytics';

interface EntriesTableProps {
  entries: EntryRecord[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const EntriesTable: React.FC<EntriesTableProps> = ({
  entries,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange
}) => {

  // Generate avatar based on name and gender
  const getAvatarUrl = (name: string, gender: string): string => {
    const seed = name.toLowerCase().replace(/\s+/g, '');
    const genderParam = gender.toLowerCase() === 'male' ? 'men' : 'women';
    return `https://randomuser.me/api/portraits/${genderParam}/${Math.abs(seed.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 100}.jpg`;
  };
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateString;
    }
  };

  const calculateDwellTime = (entryTime: string, exitTime?: string | null): string => {
    try {
      const entry = new Date(entryTime);
      const exit = exitTime ? new Date(exitTime) : new Date();
      const diffMs = exit.getTime() - entry.getTime();
      
      if (diffMs < 0) return '0m';
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    } catch {
      return '—';
    }
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded ${
            i === currentPage
              ? 'bg-teal-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load entries data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no entries
  if (!loading && entries.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No entries found</p>
          <p className="text-sm text-gray-400">
            Entry data will appear here when people enter/exit the monitored area
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sex
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entry
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dwell Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr 
                key={entry.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      className="h-10 w-10 rounded-full mr-3" 
                      src={getAvatarUrl(entry.name, entry.gender)}
                      alt={entry.name}
                      onError={(e) => {
                        // Fallback to initials if image fails
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const initials = entry.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
                        const fallback = document.createElement('div');
                        fallback.className = 'h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium text-sm mr-3';
                        fallback.textContent = initials;
                        target.parentNode?.insertBefore(fallback, target);
                      }}
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {entry.name}
                      </div>

                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.gender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDateTime(entry.entryTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.exitTime ? formatDateTime(entry.exitTime) : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {calculateDwellTime(entry.entryTime, entry.exitTime)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - Simple numbers like in image */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-1">
            {renderPaginationNumbers()}
          </div>
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};