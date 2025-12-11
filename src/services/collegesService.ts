import { College, Department } from '@/data/colleges';
import { API_ENDPOINTS, httpClient } from './api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CollegeStats {
  total_colleges: number;
  total_departments: number;
  total_leaders: number;
}

export interface CreateCollegeData {
  name: string;
  leader_name: string;
  leader_image?: File;
  departments?: string[];
}

export const collegesService = {
  // Get all colleges
  getColleges: async (): Promise<ApiResponse<College[]>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.COLLEGES.LIST);
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch colleges',
      };
    }
  },

  // Get colleges with filtering
  getCollegesFiltered: async (
    search?: string
  ): Promise<ApiResponse<College[]>> => {
    try {
      const params = new URLSearchParams();
      
      if (search && search.trim() !== '') {
        params.append('search', search);
      }
      
      const url = `${API_ENDPOINTS.COLLEGES.LIST}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await httpClient.get(url);
      
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch filtered colleges',
      };
    }
  },

  // Get single college
  getCollege: async (id: string): Promise<ApiResponse<College>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.COLLEGES.DETAIL(id));
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch college',
      };
    }
  },

  // Create new college
  createCollege: async (collegeData: CreateCollegeData): Promise<ApiResponse<College>> => {
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('name', collegeData.name);
      formData.append('leader_name', collegeData.leader_name);
      
      // Add leader image if provided
      if (collegeData.leader_image) {
        formData.append('leader_image', collegeData.leader_image);
      }
      
      // Add departments if provided
      if (collegeData.departments && collegeData.departments.length > 0) {
        collegeData.departments.forEach((dept, index) => {
          formData.append(`departments[${index}]`, dept);
        });
      }
      
      const response = await httpClient.post(API_ENDPOINTS.COLLEGES.LIST, formData);
      
      return {
        success: true,
        data: response,
        message: 'College created successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create college',
      };
    }
  },

  // Update college
  updateCollege: async (id: string, collegeData: Partial<CreateCollegeData>): Promise<ApiResponse<College>> => {
    try {
      const formData = new FormData();
      
      // Add fields that are provided
      if (collegeData.name) {
        formData.append('name', collegeData.name);
      }
      if (collegeData.leader_name) {
        formData.append('leader_name', collegeData.leader_name);
      }
      if (collegeData.leader_image) {
        formData.append('leader_image', collegeData.leader_image);
      }
      if (collegeData.departments && collegeData.departments.length > 0) {
        collegeData.departments.forEach((dept, index) => {
          formData.append(`departments[${index}]`, dept);
        });
      }
      
      const response = await httpClient.patch(API_ENDPOINTS.COLLEGES.DETAIL(id), formData);
      
      return {
        success: true,
        data: response,
        message: 'College updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update college',
      };
    }
  },

  // Delete college
  deleteCollege: async (id: string): Promise<ApiResponse<null>> => {
    try {
      await httpClient.delete(API_ENDPOINTS.COLLEGES.DETAIL(id));
      return {
        success: true,
        message: 'College deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete college',
      };
    }
  },

  // Get college departments
  getCollegeDepartments: async (collegeId: string): Promise<ApiResponse<Department[]>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.COLLEGES.DEPARTMENTS(collegeId));
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch college departments',
      };
    }
  },

  // Get all departments across colleges
  getAllDepartments: async (): Promise<ApiResponse<Department[]>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.COLLEGES.ALL_DEPARTMENTS);
      return {
        success: true,
        data: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch all departments',
      };
    }
  },

  // Get colleges statistics
  getStats: async (): Promise<ApiResponse<CollegeStats>> => {
    try {
      const response = await httpClient.get(API_ENDPOINTS.COLLEGES.STATS);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch colleges statistics',
      };
    }
  },
};
