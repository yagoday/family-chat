import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Log the request configuration
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    baseURL: config.baseURL,
    withCredentials: config.withCredentials
  });
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      config: error.config,
      response: error.response
    });
    return Promise.reject(error);
  }
);

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
    try {
      console.log('Attempting login with:', { username, API_BASE_URL });
      const response = await api.post<LoginResponse>('/auth/login', {
        username,
        password,
      });
      console.log('Login response:', response.data);
      
      // Store complete user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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