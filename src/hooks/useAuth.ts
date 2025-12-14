// Authentication hook - Real API only
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, LoginRequest, User } from '../api/auth';
// import { simulationApi } from '../api/simulation';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = authApi.getStoredUser();
    if (storedUser && authApi.getStoredToken()) {
      setUser(storedUser);
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(credentials);
      authApi.storeAuth(response);
      setUser(response.user);
      
      // Note: Simulation start requires admin privileges
      console.log('ℹ️ Logged in successfully - simulation control requires admin privileges');
      
      navigate('/', { replace: true });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setError(null);
    navigate('/login', { replace: true });
  }, [navigate]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user && !!authApi.getStoredToken(),
    loading,
    error,
    login,
    logout,
    clearError
  };
};