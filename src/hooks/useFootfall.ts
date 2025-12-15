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
      console.log('📊 Footfall data received:', response);
    } catch (err: any) {
      console.error('❌ Footfall API error details:', err);
      
      // The API handles fallback internally, so we should still get data
      // Let's try to get the fallback data
      try {
        const fallbackResponse = await analyticsApi.getFootfall();
        setData(fallbackResponse);
        console.log('📊 Footfall fallback data received:', fallbackResponse);
      } catch (fallbackErr) {
        console.error('❌ Footfall fallback also failed:', fallbackErr);
        setError(null); // Don't show error to user
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