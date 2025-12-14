// Today header component matching Frame.png design
import React from 'react';
import { Calendar } from 'lucide-react';

interface TodayHeaderProps {
  title: string;
}

export const TodayHeader: React.FC<TodayHeaderProps> = ({ title }) => {

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      
      {/* Today section with exact specifications */}
      <div 
        className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm"
        style={{ 
          width: '200px', 
          height: '40px',
          gap: '8px',
          paddingLeft: '12px',
          paddingRight: '12px'
        }}
      >
        <Calendar className="h-4 w-4 text-teal-600 flex-shrink-0" />
        <div className="text-sm font-medium text-gray-900">Today</div>
      </div>
    </div>
  );
};