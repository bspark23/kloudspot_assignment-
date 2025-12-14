// Occupancy timeseries hook - Real API only
import { useState, useEffect, useCallback } from 'react';
import { analyticsApi, OccupancyResponse } from '../api/analytics';

interface UseOccupancyTimeseriesReturn {
  data: OccupancyResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateLiveOccupancy: (newOccupancy: number) => void;
}

export const useOccupancyTimeseries = (): UseOccupancyTimeseriesReturn => {
  const [data, setData] = useState<OccupancyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOccupancy = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsApi.getOccupancy();
      setData(response);
      console.log('📈 Occupancy data:', response);
    } catch (err: any) {
      // Only treat actual API errors as errors, not empty data
      if (err.response?.status >= 400) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch occupancy';
        setError(errorMessage);
        console.error('❌ Occupancy API error:', errorMessage);
      } else {
        // Network or other errors
        setError('Network error - please check connection');
        console.error('🌐 Occupancy network error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLiveOccupancy = useCallback((newOccupancy: number) => {
    setData(prev => prev ? { ...prev, current: newOccupancy } : null);
  }, []);

  useEffect(() => {
    fetchOccupancy();
    const interval = setInterval(fetchOccupancy, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, [fetchOccupancy]);

  return {
    data,
    loading,
    error,
    refetch: fetchOccupancy,
    updateLiveOccupancy
  };
};