import { Leader } from '@/data/leaders';
import { API_ENDPOINTS, httpClient } from './api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateLeaderData {
  name: string;
  position: string;
  department: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  join_date: string;
  team_size: number;
  achievements: string[];
  image?: File;
  is_cabinet?: boolean;
  college?: string;
}

export const leadersService = {
  // Get all leaders with optional filters
  getLeaders: async (filters?: {
    department?: string;
    position?: string;
    college?: string;
    is_cabinet?: boolean;
    search?: string;
  }): Promise<ApiResponse<Leader[]>> => {
    try {
      const params = new URLSearchParams();
      
      if (filters?.department && filters.department !== 'all') {
        params.append('department', filters.department);
      }
      
      if (filters?.position && filters.position !== 'all') {
        params.append('position', filters.position);
      }
      
      if (filters?.college && filters.college !== 'all') {
        params.append('college', filters.college);
      }
      
      if (filters?.is_cabinet !== undefined) {
        params.append('is_cabinet', filters.is_cabinet.toString());
      }
      
      if (filters?.search) {
        params.append('search', filters.search);
      }
      
      const url = params.toString() 
        ? `${API_ENDPOINTS.LEADERS.LIST}?${params.toString()}`
        : API_ENDPOINTS.LEADERS.LIST;
        
      const response = await httpClient.get(url);
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch leaders',
      };
    }
  },

  // Get leaders with filtering
  getLeadersFiltered: async (
    department?: string,
    search?: string
  ): Promise<ApiResponse<Leader[]>> => {
    try {
      const params = new URLSearchParams();
      
      if (department && department !== 'all') {
        params.append('department', department);
      }
      
      if (search) {
        params.append('search', search);
      }
      
      const url = params.toString() 
        ? `${API_ENDPOINTS.LEADERS.LIST}?${params.toString()}`
        : API_ENDPOINTS.LEADERS.LIST;
        
      const response = await httpClient.get(url);
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch leaders',
      };
    }
  },

  // Get single leader by ID
  getLeaderById: async (id: string): Promise<ApiResponse<Leader>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.LEADERS.DETAIL(id));
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch leader',
      };
    }
  },

  // Create new leader (admin only)
  createLeader: async (leaderData: CreateLeaderData): Promise<ApiResponse<Leader>> => {
    try {
      let response;
      
      if (leaderData.image) {
        // Handle file upload
        const formData = new FormData();
        formData.append('name', leaderData.name);
        formData.append('position', leaderData.position);
        formData.append('department', leaderData.department);
        formData.append('description', leaderData.description);
        formData.append('email', leaderData.email);
        formData.append('phone', leaderData.phone);
        formData.append('location', leaderData.location);
        formData.append('join_date', leaderData.join_date);
        formData.append('team_size', leaderData.team_size.toString());
        formData.append('image', leaderData.image);
        
        // Add achievements
        leaderData.achievements.forEach(achievement => {
          formData.append('achievements', achievement);
        });
        
        response = await httpClient.postFormData(API_ENDPOINTS.LEADERS.LIST, formData);
      } else {
        // Regular JSON request
        const payload = {
          name: leaderData.name,
          position: leaderData.position,
          department: leaderData.department,
          description: leaderData.description,
          email: leaderData.email,
          phone: leaderData.phone,
          location: leaderData.location,
          join_date: leaderData.join_date,
          team_size: leaderData.team_size,
          achievements: leaderData.achievements,
        };
        
        response = await httpClient.post(API_ENDPOINTS.LEADERS.LIST, payload);
      }
      
      return {
        success: true,
        data: response,
        message: 'Leader created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create leader',
      };
    }
  },

  // Update leader (admin only)
  updateLeader: async (id: string, updates: Partial<CreateLeaderData>): Promise<ApiResponse<Leader>> => {
    try {
      let response;
      
      if (updates.image) {
        // Handle file upload
        const formData = new FormData();
        if (updates.name) formData.append('name', updates.name);
        if (updates.position) formData.append('position', updates.position);
        if (updates.department) formData.append('department', updates.department);
        if (updates.description) formData.append('description', updates.description);
        if (updates.email) formData.append('email', updates.email);
        if (updates.phone) formData.append('phone', updates.phone);
        if (updates.location) formData.append('location', updates.location);
        if (updates.join_date) formData.append('join_date', updates.join_date);
        if (updates.team_size) formData.append('team_size', updates.team_size.toString());
        formData.append('image', updates.image);
        
        if (updates.achievements) {
          updates.achievements.forEach(achievement => {
            formData.append('achievements', achievement);
          });
        }
        
        response = await httpClient.postFormData(API_ENDPOINTS.LEADERS.DETAIL(id), formData);
      } else {
        // Regular JSON request
        const payload: Record<string, unknown> = {};
        if (updates.name) payload.name = updates.name;
        if (updates.position) payload.position = updates.position;
        if (updates.department) payload.department = updates.department;
        if (updates.description) payload.description = updates.description;
        if (updates.email) payload.email = updates.email;
        if (updates.phone) payload.phone = updates.phone;
        if (updates.location) payload.location = updates.location;
        if (updates.join_date) payload.join_date = updates.join_date;
        if (updates.team_size) payload.team_size = updates.team_size;
        if (updates.achievements) payload.achievements = updates.achievements;
        
        response = await httpClient.patch(API_ENDPOINTS.LEADERS.DETAIL(id), payload);
      }
      
      return {
        success: true,
        data: response,
        message: 'Leader updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update leader',
      };
    }
  },

  // Delete leader (admin only)
  deleteLeader: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      await httpClient.delete(API_ENDPOINTS.LEADERS.DETAIL(id));
      return {
        success: true,
        data: true,
        message: 'Leader deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete leader',
      };
    }
  },

  // Get leader statistics
  getStats: async (): Promise<ApiResponse<{
    total_leaders: number;
    total_team_size: number;
    department_counts: Record<string, number>;
    departments: string[];
  }>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.LEADERS.STATS);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch leader statistics',
      };
    }
  },
};
