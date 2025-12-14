// Overview/Dashboard page matching home.png exactly
import React, { useCallback } from 'react';
import { Layout } from '../components/Layout';
import { TodayHeader } from '../components/TodayHeader';
import OverallOccupancyChart from '../components/OverallOccupancyChart';
import { DemographicsChart } from '../components/DemographicsChart';
import { StatCard } from '../components/StatCard';
import { useOverviewData } from '../hooks/useOverviewData';
import { useLiveOccupancy, useAlerts } from '../hooks/useSocket';

export const Overview: React.FC = () => {
  const overviewData = useOverviewData();

  // Socket integration for live updates
  const handleLiveOccupancy = useCallback((data: any) => {
    console.log('📊 Live occupancy update received:', data);
    
    // Handle different possible formats
    const occupancy = data.occupancy || data.count || data.value || 0;
    console.log('🔢 Updating live occupancy to:', occupancy);
    
    overviewData.updateLiveOccupancy(occupancy);
  }, [overviewData]);

  const handleAlert = useCallback(() => {
    // Alerts are handled by the notifications system
  }, []);

  // Use socket hooks for real-time updates
  useLiveOccupancy(handleLiveOccupancy);
  useAlerts(handleAlert);

  return (
    <>
      <Layout>
        <div className="space-y-6">
          {/* Today Header */}
          <TodayHeader title="Overview" />

          {/* Occupancy Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Occupancy</h2>
            
            {/* Stats cards using StatCard component */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Live Occupancy */}
              <div className="relative">
                <StatCard
                  title="Live Occupancy"
                  value={overviewData.liveOccupancy.value}
                  comparison={overviewData.liveOccupancy.comparison}
                  loading={overviewData.liveOccupancy.loading}
                  error={overviewData.liveOccupancy.error}
                  icon={<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                />
              </div>

              {/* Today's Footfall */}
              <StatCard
                title="Today's Footfall"
                value={overviewData.todaysFootfall.value}
                comparison={overviewData.todaysFootfall.comparison}
                loading={overviewData.todaysFootfall.loading}
                error={overviewData.todaysFootfall.error}
              />

              {/* Average Dwell Time */}
              <StatCard
                title="Avg Dwell Time"
                value={overviewData.avgDwellTime.value}
                comparison={overviewData.avgDwellTime.comparison}
                loading={overviewData.avgDwellTime.loading}
                error={overviewData.avgDwellTime.error}
              />
            </div>

            {/* Overall Occupancy Chart - Pixel-perfect recreation */}
            <OverallOccupancyChart />
          </div>

          {/* Demographics Section */}
          <div className="mt-12">
            <DemographicsChart
              data={overviewData.demographics}
              loading={overviewData.demographics.loading}
              error={overviewData.demographics.error}
            />
          </div>
        </div>
      </Layout>
    </>
  );
};