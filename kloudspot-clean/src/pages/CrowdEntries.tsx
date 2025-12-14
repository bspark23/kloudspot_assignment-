// Crowd Entries page - Real API only
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { TodayHeader } from '../components/TodayHeader';
import { EntriesTable } from '../components/EntriesTable';
import { entriesApi } from '../api/entries';
import { EntriesResponse } from '../api/analytics';

export const CrowdEntries: React.FC = () => {
  const [data, setData] = useState<EntriesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchEntries = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await entriesApi.getEntries({
        page,
        limit: pageSize,
      });
      setData(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch entries';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchEntries(currentPage);
  }, [fetchEntries, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = data ? data.totalPages : 0;

  return (
    <Layout>
      <div className="space-y-6">
        <TodayHeader title="Crowd Entries" />
        <EntriesTable
          entries={data?.records || []} // Use 'records' field from backend
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </Layout>
  );
};