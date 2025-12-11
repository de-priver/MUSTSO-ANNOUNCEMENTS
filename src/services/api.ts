// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 10000;

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login/`,
    REGISTER: `${API_BASE_URL}/auth/register/`,
    LOGOUT: `${API_BASE_URL}/auth/logout/`,
    PROFILE: `${API_BASE_URL}/auth/profile/`,
    ACTIVITIES: `${API_BASE_URL}/auth/activities/`,
    NOTIFICATIONS: `${API_BASE_URL}/auth/notifications/`,
  },
  
  // Announcements endpoints
  ANNOUNCEMENTS: {
    LIST: `${API_BASE_URL}/announcements/`,
    DETAIL: (id: string) => `${API_BASE_URL}/announcements/${id}/`,
    COMMENTS: (id: string) => `${API_BASE_URL}/announcements/${id}/comments/`,
    LIKE: (id: string) => `${API_BASE_URL}/announcements/${id}/like/`,
    STATS: `${API_BASE_URL}/announcements/stats/`,
    CATEGORIES: `${API_BASE_URL}/announcements/categories/`,
    HASHTAGS: `${API_BASE_URL}/announcements/hashtags/`,
  },
  
  // Leaders endpoints
  LEADERS: {
    LIST: `${API_BASE_URL}/leaders/`,
    DETAIL: (id: string) => `${API_BASE_URL}/leaders/${id}/`,
    STATS: `${API_BASE_URL}/leaders/stats/`,
  },
  
  // Colleges endpoints
  COLLEGES: {
    LIST: `${API_BASE_URL}/colleges/`,
    DETAIL: (id: string) => `${API_BASE_URL}/colleges/${id}/`,
    DEPARTMENTS: (collegeId: string) => `${API_BASE_URL}/colleges/${collegeId}/departments/`,
    ALL_DEPARTMENTS: `${API_BASE_URL}/colleges/departments/`,
    STATS: `${API_BASE_URL}/colleges/stats/`,
  },
};

// HTTP client configuration
export const httpClient = {
  async request(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Token ${token}` }),
        ...options.headers,
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      
      const contentType = response.headers.get('content-type');
      let responseData;
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      if (!response.ok) {
        // If the response contains error details, use them
        if (responseData && typeof responseData === 'object' && responseData.message) {
          throw new Error(responseData.message);
        } else if (responseData && typeof responseData === 'object') {
          // Handle field-specific errors from Django REST framework
          const errorMessages = [];
          for (const [field, errors] of Object.entries(responseData)) {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              errorMessages.push(`${field}: ${errors}`);
            }
          }
          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join('; '));
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  get(url: string, options: RequestInit = {}) {
    return this.request(url, { ...options, method: 'GET' });
  },

  post(url: string, data?: unknown, options: RequestInit = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put(url: string, data?: unknown, options: RequestInit = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch(url: string, data?: unknown, options: RequestInit = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete(url: string, options: RequestInit = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  },

  // For file uploads
  postFormData(url: string, formData: FormData, options: RequestInit = {}) {
    const token = localStorage.getItem('authToken');
    
    return this.request(url, {
      ...options,
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Token ${token}` }),
        ...options.headers,
      },
      body: formData,
    });
  },
};

export { API_BASE_URL, API_TIMEOUT };
