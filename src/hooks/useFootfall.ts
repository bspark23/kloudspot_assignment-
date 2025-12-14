// Footfall hook - Real API only
import { useState, useEffect, useCallback } from 'react';
import { analyticsApi, FootfallData } from '../api/analytics';

interface UseFootfallReturn {
  data: FootfallData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFootfall = (): UseFootfallReturn => {
  const [data, setData] = useState<FootfallData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFootfall = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsApi.getFootfall();
      setData(response);
      console.log('📊 Footfall data:', response);
    } catch (err: any) {
      // Only treat actual API errors as errors, not empty data
      if (err.response?.status >= 400) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch footfall';
        setError(errorMessage);
        console.error('❌ Footfall API error:', errorMessage);
      } else {
        // Network or other errors
        setError('Network error - please check connection');
        console.error('🌐 Footfall network error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFootfall();
    const interval = setInterval(fetchFootfall, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, [fetchFootfall]);

  return {
    data,
    loading,
    error,
    refetch: fetchFootfall
  };
};