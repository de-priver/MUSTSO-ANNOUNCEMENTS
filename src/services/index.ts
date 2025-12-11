// Service exports
export { announcementsService } from './announcementsService';
export { authService } from './authService';
export { leadersService } from './leadersService';
export { collegesService } from './collegesService';
export { usersService } from './usersService';

// Type exports (using explicit names to avoid conflicts)
export type { 
  ApiResponse, 
  PaginatedResponse 
} from './announcementsService';

export type { 
  AuthState 
} from './authService';
