import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useOccupancyTimeseries } from '../hooks/useOccupancyTimeseries';
import { format } from 'date-fns';

interface OccupancyData {
  time: string;
  value: number;
}

const OverallOccupancyChart: React.FC = () => {
  const { data: occupancyData, loading } = useOccupancyTimeseries();

  // Transform API data to chart format - NO FALLBACK DATA
  const data: OccupancyData[] = React.useMemo(() => {
    if (!occupancyData?.data || occupancyData.data.length === 0) {
      // No data available - return empty array for professional empty chart
      return [];
    }

    return occupancyData.data.map((item: any) => ({
      time: format(new Date(item.timestamp), 'HH:mm'),
      value: item.occupancy
    }));
  }, [occupancyData]);

  // Custom tooltip for hover functionality
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Time: {label}</p>
          <p className="text-sm font-semibold text-teal-600">
            Occupancy: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Overall Occupancy</h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Occupancy</span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative h-80">
        {loading ? (
          <div className="animate-pulse h-full bg-gray-200 rounded"></div>
        ) : !data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={[]} // Empty professional chart
              margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                strokeWidth={0.5}
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: '#d1d5db'
                }}
                tickMargin={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: '#d1d5db'
                }}
                tickMargin={8}
                domain={[0, 100]}
                label={{ 
                  value: 'Count', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { 
                    textAnchor: 'middle',
                    fontSize: '12px',
                    fill: '#d1d5db'
                  }
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 60, bottom: 40 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                strokeWidth={0.5}
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: '#6b7280'
                }}
                tickMargin={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: '#6b7280'
                }}
                tickMargin={8}
                domain={['dataMin - 10', 'dataMax + 10']}
                label={{ 
                  value: 'Count', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { 
                    textAnchor: 'middle',
                    fontSize: '12px',
                    fill: '#6b7280'
                  }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#14b8a6"
                strokeWidth={2}
                fill="#14b8a6"
                fillOpacity={0.1}
                dot={false}
                activeDot={{ r: 4, stroke: '#14b8a6', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {/* LIVE Indicator - positioned at 16:00 */}
        <div 
          className="absolute"
          style={{
            top: '20px',
            left: 'calc(60px + 73%)', // Positioned at approximately 16:00
            width: '2px',
            height: 'calc(100% - 60px)',
            background: 'repeating-linear-gradient(to bottom, #ef4444 0px, #ef4444 4px, transparent 4px, transparent 8px)'
          }}
        ></div>
        
        {/* LIVE Badge */}
        <div 
          className="absolute bg-red-500 text-white text-xs px-2 py-1 rounded font-medium"
          style={{ 
            top: '15px',
            left: 'calc(60px + 73% + 8px)', // Slightly offset to the right of the line
            fontSize: '10px',
            fontWeight: '600'
          }}
        >
          LIVE
        </div>
      </div>

      {/* Time Label */}
      <div className="text-center mt-2">
        <span className="text-sm text-gray-500">Time</span>
      </div>
    </div>
  );
};

export default OverallOccupancyChart;