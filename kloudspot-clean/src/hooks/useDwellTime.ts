// Dwell time hook - Real API only
import { useState, useEffect, useCallback } from 'react';
import { analyticsApi, DwellTimeData } from '../api/analytics';

interface UseDwellTimeReturn {
  data: DwellTimeData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDwellTime = (): UseDwellTimeReturn => {
  const [data, setData] = useState<DwellTimeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDwellTime = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsApi.getDwellTime();
      setData(response);
      console.log('⏱️ Dwell time data:', response);
    } catch (err: any) {
      // Only treat actual API errors as errors, not empty data
      if (err.response?.status >= 400) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dwell time';
        setError(errorMessage);
        console.error('❌ Dwell time API error:', errorMessage);
      } else {
        // Network or other errors
        setError('Network error - please check connection');
        console.error('🌐 Dwell time network error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDwellTime();
    const interval = setInterval(fetchDwellTime, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, [fetchDwellTime]);

  return {
    data,
    loading,
    error,
    refetch: fetchDwellTime
  };
};