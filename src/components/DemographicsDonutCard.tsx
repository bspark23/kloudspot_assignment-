import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DemographicsData } from '../api/analytics';

interface DemographicsDonutCardProps {
  data?: DemographicsData | null;
}

const DemographicsDonutCard: React.FC<DemographicsDonutCardProps> = ({ data: propData }) => {
  // Use prop data if provided, otherwise use hook
  const demographicsData = propData;

  // Calculate percentages from API data - NO FALLBACK DATA
  const { malePercentage, femalePercentage, data } = React.useMemo(() => {
    if (!demographicsData?.pie) {
      // No data available - return empty state
      return {
        malePercentage: 0,
        femalePercentage: 0,
        data: []
      };
    }

    const total = demographicsData.pie.male + demographicsData.pie.female;
    const malePercentage = total > 0 ? Math.round((demographicsData.pie.male / total) * 100) : 0;
    const femalePercentage = total > 0 ? Math.round((demographicsData.pie.female / total) * 100) : 0;

    return {
      malePercentage,
      femalePercentage,
      data: [
        { name: 'Male', value: malePercentage, color: '#2A7F7D99' },
        { name: 'Female', value: femalePercentage, color: '#47B2B066' }
      ]
    };
  }, [demographicsData]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900 mb-6">Chart of Demographics</h3>
      
      <div className="relative h-48 mb-8 flex items-center justify-center">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data.length > 0 ? data : [{ name: 'Empty', value: 100, color: '#e5e7eb' }]}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={0}
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {(data.length > 0 ? data : [{ name: 'Empty', value: 100, color: '#e5e7eb' }]).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs text-gray-500 mb-1">Total Crowd</div>
          <div className="text-xl font-bold text-gray-900">
            {data.length > 0 ? '100%' : '0%'}
          </div>
        </div>
      </div>
      
      {/* Legend with PNG icons - always show for professional look */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <img 
            src="/man.png" 
            alt="Male"
            className="w-3 h-8"
            style={{ width: '12px', height: '31px' }}
          />
          <span className={`text-sm font-medium ${data.length > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
            {malePercentage}% Males
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <img 
            src="/woman.png" 
            alt="Female"
            className="w-3 h-8"
            style={{ width: '12px', height: '31px' }}
          />
          <span className={`text-sm font-medium ${data.length > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
            {femalePercentage}% Females
          </span>
        </div>
      </div>
    </div>
  );
};

export default DemographicsDonutCard;