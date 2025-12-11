import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Heart, Share2 } from 'lucide-react';

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

interface AnnouncementModalProps {
  announcement: Announcement | null;
  isOpen: boolean;
  onClose: () => void;
}

const AnnouncementModal = ({ announcement, isOpen, onClose }: AnnouncementModalProps) => {
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setNewComment('');
    }
  };

  if (!announcement) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {announcement.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          {announcement.media ? (
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={announcement.media}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">No Image Available</span>
            </div>
          )}

          {/* Category */}
          <Badge variant="secondary">
            {typeof announcement.category === 'string' 
              ? announcement.category 
              : announcement.category?.name || 'Unknown'}
          </Badge>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {announcement.description}
            </p>
          </div>

          {/* Actions */}
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
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <MessageCircle className="h-4 w-4 mr-1" />
                {announcement.comments.length}
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground">Comments</h3>
            
            {/* Existing Comments */}
            <div className="space-y-3">
              {announcement.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
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

            {/* Add Comment */}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementModal;
