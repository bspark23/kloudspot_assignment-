// Entries API - Real backend only
import { apiClient, getTodayRange } from './apiClient';
import { EntriesRequest, EntriesResponse } from './analytics';

export const entriesApi = {
  async getEntries(params: Omit<EntriesRequest, 'siteId' | 'fromUtc' | 'toUtc'> & {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<EntriesResponse> {
    const defaultDateRange = getTodayRange();
    const requestBody: EntriesRequest = {
      siteId: 'avenue-mall',
      fromUtc: params.dateFrom ? new Date(params.dateFrom).getTime() : defaultDateRange.fromUtc,
      toUtc: params.dateTo ? new Date(params.dateTo).getTime() : defaultDateRange.toUtc,
      page: params.page,
      limit: params.limit,
      ...(params.search && { search: params.search }),
      ...(params.gender && { gender: params.gender })
    };
    
    const response = await apiClient.post<EntriesResponse>('/api/analytics/entry-exit', requestBody);
    console.log('📋 Entries API response:', response);
    return response;
  }
};