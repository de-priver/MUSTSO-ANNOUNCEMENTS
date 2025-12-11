import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Mail, Phone, MapPin, Calendar, Users, Award } from 'lucide-react';

interface Leader {
  id: string;
  name: string;
  position: string;
  department: string;
  description: string;
  image?: string;
  email?: string;
  phone?: string;
  location?: string;
  joinDate?: string;
  teamSize?: number;
  achievements?: string[];
}

interface LeaderCardProps {
  leader: Leader;
}

const LeaderCard = ({ leader }: LeaderCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className="group cursor-pointer shadow-soft hover:shadow-large transition-bounce gradient-card border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-4 ring-primary/10 group-hover:ring-primary/20 transition-smooth">
                <AvatarImage src={leader.image} alt={leader.name} className="object-cover" />
                <AvatarFallback className="text-lg font-semibold gradient-primary text-primary-foreground">
                  {leader.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-smooth">
                {leader.name}
              </h3>
              <p className="text-primary font-medium">{leader.position}</p>
              <Badge variant="secondary" className="text-xs">
                {leader.department}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {leader.description}
            </p>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient" size="sm" className="w-full">
                  View Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Leader Profile</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                      <AvatarImage src={leader.image} alt={leader.name} className="object-cover" />
                      <AvatarFallback className="text-2xl font-bold gradient-primary text-primary-foreground">
                        {leader.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">{leader.name}</h2>
                        <p className="text-xl text-primary font-semibold">{leader.position}</p>
                        <Badge variant="outline" className="mt-2">
                          {leader.department}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        Contact Information
                      </h3>
                      <div className="space-y-3">
                        {leader.email && (
                          <div className="flex items-center space-x-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{leader.email}</span>
                          </div>
                        )}
                        {leader.phone && (
                          <div className="flex items-center space-x-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{leader.phone}</span>
                          </div>
                        )}
                        {leader.location && (
                          <div className="flex items-center space-x-3 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{leader.location}</span>
                          </div>
                        )}
                        {leader.joinDate && (
                          <div className="flex items-center space-x-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Joined {leader.joinDate}</span>
                          </div>
                        )}
                        {leader.teamSize && (
                          <div className="flex items-center space-x-3 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Team Size: {leader.teamSize}</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">About</h3>
                    <p className="text-muted-foreground leading-relaxed">{leader.description}</p>
                  </div>

                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LeaderCard;