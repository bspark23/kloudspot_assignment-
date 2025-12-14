// Authentication API - Real backend only
import { apiClient } from './apiClient';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return await apiClient.post<LoginResponse>('/api/auth/login', credentials);
  },

  logout(): void {
    localStorage.removeItem('kloudspot_token');
    localStorage.removeItem('kloudspot_user');
  },

  getStoredToken(): string | null {
    return localStorage.getItem('kloudspot_token');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('kloudspot_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  storeAuth(response: LoginResponse): void {
    localStorage.setItem('kloudspot_token', response.token);
    localStorage.setItem('kloudspot_user', JSON.stringify(response.user));
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
};