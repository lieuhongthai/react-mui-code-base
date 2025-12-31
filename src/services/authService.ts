import axiosInstance from '@/config/axios';
import type { User } from '@/types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);

    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem('auth-token', response.data.token);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth-token');
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<string> => {
    const response = await axiosInstance.post<{ token: string }>('/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('auth-token', response.data.token);
    }
    return response.data.token;
  },
};
