export interface Comment {
  id: string;
  author: string | { 
    id: string; 
    firstName?: string; 
    lastName?: string; 
    first_name?: string; 
    last_name?: string; 
    email: string; 
  };
  content: string;
  timestamp: string;
  announcement?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  category: string | { id: string; name: string; slug: string; };
  author: string | { 
    id: string; 
    firstName?: string; 
    lastName?: string; 
    first_name?: string; 
    last_name?: string; 
    email: string; 
  };
  timestamp: string;
  date?: string; // Legacy field
  likes: number;
  comments: Comment[];
  comments_count?: number;
  media?: string;
  avatar?: string;
  content?: string; // Full content for detail view
  excerpt?: string; // Short excerpt
  priority?: string;
}

// Mock announcements data for regular users
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Q4 Company All-Hands Meeting',
    description: 'Join us for our quarterly all-hands meeting where we\'ll discuss achievements, upcoming initiatives, and answer your questions. This meeting will cover our performance metrics, new product launches, strategic partnerships, and team expansions planned for the next quarter.',
    category: 'Company News',
    author: 'Sarah Johnson',
    timestamp: '2 hours ago',
    likes: 24,
    comments: [
      {
        id: '1',
        author: 'Mike Chen',
        content: 'Looking forward to the updates on the new product launch!',
        timestamp: '1 hour ago',
      },
      {
        id: '2',
        author: 'Emma Davis',
        content: 'Will this be recorded for those who can\'t attend live?',
        timestamp: '45 minutes ago',
      },
    ],
    avatar: '',
  },
  {
    id: '2',
    title: 'New Employee Wellness Program Launch',
    description: 'We\'re excited to announce the launch of our comprehensive employee wellness program, featuring mental health resources, fitness memberships, and work-life balance initiatives.',
    category: 'HR Updates',
    author: 'David Wilson',
    timestamp: '1 day ago',
    likes: 18,
    comments: [
      {
        id: '3',
        author: 'Lisa Park',
        content: 'This is fantastic! When does the fitness membership start?',
        timestamp: '18 hours ago',
      },
    ],
    avatar: '',
  },
  {
    id: '3',
    title: 'IT Security Training - Mandatory Completion',
    description: 'All employees must complete the updated cybersecurity training by the end of this month. This training covers the latest security protocols, phishing awareness, and data protection measures.',
    category: 'IT Security',
    author: 'Alex Rodriguez',
    timestamp: '2 days ago',
    likes: 12,
    comments: [],
    avatar: '',
  },
];

// Mock announcements data for admin
export const mockAdminAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to the New Academic Year',
    description: 'We are excited to welcome all students, faculty, and staff to the new academic year. This year brings new opportunities, challenges, and exciting developments across all our programs.',
    category: 'Academic',
    author: 'Dr. Sarah Johnson',
    timestamp: '2024-01-15',
    likes: 15,
    comments: [],
    media: '',
    avatar: '',
  },
  {
    id: '2',
    title: 'Campus Infrastructure Updates',
    description: 'We are pleased to announce significant infrastructure improvements across our campus facilities, including new laboratories, upgraded technology centers, and enhanced student recreational areas.',
    category: 'Infrastructure',
    author: 'Facilities Management',
    timestamp: '2024-01-10',
    likes: 8,
    comments: [],
    media: '',
    avatar: '',
  },
  {
    id: '3',
    title: 'Research Grant Opportunities',
    description: 'New research grant opportunities are now available for faculty members across all departments. Applications are due by the end of this month.',
    category: 'Research',
    author: 'Research Office',
    timestamp: '2024-01-08',
    likes: 12,
    comments: [],
    media: '',
    avatar: '',
  },
  {
    id: '4',
    title: 'Student Leadership Development Program',
    description: 'Applications are now open for our comprehensive student leadership development program. This program is designed to enhance leadership skills and provide opportunities for personal growth.',
    category: 'Student Life',
    author: 'Student Affairs Office',
    timestamp: '2024-01-05',
    likes: 22,
    comments: [],
    media: '',
    avatar: '',
  },
  {
    id: '5',
    title: 'Annual Tech Conference 2024',
    description: 'Join us for our annual technology conference featuring industry experts, innovative research presentations, and networking opportunities for students and faculty.',
    category: 'Events',
    author: 'Tech Committee',
    timestamp: '2024-01-03',
    likes: 35,
    comments: [],
    media: '',
    avatar: '',
  },
];

// Available announcement categories
export const announcementCategories = [
  'Academic',
  'Infrastructure', 
  'Research',
  'Student Life',
  'Events',
  'Company News',
  'HR Updates',
  'IT Security',
  'Administrative',
  'General'
];
