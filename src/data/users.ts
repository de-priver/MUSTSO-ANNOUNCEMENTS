export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  first_name?: string; // Backend field
  last_name?: string;  // Backend field
  email: string;
  phone: string;
  location: string;
  department: string;
  position: string;
  joinDate?: string;
  join_date?: string; // Backend field
  bio: string;
  avatar?: string;
  role?: 'user' | 'admin';
}

export interface UserActivity {
  id: string;
  type: 'comment' | 'like' | 'view' | 'post';
  title: string;
  timestamp: string;
}

export interface UserNotification {
  id: string;
  title: string;
  timestamp: string;
  read: boolean;
}

// Mock current user profile data
export const mockUserProfile: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@company.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  department: 'Engineering',
  position: 'Senior Software Engineer',
  joinDate: 'March 2022',
  bio: 'Passionate software engineer with expertise in full-stack development and cloud technologies. I enjoy building scalable applications and mentoring junior developers.',
  avatar: '',
  role: 'user',
};

// Mock admin user profile
export const mockAdminProfile: User = {
  id: '2',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@company.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA',
  department: 'Executive',
  position: 'Chief Executive Officer',
  joinDate: 'January 2020',
  bio: 'Experienced leader passionate about innovation and team development. Focused on driving organizational growth and creating positive workplace culture.',
  avatar: '',
  role: 'admin',
};

// Mock recent activity for users
export const mockRecentActivity: UserActivity[] = [
  {
    id: '1',
    type: 'comment',
    title: 'Commented on "Q4 Company All-Hands Meeting"',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'like',
    title: 'Liked "New Employee Wellness Program Launch"',
    timestamp: '1 day ago',
  },
  {
    id: '3',
    type: 'view',
    title: 'Viewed Sarah Johnson\'s profile',
    timestamp: '2 days ago',
  },
  {
    id: '4',
    type: 'post',
    title: 'Posted a comment on "IT Security Training"',
    timestamp: '3 days ago',
  },
];

// Mock notifications for users
export const mockNotifications: UserNotification[] = [
  {
    id: '1',
    title: 'New announcement: "IT Security Training"',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '2',
    title: 'Emma Davis replied to your comment',
    timestamp: '3 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'Weekly digest is now available',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '4',
    title: 'Your profile was viewed by David Wilson',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '5',
    title: 'New leader announcement posted',
    timestamp: '3 days ago',
    read: true,
  },
];

// Mock list of all users (for admin purposes)
export const mockAllUsers: User[] = [
  mockUserProfile,
  mockAdminProfile,
  {
    id: '3',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@company.com',
    phone: '+1 (555) 345-6789',
    location: 'San Francisco, CA',
    department: 'Technology',
    position: 'Chief Technology Officer',
    joinDate: 'March 2021',
    bio: 'Technology leader with expertise in cloud architecture and scalable systems.',
    avatar: '',
    role: 'admin',
  },
  {
    id: '4',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@company.com',
    phone: '+1 (555) 456-7890',
    location: 'Los Angeles, CA',
    department: 'Marketing',
    position: 'VP of Marketing',
    joinDate: 'June 2020',
    bio: 'Creative marketing strategist focused on brand awareness and customer engagement.',
    avatar: '',
    role: 'user',
  },
  {
    id: '5',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@company.com',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL',
    department: 'Sales',
    position: 'VP of Sales',
    joinDate: 'November 2020',
    bio: 'Results-driven sales leader with a focus on client relationships and market expansion.',
    avatar: '',
    role: 'user',
  },
];

// Available departments for filtering
export const userDepartments = [
  'Engineering',
  'Technology',
  'Marketing',
  'Sales',
  'Finance',
  'Human Resources',
  'Operations',
  'Legal',
  'Executive',
  'Customer Success',
  'Product',
  'Business Development',
  'Data Science',
  'Quality',
];
