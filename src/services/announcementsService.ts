import { Announcement } from '@/data/announcements';
import { API_ENDPOINTS, httpClient } from './api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Hashtag {
  id: string;
  name: string;
  usage_count: number;
}

export const announcementsService = {
  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.ANNOUNCEMENTS.CATEGORIES);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch categories',
      };
    }
  },

  // Get all hashtags
  getHashtags: async (): Promise<ApiResponse<Hashtag[]>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.ANNOUNCEMENTS.HASHTAGS);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch hashtags',
      };
    }
  },

  // Get all announcements
  getAnnouncements: async (): Promise<ApiResponse<Announcement[]>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.ANNOUNCEMENTS.LIST);
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch announcements',
      };
    }
  },

  // Get announcement by ID
  getById: async (id: string): Promise<ApiResponse<Announcement>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.ANNOUNCEMENTS.DETAIL(id));
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch announcement',
      };
    }
  },

  // Get comments for an announcement
  getComments: async (announcementId: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.ANNOUNCEMENTS.COMMENTS(announcementId));
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch comments',
      };
    }
  },

  // Add a comment to an announcement
  addComment: async (announcementId: string, content: string): Promise<ApiResponse<any>> => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.ANNOUNCEMENTS.COMMENTS(announcementId), {
        content: content,
      });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add comment',
      };
    }
  },

  // Toggle like on an announcement
  toggleLike: async (announcementId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await httpClient.post(API_ENDPOINTS.ANNOUNCEMENTS.LIKE(announcementId));
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to toggle like',
      };
    }
  },

  // Get announcements with pagination and filtering
  getAnnouncementsPaginated: async (
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string,
    hashtag?: string
  ): Promise<PaginatedResponse<Announcement>> => {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('page_size', limit.toString());
      
      if (category && category !== 'all') {
        params.append('category', category);
      }
      
      if (search) {
        params.append('search', search);
      }
      
      if (hashtag) {
        params.append('hashtags', hashtag);
      }
      
      const url = `${API_ENDPOINTS.ANNOUNCEMENTS.LIST}?${params.toString()}`;
      const response = await httpClient.get(url);
      
      return {
        success: true,
        data: response.results,
        pagination: {
          page,
          limit,
          total: response.count,
          totalPages: Math.ceil(response.count / limit),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch announcements',
      };
    }
  },

  // Get single announcement by ID
  getAnnouncementById: async (id: string): Promise<ApiResponse<Announcement>> => {
    try {
      await delay(300);
      const announcement = announcementsData.find(a => a.id === id);
      
      if (!announcement) {
        return {
          success: false,
          error: 'Announcement not found',
        };
      }
      
      return {
        success: true,
        data: announcement,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch announcement',
      };
    }
  },

  // Admin: Get all announcements for management
  getAdminAnnouncements: async (): Promise<ApiResponse<Announcement[]>> => {
    try {
      await delay(500);
      return {
        success: true,
        data: adminAnnouncementsData,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch admin announcements',
      };
    }
  },

  // Admin: Create new announcement
  createAnnouncement: async (announcement: Omit<Announcement, 'id'>): Promise<ApiResponse<Announcement>> => {
    try {
      await delay(800);
      
      const newAnnouncement: Announcement = {
        ...announcement,
        id: generateId(),
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: [],
      };
      
      adminAnnouncementsData.unshift(newAnnouncement);
      // Also add to public announcements if it's a public category
      if (['Academic', 'General', 'Events'].includes(newAnnouncement.category)) {
        announcementsData.unshift(newAnnouncement);
      }
      
      return {
        success: true,
        data: newAnnouncement,
        message: 'Announcement created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create announcement',
      };
    }
  },

  // Admin: Update announcement
  updateAnnouncement: async (id: string, updates: Partial<Announcement>): Promise<ApiResponse<Announcement>> => {
    try {
      await delay(700);
      
      const adminIndex = adminAnnouncementsData.findIndex(a => a.id === id);
      if (adminIndex === -1) {
        return {
          success: false,
          error: 'Announcement not found',
        };
      }
      
      const updatedAnnouncement = {
        ...adminAnnouncementsData[adminIndex],
        ...updates,
        id, // Ensure ID doesn't change
      };
      
      adminAnnouncementsData[adminIndex] = updatedAnnouncement;
      
      // Update in public announcements if exists
      const publicIndex = announcementsData.findIndex(a => a.id === id);
      if (publicIndex !== -1) {
        announcementsData[publicIndex] = updatedAnnouncement;
      }
      
      return {
        success: true,
        data: updatedAnnouncement,
        message: 'Announcement updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update announcement',
      };
    }
  },

  // Admin: Delete announcement
  deleteAnnouncement: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      await delay(500);
      
      const adminIndex = adminAnnouncementsData.findIndex(a => a.id === id);
      if (adminIndex === -1) {
        return {
          success: false,
          error: 'Announcement not found',
        };
      }
      
      adminAnnouncementsData.splice(adminIndex, 1);
      
      // Remove from public announcements if exists
      const publicIndex = announcementsData.findIndex(a => a.id === id);
      if (publicIndex !== -1) {
        announcementsData.splice(publicIndex, 1);
      }
      
      return {
        success: true,
        data: true,
        message: 'Announcement deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete announcement',
      };
    }
  },

  // Like/Unlike announcement
  toggleLike: async (id: string, liked: boolean): Promise<ApiResponse<Announcement>> => {
    try {
      await delay(200);
      
      const updateLikes = (announcements: Announcement[]) => {
        const index = announcements.findIndex(a => a.id === id);
        if (index !== -1) {
          announcements[index] = {
            ...announcements[index],
            likes: Math.max(0, announcements[index].likes + (liked ? 1 : -1)),
          };
          return announcements[index];
        }
        return null;
      };
      
      let updatedAnnouncement = updateLikes(announcementsData);
      if (!updatedAnnouncement) {
        updatedAnnouncement = updateLikes(adminAnnouncementsData);
      }
      
      if (!updatedAnnouncement) {
        return {
          success: false,
          error: 'Announcement not found',
        };
      }
      
      return {
        success: true,
        data: updatedAnnouncement,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update like',
      };
    }
  },

  // Add comment to announcement
  addComment: async (
    announcementId: string,
    comment: { author: string; content: string }
  ): Promise<ApiResponse<Announcement>> => {
    try {
      await delay(400);
      
      const newComment = {
        id: `comment_${Date.now()}`,
        ...comment,
        timestamp: new Date().toLocaleString(),
      };
      
      const updateComments = (announcements: Announcement[]) => {
        const index = announcements.findIndex(a => a.id === announcementId);
        if (index !== -1) {
          announcements[index] = {
            ...announcements[index],
            comments: [...announcements[index].comments, newComment],
          };
          return announcements[index];
        }
        return null;
      };
      
      let updatedAnnouncement = updateComments(announcementsData);
      if (!updatedAnnouncement) {
        updatedAnnouncement = updateComments(adminAnnouncementsData);
      }
      
      if (!updatedAnnouncement) {
        return {
          success: false,
          error: 'Announcement not found',
        };
      }
      
      return {
        success: true,
        data: updatedAnnouncement,
        message: 'Comment added successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to add comment',
      };
    }
  },
};
