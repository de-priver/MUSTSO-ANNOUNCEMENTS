import { User, mockUserProfile, mockAdminProfile } from './users';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  isAuthenticated: boolean;
  expiresAt: Date;
}

// Mock user credentials for testing
export const mockAuthUsers = [
  {
    email: 'john.doe@company.com',
    password: 'password123',
    user: mockUserProfile,
  },
  {
    email: 'sarah.johnson@company.com',
    password: 'admin123',
    user: mockAdminProfile,
  },
  {
    email: 'admin@mustso.edu',
    password: 'mustso2024',
    user: {
      ...mockAdminProfile,
      email: 'admin@mustso.edu',
      firstName: 'Admin',
      lastName: 'User',
    },
  },
  {
    email: 'user@mustso.edu',
    password: 'user123',
    user: {
      ...mockUserProfile,
      email: 'user@mustso.edu',
      firstName: 'Student',
      lastName: 'User',
    },
  },
];

// Generate a mock JWT token
export const generateMockToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: user.id, 
    email: user.email,
    role: user.role,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }));
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
};

// Mock authentication functions
export const mockAuthService = {
  // Simulate login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const authUser = mockAuthUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (authUser) {
      const token = generateMockToken(authUser.user);
      
      // Store session in localStorage
      const session: AuthSession = {
        user: authUser.user,
        token,
        isAuthenticated: true,
        expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)), // 24 hours
      };
      localStorage.setItem('auth_session', JSON.stringify(session));
      
      return {
        success: true,
        user: authUser.user,
        token,
        message: 'Login successful',
      };
    }
    
    return {
      success: false,
      message: 'Invalid email or password',
    };
  },

  // Simulate registration
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
      };
    }
    
    // Check if user already exists
    const existingUser = mockAuthUsers.find(u => u.email === data.email);
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: '',
      location: '',
      department: '',
      position: '',
      joinDate: new Date().toLocaleDateString(),
      bio: '',
      avatar: '',
      role: 'user',
    };
    
    // Add to mock users
    mockAuthUsers.push({
      email: data.email,
      password: data.password,
      user: newUser,
    });
    
    const token = generateMockToken(newUser);
    
    // Store session
    const session: AuthSession = {
      user: newUser,
      token,
      isAuthenticated: true,
      expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)),
    };
    localStorage.setItem('auth_session', JSON.stringify(session));
    
    return {
      success: true,
      user: newUser,
      token,
      message: 'Registration successful',
    };
  },

  // Get current session
  getCurrentSession: (): AuthSession | null => {
    try {
      const sessionData = localStorage.getItem('auth_session');
      if (!sessionData) return null;
      
      const session: AuthSession = JSON.parse(sessionData);
      
      // Check if session is expired
      if (new Date(session.expiresAt) < new Date()) {
        localStorage.removeItem('auth_session');
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Error parsing session:', error);
      localStorage.removeItem('auth_session');
      return null;
    }
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('auth_session');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const session = mockAuthService.getCurrentSession();
    return session !== null && session.isAuthenticated;
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const session = mockAuthService.getCurrentSession();
    return session?.user.role === 'admin' || false;
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const session = mockAuthService.getCurrentSession();
    return session?.user || null;
  },
};

// Session storage key
export const AUTH_SESSION_KEY = 'auth_session';
