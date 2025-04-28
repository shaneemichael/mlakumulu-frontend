import api from '../lib/api';
import { AuthResponse, LoginDto, RegisterTouristDto, RegisterEmployeeDto, UserRole } from '../types/auth';

export const authService = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  registerTourist: async (data: RegisterTouristDto): Promise<Omit<AuthResponse['user'], 'password'>> => {
    const response = await api.post('/auth/register/tourist', data);
    return response.data;
  },

  registerEmployee: async (data: RegisterEmployeeDto): Promise<Omit<AuthResponse['user'], 'password'>> => {
    const response = await api.post('/auth/register/employee', data);
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): AuthResponse['user'] | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  hasRole: (role: UserRole): boolean => {
    const user = authService.getCurrentUser();
    return user ? user.role === role : false;
  }
};