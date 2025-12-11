import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Heart, MessageSquare, Share2, Calendar, User, Send } from 'lucide-react';
import { announcementsService } from '@/services';
import { httpClient, API_ENDPOINTS } from '@/services/api';
import { Announcement, Comment } from '@/data/announcements';
import NavbarWithProfile from '@/components/NavbarWithProfile';
import { useToast } from '@/hooks/use-toast';

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const loadAnnouncement = async () => {
      if (!id) {
        setError('No announcement ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await announcementsService.getById(id);
        
        if (response.success && response.data) {
          // Load the announcement data
          setAnnouncement(response.data);
          
          // Load comments separately
          try {
            const commentsResponse = await announcementsService.getComments(id);
            if (commentsResponse.success && commentsResponse.data) {
              setAnnouncement(prev => prev ? { ...prev, comments: commentsResponse.data } : null);
            }
          } catch (commentError) {
            console.error('Error loading comments:', commentError);
            // Still show the announcement even if comments fail to load
          }
          
          // Check if user has liked this announcement
          // This would need to be implemented in the backend
        } else {
          setError(response.error || 'Failed to load announcement');
        }
      } catch (err) {
        setError('Failed to load announcement');
        console.error('Error loading announcement:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncement();
  }, [id]);

  const handleLike = async () => {
    if (!announcement) return;

    try {
      // Call backend API directly to toggle like
      const response = await httpClient.post(API_ENDPOINTS.ANNOUNCEMENTS.LIKE(announcement.id));
      
      // Update local state
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      // Refresh the announcement to get updated like count
      const updatedResponse = await announcementsService.getById(announcement.id);
      if (updatedResponse.success && updatedResponse.data) {
        setAnnouncement(updatedResponse.data);
      }
      
      toast({
        title: "Success", 
        description: `Announcement ${newLikedState ? 'liked' : 'unliked'}`,
      });
      
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async () => {
    if (!announcement || !newComment.trim()) return;

    try {
      setSubmittingComment(true);
      
      // Call backend API directly to add comment
      await httpClient.post(API_ENDPOINTS.ANNOUNCEMENTS.COMMENTS(announcement.id), {
        content: newComment
      });
      
      // Clear the input
      setNewComment('');
      
      // Refresh the announcement data and comments from backend
      const updatedAnnouncement = await announcementsService.getById(announcement.id);
      const commentsResponse = await announcementsService.getComments(announcement.id);
      
      if (updatedAnnouncement.success && updatedAnnouncement.data) {
        const comments = commentsResponse.success && commentsResponse.data ? commentsResponse.data : [];
        setAnnouncement({
          ...updatedAnnouncement.data,
          comments: comments
        });
      }
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
      
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: announcement?.title,
          text: announcement?.excerpt,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Success",
          description: "Link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <NavbarWithProfile />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <NavbarWithProfile />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {error || 'Announcement not found'}
              </p>
              <Button onClick={() => navigate('/announcements')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Announcements
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <NavbarWithProfile />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            onClick={() => navigate('/announcements')} 
            variant="outline" 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Announcements
          </Button>

          {/* Main Announcement Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={announcement.priority === 'high' ? 'destructive' : 'default'}>
                      {announcement.priority}
                    </Badge>
                    <Badge variant="outline">
                      {typeof announcement.category === 'string' 
                        ? announcement.category 
                        : announcement.category?.name || 'Unknown'}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{announcement.title}</CardTitle>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {typeof announcement.author === 'string' 
                    ? announcement.author 
                    : `${announcement.author?.firstName || announcement.author?.first_name || ''} ${announcement.author?.lastName || announcement.author?.last_name || ''}`.trim() || announcement.author?.email || 'Unknown'
                  }
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(announcement.timestamp || announcement.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Image */}
              {announcement.media && (
                <div className="mb-6">
                  <img 
                    src={announcement.media} 
                    alt={announcement.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Content */}
              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-base leading-relaxed">
                  {announcement.content}
                </p>
              </div>

              <Separator className="my-6" />

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    {announcement.likes || 0}
                  </Button>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    {(announcement.comments || []).length} Comments
                  </div>
                </div>
                
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({(announcement.comments || []).length})</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Comment */}
              <div className="mb-6">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                />
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submittingComment}
                  size="sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>

              <Separator className="mb-6" />

              {/* Comments List */}
              <div className="space-y-4">
                {(announcement.comments || []).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  announcement.comments.map((comment) => {
                    const authorName = typeof comment.author === 'string' 
                      ? comment.author 
                      : `${comment.author?.firstName || comment.author?.first_name || ''} ${comment.author?.lastName || comment.author?.last_name || ''}`.trim() || comment.author?.email || 'Unknown';
                    
                    return (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={authorName} />
                        <AvatarFallback>
                          {authorName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{authorName}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  )})
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
