import { useState, useEffect } from 'react';
import NavbarWithProfile from '@/components/NavbarWithProfile';
import AnnouncementCard from '@/components/AnnouncementCard';
import AdminAnnouncementModal from '@/components/AdminAnnouncementModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, Plus, Trash2, Settings } from 'lucide-react';
import { announcementsService } from '@/services';
import { Announcement } from '@/data/announcements';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load announcements on component mount
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await announcementsService.getAdminAnnouncements();
      
      if (response.success && response.data) {
        setAnnouncements(response.data);
      } else {
        setError(response.error || 'Failed to load announcements');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'important' && announcement.category === 'Academic') ||
                         (filterType === 'regular' && announcement.category !== 'Academic');
    return matchesSearch && matchesFilter;
  });

  const handleAddAnnouncement = async (newAnnouncement: Omit<Announcement, 'id'>) => {
    try {
      const response = await announcementsService.createAnnouncement(newAnnouncement);
      
      if (response.success && response.data) {
        setAnnouncements([response.data, ...announcements]);
        // Show success message (you could use a toast here)
        console.log('Announcement created successfully');
      } else {
        setError(response.error || 'Failed to create announcement');
      }
    } catch (err) {
      setError('Failed to create announcement');
      console.error('Error creating announcement:', err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      const response = await announcementsService.deleteAnnouncement(id);
      
      if (response.success) {
        setAnnouncements(announcements.filter(announcement => announcement.id !== id));
        // Show success message
        console.log('Announcement deleted successfully');
      } else {
        setError(response.error || 'Failed to delete announcement');
      }
    } catch (err) {
      setError('Failed to delete announcement');
      console.error('Error deleting announcement:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavbarWithProfile />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading announcements...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavbarWithProfile />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Admin - Announcements Management
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Manage and publish announcements for the university community.
          </p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            Add New Announcement
          </Button>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-muted-foreground w-4 h-4" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Announcements</SelectItem>
                  <SelectItem value="important">Important Only</SelectItem>
                  <SelectItem value="regular">Regular Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{announcements.length}</div>
              <div className="text-sm text-muted-foreground">Total Announcements</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {announcements.filter(a => a.category === 'Academic').length}
              </div>
              <div className="text-sm text-muted-foreground">Academic Announcements</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{filteredAnnouncements.length}</div>
              <div className="text-sm text-muted-foreground">Filtered Results</div>
            </CardContent>
          </Card>
        </div>

        {/* Announcements Grid */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">No announcements found</div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4"
              variant="outline"
            >
              Create First Announcement
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8">
            {filteredAnnouncements.map((announcement) => (
              <div key={announcement.id} className="relative group">
                <AnnouncementCard announcement={announcement} />
                
                {/* Delete Button Overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Announcement Modal */}
        <AdminAnnouncementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddAnnouncement}
        />
      </div>
    </div>
  );
};

export default AdminAnnouncements;