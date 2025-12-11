import { useState, useEffect } from 'react';
import NavbarWithProfile from '@/components/NavbarWithProfile';
import LeaderCard from '@/components/LeaderCard';
import AdminLeaderModal from '@/components/AdminLeaderModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Plus, Trash2, Settings } from 'lucide-react';
import { leadersService, collegesService } from '@/services';
import { Leader } from '@/data/leaders';
import { College } from '@/data/colleges';

const AdminLeaders = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

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
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeader = () => {
    setSelectedLeader(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditLeader = (leader: Leader) => {
    setSelectedLeader(leader);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteLeader = async (leaderId: string) => {
    if (!confirm('Are you sure you want to delete this leader?')) return;
    
    try {
      const response = await leadersService.deleteLeader(leaderId);
      if (response.success) {
        setLeaders(prev => prev.filter(l => l.id !== leaderId));
      } else {
        throw new Error(response.error || 'Failed to delete leader');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete leader');
      console.error('Failed to delete leader:', err);
    }
  };

  const handleSaveLeader = async (leaderData: Partial<Leader>) => {
    try {
      if (modalMode === 'add') {
        const response = await leadersService.createLeader(leaderData);
        if (response.success && response.data) {
          setLeaders(prev => [...prev, response.data]);
        } else {
          throw new Error(response.error || 'Failed to create leader');
        }
      } else if (selectedLeader) {
        const response = await leadersService.updateLeader(selectedLeader.id, leaderData);
        if (response.success && response.data) {
          setLeaders(prev => prev.map(l => l.id === selectedLeader.id ? response.data! : l));
        } else {
          throw new Error(response.error || 'Failed to update leader');
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save leader');
      console.error('Failed to save leader:', err);
    }
  };

  // Get unique departments for filter
  const departments = ['all', ...new Set(leaders.map(l => l.department))];

  // Filter leaders based on search and department
  const filteredLeaders = leaders.filter(leader => {
    const matchesSearch = searchTerm === '' || 
      leader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leader.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || 
      leader.department.toLowerCase() === selectedDepartment.toLowerCase();
    
    return matchesSearch && matchesDepartment;
  });

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

  return (
    <div className="min-h-screen bg-background">
      <NavbarWithProfile />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Manage Leaders
          </h1>
          <p className="text-lg text-muted-foreground">
            Add, edit, and manage leadership team members and their information.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 rounded-lg">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Button onClick={handleAddLeader}>
            <Plus className="w-4 h-4 mr-2" />
            Add Leader
          </Button>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search leaders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-muted-foreground w-4 h-4" />
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{leaders.length}</div>
              <div className="text-sm text-muted-foreground">Total Leaders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(leaders.map(l => l.department)).size}
              </div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{filteredLeaders.length}</div>
              <div className="text-sm text-muted-foreground">Filtered Results</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{colleges.length}</div>
              <div className="text-sm text-muted-foreground">Total Colleges</div>
            </CardContent>
          </Card>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredLeaders.length} of {leaders.length} leader{leaders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Leaders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeaders.map((leader) => (
            <div key={leader.id} className="relative group">
              <LeaderCard leader={leader} />
              
              {/* Admin Controls Overlay */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditLeader(leader)}
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteLeader(leader.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLeaders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm || selectedDepartment !== 'all' 
                ? 'No leaders match your current filters.' 
                : 'No leaders found. Add some leaders to get started.'
              }
            </div>
            {(searchTerm || selectedDepartment !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('all');
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Admin Leader Modal */}
        <AdminLeaderModal 
          leader={selectedLeader}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveLeader}
          mode={modalMode}
        />
      </div>
    </div>
  );
};

export default AdminLeaders;
