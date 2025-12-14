import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { DemographicsData } from '../api/analytics';
import { format } from 'date-fns';

interface TimeSeriesData {
  time: string;
  male: number;
  female: number;
}

interface DemographicsLineChartCardProps {
  data?: DemographicsData | null;
}

const DemographicsLineChartCard: React.FC<DemographicsLineChartCardProps> = ({ data: propData }) => {
  const demographicsData = propData;

  // Transform API data to chart format - NO FALLBACK DATA
  const data: TimeSeriesData[] = React.useMemo(() => {
    if (!demographicsData?.timeseries || demographicsData.timeseries.length === 0) {
      // No data available - return empty array
      return [];
    }

    return demographicsData.timeseries.map((item: any) => ({
      time: format(new Date(item.timestamp), 'HH:mm'),
      male: item.male,
      female: item.female
    }));
  }, [demographicsData]);

  // Custom tooltip for hover functionality
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Time: {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {entry.dataKey === 'male' ? 'Male' : 'Female'}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => (
    <div className="flex items-center justify-end space-x-4 mb-4">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2A7F7D99' }}></div>
        <span className="text-xs text-gray-600">Male</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#47B2B080' }}></div>
        <span className="text-xs text-gray-600">Female</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Demographics Analysis</h3>
      
      <CustomLegend />
      
      <div className="h-80">
        {!data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[]} // Empty data for professional empty chart
              margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                strokeWidth={0.5}
              />
              <XAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 11, 
                  fill: '#d1d5db'
                }}
                tickMargin={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 11, 
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
                    fontSize: '11px',
                    fill: '#d1d5db'
                  }
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
            >
              <defs>
                {/* Glow filter for male line */}
                <filter id="maleGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                {/* Glow filter for female line */}
                <filter id="femaleGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                strokeWidth={0.5}
              />
              <XAxis 
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 11, 
                  fill: '#6b7280'
                }}
                tickMargin={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 11, 
                  fill: '#6b7280'
                }}
                tickMargin={8}
                domain={['dataMin - 5', 'dataMax + 5']}
                label={{ 
                  value: 'Count', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { 
                    textAnchor: 'middle',
                    fontSize: '11px',
                    fill: '#6b7280'
                  }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Main lines with glow effect */}
              <Line
                type="monotone"
                dataKey="male"
                stroke="#2A7F7D99"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#2A7F7D99', strokeWidth: 2, fill: '#fff' }}
                connectNulls={true}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#maleGlow)"
              />
              <Line
                type="monotone"
                dataKey="female"
                stroke="#47B2B080"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#47B2B080', strokeWidth: 2, fill: '#fff' }}
                connectNulls={true}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#femaleGlow)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="text-center mt-2">
        <span className="text-xs text-gray-600">Time</span>
      </div>
    </div>
  );
};

export default DemographicsLineChartCard;