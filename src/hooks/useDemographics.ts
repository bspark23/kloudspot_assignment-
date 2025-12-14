// Demographics hook - Real API only
import { useState, useEffect, useCallback } from 'react';
import { analyticsApi, DemographicsData } from '../api/analytics';

interface UseDemographicsReturn {
  data: DemographicsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDemographics = (): UseDemographicsReturn => {
  const [data, setData] = useState<DemographicsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDemographics = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsApi.getDemographics();
      setData(response);
      console.log('👥 Demographics data:', response);
    } catch (err: any) {
      // Only treat actual API errors as errors, not empty data
      if (err.response?.status >= 400) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch demographics';
        setError(errorMessage);
        console.error('❌ Demographics API error:', errorMessage);
      } else {
        // Network or other errors
        setError('Network error - please check connection');
        console.error('🌐 Demographics network error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDemographics();
    const interval = setInterval(fetchDemographics, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, [fetchDemographics]);

  return {
    data,
    loading,
    error,
    refetch: fetchDemographics
  };
};