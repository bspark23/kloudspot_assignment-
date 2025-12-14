// Clean API client - Single axios instance only
import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false, // Ensure CORS compatibility
    });

    // Add JWT token to all requests and log them
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('kloudspot_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullUrl: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data
      });
      
      return config;
    });

    // Handle auth errors and log details
    this.client.interceptors.response.use(
      (response) => {
        console.log('✅ API Success:', response.config.method?.toUpperCase(), response.config.url, response.status);
        return response;
      },
      (error) => {
        console.error('❌ API Error:', {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          fullUrl: `${error.config?.baseURL}${error.config?.url}`,
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          code: error.code,
          responseData: error.response?.data
        });

        if (error.response?.status === 401) {
          console.log('🔒 Unauthorized - clearing auth and redirecting to login');
          localStorage.removeItem('kloudspot_token');
          localStorage.removeItem('kloudspot_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }
}

export const apiClient = new ApiClient();

// Helper function for time ranges
export const getTodayRange = () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);
  
  return {
    fromUtc: startOfDay.getTime(),
    toUtc: endOfDay.getTime()
  };
};