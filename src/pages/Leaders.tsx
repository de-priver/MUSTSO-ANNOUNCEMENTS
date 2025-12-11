import { useState, useEffect } from 'react';
import NavbarWithProfile from '@/components/NavbarWithProfile';
import LeaderCard from '@/components/LeaderCard';
import CollegeModal from '@/components/CollegeModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter } from 'lucide-react';
import { leadersService, collegesService } from '@/services';
import { Leader } from '@/data/leaders';
import { College } from '@/data/colleges';

const Leaders = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState('all');
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState('all');
  const [viewType, setViewType] = useState<'cabinet' | 'college'>('cabinet');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [isCollegeModalOpen, setIsCollegeModalOpen] = useState(false);

  const cabinetPositions = [
    'President',
    'Vice President',
    'Secretary General',
    'Deputy Secretary General',
    'Treasurer',
    'Minister',
    'Deputy Minister',
    'Director',
    'Other'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [leadersResponse, collegesResponse] = await Promise.all([
        leadersService.getLeaders(),
        collegesService.getColleges()
      ]);
      
      if (leadersResponse.success && leadersResponse.data) {
        setLeaders(leadersResponse.data);
      } else {
        throw new Error(leadersResponse.error || 'Failed to load leaders');
      }
      
      if (collegesResponse.success && collegesResponse.data) {
        setColleges(collegesResponse.data);
      } else {
        throw new Error(collegesResponse.error || 'Failed to load colleges');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaders = leaders.filter(leader => {
    const matchesSearch = searchTerm === '' || 
      leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || 
      leader.department.toLowerCase() === selectedDepartment.toLowerCase();
    
    const matchesPosition = selectedPosition === 'all' ||
      leader.position === selectedPosition;
    
    const matchesCollege = selectedCollegeFilter === 'all' ||
      (leader.college && leader.college.id === selectedCollegeFilter);
    
    const matchesViewType = viewType === 'cabinet' 
      ? (leader.is_cabinet !== false) 
      : true;
    
    return matchesSearch && matchesDepartment && matchesPosition && matchesCollege && matchesViewType;
  });

  const handleCollegeClick = (college: College) => {
    setSelectedCollege(college);
    setIsCollegeModalOpen(true);
  };

  const handleCloseCollegeModal = () => {
    setIsCollegeModalOpen(false);
    setSelectedCollege(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavbarWithProfile />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading leaders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavbarWithProfile />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadData} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarWithProfile />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {viewType === 'cabinet' ? 'Leadership Team' : 'College Leaders'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {viewType === 'cabinet' 
              ? 'Meet the leaders driving our organization forward and learn about their expertise.'
              : 'Explore our academic colleges and their leadership structure.'
            }
          </p>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <Button
              variant={viewType === 'cabinet' ? 'default' : 'outline'}
              onClick={() => setViewType('cabinet')}
            >
              Cabinet wise
            </Button>
            <Button
              variant={viewType === 'college' ? 'default' : 'outline'}
              onClick={() => setViewType('college')}
            >
              College wise
            </Button>
          </div>
        </div>

        {viewType === 'cabinet' && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLeaders.length} leader{filteredLeaders.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {viewType === 'cabinet' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeaders.map((leader) => (
              <LeaderCard key={leader.id} leader={leader} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <Card 
                key={college.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleCollegeClick(college)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={college.leader_image} alt={college.leader_name} />
                      <AvatarFallback className="text-lg">
                        {college.leader_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {college.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Dean: {college.leader_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {college.departments.length} Departments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CollegeModal 
          college={selectedCollege}
          isOpen={isCollegeModalOpen}
          onClose={handleCloseCollegeModal}
        />
      </div>
    </div>
  );
};

export default Leaders;