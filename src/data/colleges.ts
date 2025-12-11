export interface Department {
  id?: string;
  name: string;
  leader_name: string;
  leaderName?: string;
  email: string;
  phone: string;
}

export interface College {
  id: string;
  name: string;
  leader_name: string;
  leader_image?: string;
  // Legacy support for frontend
  leader?: {
    name: string;
    image?: string;
  };
  departments: Department[];
}

// Mock colleges data for MUSTSO
export const mockColleges: College[] = [
  {
    id: '1',
    name: 'College of Engineering & Technology',
    leader: {
      name: 'Dr. Sarah Johnson',
      image: '',
    },
    departments: [
      { name: 'Computer Science', leaderName: 'Prof. David Wilson', email: 'david.wilson@mustso.edu', phone: '+1 (555) 234-5678' },
      { name: 'Mechanical Engineering', leaderName: 'Dr. Mike Chen', email: 'mike.chen@mustso.edu', phone: '+1 (555) 567-8901' },
      { name: 'Electrical Engineering', leaderName: 'Prof. Lisa Park', email: 'lisa.park@mustso.edu', phone: '+1 (555) 678-9012' },
      { name: 'Civil Engineering', leaderName: 'Dr. James Thompson', email: 'james.thompson@mustso.edu', phone: '+1 (555) 789-0123' },
      { name: 'Chemical Engineering', leaderName: 'Prof. Maria Garcia', email: 'maria.garcia@mustso.edu', phone: '+1 (555) 890-1234' },
    ],
  },
  {
    id: '2',
    name: 'College of Business & Management',
    leader: {
      name: 'Dr. Alex Rodriguez',
      image: '',
    },
    departments: [
      { name: 'Business Administration', leaderName: 'Prof. Robert Kim', email: 'robert.kim@mustso.edu', phone: '+1 (555) 901-2345' },
      { name: 'Marketing', leaderName: 'Dr. Jennifer Lee', email: 'jennifer.lee@mustso.edu', phone: '+1 (555) 012-3456' },
      { name: 'Finance', leaderName: 'Prof. Anthony Brown', email: 'anthony.brown@mustso.edu', phone: '+1 (555) 123-4567' },
      { name: 'Human Resources', leaderName: 'Dr. Rachel Adams', email: 'rachel.adams@mustso.edu', phone: '+1 (555) 234-5678' },
      { name: 'Operations Management', leaderName: 'Prof. Kevin Martinez', email: 'kevin.martinez@mustso.edu', phone: '+1 (555) 345-6789' },
    ],
  },
  {
    id: '3',
    name: 'College of Health Sciences',
    leader: {
      name: 'Dr. Emma Davis',
      image: '',
    },
    departments: [
      { name: 'Medicine', leaderName: 'Dr. Michael Brown', email: 'michael.brown@mustso.edu', phone: '+1 (555) 456-7890' },
      { name: 'Nursing', leaderName: 'Prof. Sarah Williams', email: 'sarah.williams@mustso.edu', phone: '+1 (555) 567-8901' },
      { name: 'Pharmacy', leaderName: 'Dr. John Davis', email: 'john.davis@mustso.edu', phone: '+1 (555) 678-9012' },
      { name: 'Public Health', leaderName: 'Prof. Lisa Johnson', email: 'lisa.johnson@mustso.edu', phone: '+1 (555) 789-0123' },
      { name: 'Medical Technology', leaderName: 'Dr. David Wilson', email: 'david.wilson@mustso.edu', phone: '+1 (555) 890-1234' },
    ],
  },
  {
    id: '4',
    name: 'College of Arts & Sciences',
    leader: {
      name: 'Dr. Mike Chen',
      image: '',
    },
    departments: [
      { name: 'Literature', leaderName: 'Prof. Emily Rodriguez', email: 'emily.rodriguez@mustso.edu', phone: '+1 (555) 901-2345' },
      { name: 'Mathematics', leaderName: 'Dr. Robert Taylor', email: 'robert.taylor@mustso.edu', phone: '+1 (555) 012-3456' },
      { name: 'Physics', leaderName: 'Prof. Maria Lopez', email: 'maria.lopez@mustso.edu', phone: '+1 (555) 123-4567' },
      { name: 'Chemistry', leaderName: 'Dr. James Anderson', email: 'james.anderson@mustso.edu', phone: '+1 (555) 234-5678' },
      { name: 'Biology', leaderName: 'Prof. Jennifer White', email: 'jennifer.white@mustso.edu', phone: '+1 (555) 345-6789' },
    ],
  },
  {
    id: '5',
    name: 'College of Social Sciences',
    leader: {
      name: 'Dr. Lisa Park',
      image: '',
    },
    departments: [
      { name: 'Psychology', leaderName: 'Prof. Daniel Harris', email: 'daniel.harris@mustso.edu', phone: '+1 (555) 456-7890' },
      { name: 'Sociology', leaderName: 'Dr. Amanda Clark', email: 'amanda.clark@mustso.edu', phone: '+1 (555) 567-8901' },
      { name: 'Political Science', leaderName: 'Prof. Mark Thompson', email: 'mark.thompson@mustso.edu', phone: '+1 (555) 678-9012' },
      { name: 'Economics', leaderName: 'Dr. Sandra Lee', email: 'sandra.lee@mustso.edu', phone: '+1 (555) 789-0123' },
      { name: 'International Relations', leaderName: 'Prof. Carlos Martinez', email: 'carlos.martinez@mustso.edu', phone: '+1 (555) 890-1234' },
    ],
  },
  {
    id: '6',
    name: 'College of Education',
    leader: {
      name: 'Dr. James Thompson',
      image: '',
    },
    departments: [
      { name: 'Elementary Education', leaderName: 'Prof. Nancy Wilson', email: 'nancy.wilson@mustso.edu', phone: '+1 (555) 901-2345' },
      { name: 'Secondary Education', leaderName: 'Dr. Paul Johnson', email: 'paul.johnson@mustso.edu', phone: '+1 (555) 012-3456' },
      { name: 'Special Education', leaderName: 'Prof. Linda Brown', email: 'linda.brown@mustso.edu', phone: '+1 (555) 123-4567' },
      { name: 'Educational Psychology', leaderName: 'Dr. Kevin Davis', email: 'kevin.davis@mustso.edu', phone: '+1 (555) 234-5678' },
      { name: 'Curriculum Development', leaderName: 'Prof. Helen Garcia', email: 'helen.garcia@mustso.edu', phone: '+1 (555) 345-6789' },
    ],
  },
];

// Available college names for quick reference
export const collegeNames = mockColleges.map(college => college.name);
