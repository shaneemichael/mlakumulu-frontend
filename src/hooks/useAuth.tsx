import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/authService';
import { LoginDto, RegisterTouristDto, RegisterEmployeeDto, User, UserRole } from '../types/auth';

// Create the auth context
const AuthContext = createContext<ReturnType<typeof useAuthProvider> | null>(null);

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      router.push('/dashboard');
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerTourist = async (data: RegisterTouristDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.registerTourist(data);
      router.push('/login?registered=true');
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerEmployee = async (data: RegisterEmployeeDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.registerEmployee(data);
      router.push('/login?registered=true');
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 
        typeof err === 'object' && err && 'response' in err && 
        err.response && typeof err.response === 'object' && 
        'data' in err.response && err.response.data && 
        typeof err.response.data === 'object' && 
        'message' in err.response.data && 
        typeof err.response.data.message === 'string' ? 
        err.response.data.message : 'Failed to register';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  return {
    user,
    loading,
    error,
    login,
    registerTourist,
    registerEmployee,
    logout,
    hasRole,
    isAuthenticated: !!user
  };
};

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Create the hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}