import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    nickname: string;
  };
}

export const auth = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      username,
      password,
    });
    console.log('Login response:', response.data); // Debug log
    
    // Store complete user data
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage, even if the server request fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Force reload the page to clear any in-memory state
      window.location.href = '/login';
    }
  },

  async getProfile(): Promise<LoginResponse['user']> {
    const response = await api.get<LoginResponse['user']>('/auth/profile');
    return response.data;
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },
};

export default api; 