import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies
});

// // Add request interceptor for logging
// api.interceptors.request.use((config) => {
//   // Log the request configuration
//   console.log('Request config:', {
//     url: config.url,
//     method: config.method,
//     headers: config.headers,
//     baseURL: config.baseURL,
//     withCredentials: config.withCredentials
//   });
//   return config;
// });

// // Add response interceptor to handle errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.message);
//     return Promise.reject(error);
//   }
// );

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    nickname: string;
  };
}

export const auth = {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', {
        username,
        password,
      });
      
      // Store user data in localStorage
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
      // Clear user data from localStorage
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
    // Check if user data exists in localStorage
    const user = localStorage.getItem('user');
    return !!user;
  },
};

export default api; 