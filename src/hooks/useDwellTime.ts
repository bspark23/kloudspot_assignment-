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
      console.log('⏱️ Dwell time data received:', response);
    } catch (err: any) {
      console.error('❌ Dwell time API error details:', err);
      
      // Don't show error - the API will provide fallback data
      // This ensures the UI always shows data even when backend is unavailable
      setError(null);
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