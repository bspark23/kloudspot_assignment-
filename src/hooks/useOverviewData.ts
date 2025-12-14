// Combined overview data hook - Real API only
import { useDwellTime } from './useDwellTime';
import { useFootfall } from './useFootfall';
import { useOccupancyTimeseries } from './useOccupancyTimeseries';
import { useDemographics } from './useDemographics';
import { formatDwellTime } from '../utils/formatters';

export interface OverviewData {
  liveOccupancy: {
    value: number;
    comparison: number;
    loading: boolean;
    error: string | null;
  };
  
  todaysFootfall: {
    value: number;
    comparison: number;
    loading: boolean;
    error: string | null;
  };
  
  avgDwellTime: {
    value: string;
    comparison: number;
    loading: boolean;
    error: string | null;
  };
  
  occupancyChart: {
    data: Array<{ timestamp: string; occupancy: number }>;
    loading: boolean;
    error: string | null;
  };
  
  demographics: {
    pie: { male: number; female: number };
    timeseries: Array<{ timestamp: string; male: number; female: number }>;
    loading: boolean;
    error: string | null;
  };
  
  isAnyLoading: boolean;
  hasAnyError: boolean;
  refetchAll: () => Promise<void>;
  updateLiveOccupancy: (newOccupancy: number) => void;
}

export const useOverviewData = (): OverviewData => {
  const dwellTime = useDwellTime();
  const footfall = useFootfall();
  const occupancy = useOccupancyTimeseries();
  const demographics = useDemographics();

  const refetchAll = async () => {
    await Promise.all([
      dwellTime.refetch(),
      footfall.refetch(),
      occupancy.refetch(),
      demographics.refetch()
    ]);
  };

  return {
    liveOccupancy: {
      value: occupancy.data?.current ?? 0,
      comparison: occupancy.data?.comparison ?? 0,
      loading: occupancy.loading,
      error: occupancy.error
    },
    
    todaysFootfall: {
      value: footfall.data?.footfall ?? 0, // Use 'footfall' field from backend
      comparison: footfall.data?.comparison ?? 0,
      loading: footfall.loading,
      error: footfall.error
    },
    
    avgDwellTime: {
      value: dwellTime.data?.avgDwellMinutes ? formatDwellTime(dwellTime.data.avgDwellMinutes * 60) : '00min 00sec', // Use 'avgDwellMinutes' field
      comparison: dwellTime.data?.comparison ?? 0,
      loading: dwellTime.loading,
      error: dwellTime.error
    },
    
    occupancyChart: {
      data: occupancy.data?.data || [],
      loading: occupancy.loading,
      error: occupancy.error
    },
    
    demographics: {
      pie: demographics.data?.pie || { male: 0, female: 0 },
      timeseries: demographics.data?.timeseries || [],
      loading: demographics.loading,
      error: demographics.error
    },
    
    isAnyLoading: occupancy.loading || footfall.loading || dwellTime.loading || demographics.loading,
    hasAnyError: !!(occupancy.error || footfall.error || dwellTime.error || demographics.error),
    refetchAll,
    updateLiveOccupancy: occupancy.updateLiveOccupancy
  };
};