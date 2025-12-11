import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ChevronDown, ChevronUp, MessageCircle, Heart, Share2, Calendar, Eye } from 'lucide-react';

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

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
    }
  };

  return (
    <Card className="w-full shadow-soft hover:shadow-medium transition-smooth gradient-card border-0">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={announcement.avatar} 
                alt={typeof announcement.author === 'string' 
                  ? announcement.author 
                  : announcement.author?.email || 'User'} 
              />
              <AvatarFallback>
                {typeof announcement.author === 'string' 
                  ? announcement.author.charAt(0) 
                  : (announcement.author?.firstName || announcement.author?.first_name || announcement.author?.email || 'U').charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-foreground">
                {typeof announcement.author === 'string' 
                  ? announcement.author 
                  : `${announcement.author?.firstName || announcement.author?.first_name || ''} ${announcement.author?.lastName || announcement.author?.last_name || ''}`.trim() || announcement.author?.email || 'Unknown'}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{announcement.timestamp}</span>
              </div>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {typeof announcement.category === 'string' 
              ? announcement.category 
              : announcement.category?.name || 'Unknown'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">{announcement.title}</h2>
          <p className={`text-muted-foreground leading-relaxed ${!isExpanded && 'line-clamp-3'}`}>
            {announcement.description}
          </p>
          {announcement.description.length > 150 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 p-0 h-auto text-primary hover:text-primary/80"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Read more
                </>
              )}
            </Button>
          )}
        </div>

        {announcement.media && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={announcement.media}
              alt="Announcement media"
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`hover:text-red-500 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {announcement.likes + (isLiked ? 1 : 0)}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="text-muted-foreground hover:text-primary"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {announcement.comments.length}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/announcements/${announcement.id}`)}
              className="text-muted-foreground hover:text-primary"
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {showComments && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="space-y-3">
              {announcement.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatar} alt={comment.author} />
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <p className="font-medium text-sm text-foreground">{comment.author}</p>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  variant="gradient"
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;