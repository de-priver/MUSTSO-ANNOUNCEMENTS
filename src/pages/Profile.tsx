import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Save, X, Calendar, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import NavbarWithProfile from '@/components/NavbarWithProfile';
import { User, UserActivity, UserNotification } from '@/data/users';
import { usersService } from '@/services/usersService';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch current user profile from backend
      const userResponse = await usersService.fetchCurrentUser();
      
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data);
        setEditedUser(userResponse.data);
        
        // Load user activities and notifications from backend
        const activitiesResponse = await usersService.getActivities();
        const notificationsResponse = await usersService.getNotifications();
        
        if (activitiesResponse.success && activitiesResponse.data) {
          setActivities(activitiesResponse.data);
        }
        if (notificationsResponse.success && notificationsResponse.data) {
          setNotifications(notificationsResponse.data);
        }
      } else {
        toast({
          title: "Error",
          description: userResponse.message || "Failed to load profile data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleSave = async () => {
    if (!editedUser) return;

    try {
      // Transform camelCase to snake_case for backend
      const backendData = {
        ...editedUser,
        first_name: editedUser.firstName || editedUser.first_name,
        last_name: editedUser.lastName || editedUser.last_name,
      };
      
      const response = await usersService.updateProfile(backendData);
      if (response.success && response.data) {
        setUser(response.data);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof User, value: string) => {
    if (editedUser) {
      const updates: Partial<User> = { [field]: value };
      
      // Also update the corresponding snake_case field
      if (field === 'firstName') {
        updates.first_name = value;
      } else if (field === 'lastName') {
        updates.last_name = value;
      }
      
      setEditedUser({ ...editedUser, ...updates });
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <NavbarWithProfile />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Please log in to view your profile.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const firstName = user.firstName || user.first_name || '';
  const lastName = user.lastName || user.last_name || '';
  const userInitials = firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : 'U';

  // Format join date safely
  const joinDate = user.joinDate || user.join_date;
  const formattedJoinDate = joinDate ? new Date(joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <NavbarWithProfile />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user.avatar} alt={`${firstName} ${lastName}`} />
                  <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-foreground">
                    {firstName} {lastName}
                  </h1>
                  <p className="text-muted-foreground mb-2">{user.position}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {user.department}
                    </Badge>
                    {user.role === 'admin' && (
                      <Badge variant="outline" className="border-primary text-primary">
                        Administrator
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} size="sm" className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="firstName"
                          value={editedUser?.firstName || editedUser?.first_name || ''}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">{firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="lastName"
                          value={editedUser?.lastName || editedUser?.last_name || ''}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">{lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedUser?.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editedUser?.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">{user.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editedUser?.location || ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{user.location}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editedUser?.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Joined {formattedJoinDate}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && (
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleDateString()}
                        </p>
                        {!notification.read && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                        <Separator className="mt-2" />
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-sm text-muted-foreground">No notifications</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
