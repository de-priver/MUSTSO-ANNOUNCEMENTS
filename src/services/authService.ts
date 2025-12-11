import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  AuthSession
} from '@/data/auth';
import { User } from '@/data/users';
import { usersService } from './usersService';
import { API_ENDPOINTS, httpClient } from './api';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.success && response.user && response.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.token);
        
        // Set current user in users service
        usersService.setCurrentUser(response.user);
        
        // Add login activity
        await usersService.addActivity({
          type: 'view',
          title: 'Logged into the system',
        });
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message || 'Login successful',
        };
      }
      
      return {
        success: false,
        message: response.message || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please try again.',
      };
    }
  },

  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      // Transform the data to match backend expectations
      const transformedData = {
        username: data.email, // Use email as username
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm
      };

      console.log('Sending registration data:', transformedData);

      const response = await httpClient.post(API_ENDPOINTS.AUTH.REGISTER, transformedData);
      
      console.log('Registration response:', response);
      
      if (response.success && response.user && response.token) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.token);
        
        // Set current user in users service
        usersService.setCurrentUser(response.user);
        
        // Add registration activity
        await usersService.addActivity({
          type: 'view',
          title: 'Created new account',
        });
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          message: response.message || 'Registration successful',
        };
      }
      
      return {
        success: false,
        message: response.message || response.errors || 'Registration failed',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      };
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint
      await httpClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local data even if API call fails
      localStorage.removeItem('authToken');
      usersService.resetCurrentUser();
    }
  },

  // Get current session
  getCurrentSession: (): AuthSession | null => {
    const token = localStorage.getItem('authToken');
    const user = usersService.getCurrentUser();
    
    if (token && user) {
      return {
        isAuthenticated: true,
        user,
        token,
      };
    }
    
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = usersService.getCurrentUser();
    return user?.role === 'admin';
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return usersService.getCurrentUser();
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Refresh user profile from server
  refreshProfile: async (): Promise<User | null> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.AUTH.PROFILE);
      if (response) {
        usersService.setCurrentUser(response);
        return response;
      }
      return null;
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      return null;
    }
  },

  // Validate token with server
  validateToken: async (): Promise<boolean> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.AUTH.PROFILE);
      return !!response;
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('authToken');
      usersService.resetCurrentUser();
      return false;
    }
  },

  // Validate session and refresh if needed
  validateSession: async (): Promise<AuthState> => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return {
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        };
      }
      
      // Validate token with server
      const isValid = await this.validateToken();
      
      if (!isValid) {
        return {
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        };
      }
      
      const user = usersService.getCurrentUser();
      
      return {
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
    try {
      const response = await httpClient.post('/api/auth/change-password/', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      
      return {
        success: true,
        message: response.message || 'Password changed successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to change password. Please try again.',
      };
    }
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<AuthResponse> => {
    try {
      const response = await httpClient.post('/api/auth/password-reset/', {
        email,
      });
      
      return {
        success: true,
        message: response.message || 'Password reset instructions have been sent to your email.',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send password reset email. Please try again.',
      };
    }
  },
};
