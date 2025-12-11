import { useState, useEffect } from 'react';
import NavbarWithProfile from '@/components/NavbarWithProfile';
import SimpleAnnouncementCard from '@/components/SimpleAnnouncementCard';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { announcementsService } from '@/services';
import { Announcement } from '@/data/announcements';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load announcements on component mount
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await announcementsService.getAnnouncements();
      
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavbarWithProfile />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <NavbarWithProfile />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadAnnouncements} variant="outline">
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Announcements
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay updated with the latest news and important updates from our organization.
          </p>
        </div>


        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {announcements.length} announcement{announcements.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <SimpleAnnouncementCard 
              key={announcement.id} 
              announcement={announcement}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={loadAnnouncements}>
            Refresh Announcements
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Announcements;