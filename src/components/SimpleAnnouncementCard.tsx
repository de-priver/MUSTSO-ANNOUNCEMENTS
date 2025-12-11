import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

interface Announcement {
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
  likes: number;
  comments: Comment[];
  media?: string;
  avatar?: string;
}

interface SimpleAnnouncementCardProps {
  announcement: Announcement;
}

const SimpleAnnouncementCard = ({ announcement }: SimpleAnnouncementCardProps) => {
  const navigate = useNavigate();
  return (
    <Card 
      className="w-full shadow-soft hover:shadow-medium transition-smooth gradient-card border-0 cursor-pointer group"
      onClick={() => navigate(`/announcements/${announcement.id}`)}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
          {announcement.media ? (
            <img
              src={announcement.media}
              alt={announcement.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No Image</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth line-clamp-2">
              {announcement.title}
            </h3>
            <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
              {typeof announcement.category === 'string' 
                ? announcement.category 
                : announcement.category?.name || 'Unknown'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleAnnouncementCard;