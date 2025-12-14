import React from 'react';
import { DemographicsData } from '../api/analytics';
import DemographicsDonutCard from './DemographicsDonutCard';
import DemographicsLineChartCard from './DemographicsLineChartCard';

interface DemographicsChartProps {
  data: DemographicsData | null;
  loading?: boolean;
  error?: string | null;
}

export const DemographicsChart: React.FC<DemographicsChartProps> = ({
  data,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className="flex gap-6 items-start">
        <div className="w-80 flex-shrink-0 bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-48 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex gap-6 items-start">
        <div className="w-80 flex-shrink-0 bg-white rounded-lg border border-red-200 p-6">
          <div className="flex items-center justify-center h-48 text-red-600">
            <p>Failed to load demographics data</p>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg border border-red-200 p-6">
          <div className="flex items-center justify-center h-80 text-red-600">
            <p>Failed to load demographics data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-start">
      <div className="w-80 flex-shrink-0">
        <DemographicsDonutCard data={data} />
      </div>
      <div className="flex-1">
        <DemographicsLineChartCard data={data} />
      </div>
    </div>
  );
};