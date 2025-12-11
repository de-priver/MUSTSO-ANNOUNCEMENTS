import { 
  User, 
  UserActivity, 
  UserNotification
} from '@/data/users';
import { API_ENDPOINTS, httpClient } from './api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Local state for current user
let currentUser: User | null = null;

export const usersService = {
  // Get current user profile from server
  getCurrentUser: (): User | null => {
    return currentUser;
  },

  // Set current user (used by auth service)
  setCurrentUser: (user: User): void => {
    currentUser = user;
  },

  // Reset current user (used by auth service)
  resetCurrentUser: (): void => {
    currentUser = null;
  },

  // Fetch current user profile from server
  fetchCurrentUser: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.AUTH.PROFILE);
      if (response) {
        currentUser = response;
        return {
          success: true,
          data: response,
        };
      }
      return {
        success: false,
        error: 'Failed to fetch user profile',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user profile',
      };
    }
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await httpClient.patch(API_ENDPOINTS.AUTH.PROFILE, updates);
      if (response) {
        currentUser = response;
        return {
          success: true,
          data: response,
          message: 'Profile updated successfully',
        };
      }
      return {
        success: false,
        error: 'Failed to update profile',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update profile',
      };
    }
  },

  // Get user activities
  getActivities: async (): Promise<ApiResponse<UserActivity[]>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.AUTH.ACTIVITIES);
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch activities',
      };
    }
  },

  // Add user activity
  addActivity: async (activity: { type: string; title: string }): Promise<ApiResponse<UserActivity>> => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.AUTH.ACTIVITIES, activity);
      return {
        success: true,
        data: response,
        message: 'Activity added successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add activity',
      };
    }
  },

  // Get user notifications
  getNotifications: async (): Promise<ApiResponse<UserNotification[]>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.AUTH.NOTIFICATIONS);
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch notifications',
      };
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string): Promise<ApiResponse<boolean>> => {
    try {
      await httpClient.post(`${API_ENDPOINTS.AUTH.NOTIFICATIONS}${notificationId}/read/`);
      return {
        success: true,
        data: true,
        message: 'Notification marked as read',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to mark notification as read',
      };
    }
  },

  // Upload avatar
  uploadAvatar: async (file: File): Promise<ApiResponse<User>> => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await httpClient.postFormData(API_ENDPOINTS.AUTH.PROFILE, formData);
      if (response) {
        currentUser = response;
        return {
          success: true,
          data: response,
          message: 'Avatar uploaded successfully',
        };
      }
      return {
        success: false,
        error: 'Failed to upload avatar',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to upload avatar',
      };
    }
  },

  // Get user statistics (for admin)
  getUserStats: async (): Promise<ApiResponse<{
    total_users: number;
    active_users: number;
    new_users_this_month: number;
  }>> => {
    try {
      const response = await httpClient.get('/api/auth/stats/');
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch user statistics',
      };
    }
  },
};
