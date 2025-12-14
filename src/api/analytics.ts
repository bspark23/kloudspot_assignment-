// Analytics API - Real backend only
import { apiClient, getTodayRange } from './apiClient';

export interface AnalyticsRequest {
  siteId: string;
  fromUtc: number;
  toUtc: number;
}

export interface FootfallData {
  footfall: number; // Backend returns 'footfall' not 'total'
  comparison?: number;
}

export interface DwellTimeData {
  avgDwellMinutes: number; // Backend returns 'avgDwellMinutes' not 'average'
  dwellRecords: number;
  comparison?: number;
}

export interface OccupancyData {
  timestamp: string;
  occupancy: number;
}

export interface OccupancyResponse {
  data: OccupancyData[];
  current?: number;
  comparison?: number;
}

export interface DemographicsData {
  timeseries: Array<{
    timestamp: string;
    male: number;
    female: number;
  }>;
  pie: {
    male: number;
    female: number;
  };
}

export interface EntryRecord {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  entryTime: string;
  exitTime?: string | null;
  avatar?: string;
}

export interface EntriesResponse {
  totalRecords: number; // Backend returns 'totalRecords' not 'total'
  pageNumber: number; // Backend returns 'pageNumber' not 'page'
  pageSize: number;
  totalPages: number;
  records: EntryRecord[]; // Backend returns 'records' not 'entries'
}

export interface EntriesRequest {
  siteId: string;
  fromUtc: number;
  toUtc: number;
  page: number;
  limit: number;
  search?: string;
  gender?: string;
}

export const analyticsApi = {
  // POST /api/analytics/footfall
  async getFootfall(params?: Partial<AnalyticsRequest>): Promise<FootfallData> {
    const defaultParams = getTodayRange();
    const requestParams: AnalyticsRequest = {
      siteId: 'avenue-mall',
      ...defaultParams,
      ...params
    };
    return await apiClient.post<FootfallData>('/api/analytics/footfall', requestParams);
  },

  // POST /api/analytics/dwell
  async getDwellTime(params?: Partial<AnalyticsRequest>): Promise<DwellTimeData> {
    const defaultParams = getTodayRange();
    const requestParams: AnalyticsRequest = {
      siteId: 'avenue-mall',
      ...defaultParams,
      ...params
    };
    return await apiClient.post<DwellTimeData>('/api/analytics/dwell', requestParams);
  },

  // POST /api/analytics/occupancy - NOT AVAILABLE (404)
  async getOccupancy(_params?: Partial<AnalyticsRequest>): Promise<OccupancyResponse> {
    // This endpoint returns 404 - return empty data structure
    console.warn('⚠️ Occupancy API not available (404) - returning empty data');
    return {
      data: [],
      current: 0,
      comparison: 0
    };
  },

  // POST /api/analytics/demographics - NOT AVAILABLE (404)
  async getDemographics(_params?: Partial<AnalyticsRequest>): Promise<DemographicsData> {
    // This endpoint returns 404 - return empty data structure
    console.warn('⚠️ Demographics API not available (404) - returning empty data');
    return {
      timeseries: [],
      pie: { male: 0, female: 0 }
    };
  },

  // POST /api/analytics/entry-exit
  async getEntries(params: EntriesRequest): Promise<EntriesResponse> {
    return await apiClient.post<EntriesResponse>('/api/analytics/entry-exit', params);
  }
};