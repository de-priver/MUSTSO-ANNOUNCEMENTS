import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, Users } from 'lucide-react';
import { College } from '@/data/colleges';
import { Leader } from '@/data/leaders';
import { useState, useEffect } from 'react';
import { leadersService } from '@/services';
import LeaderCard from './LeaderCard';

interface CollegeModalProps {
  college: College | null;
  isOpen: boolean;
  onClose: () => void;
}

const CollegeModal = ({ college, isOpen, onClose }: CollegeModalProps) => {
  const [collegeLeaders, setCollegeLeaders] = useState<Leader[]>([]);
  const [loadingLeaders, setLoadingLeaders] = useState(false);

  useEffect(() => {
    if (college && isOpen) {
      loadCollegeLeaders();
    }
  }, [college, isOpen]);

  const loadCollegeLeaders = async () => {
    if (!college) return;
    
    try {
      setLoadingLeaders(true);
      const response = await leadersService.getLeaders({ college: college.id });
      
      if (response.success && response.data) {
        setCollegeLeaders(response.data);
      }
    } catch (err) {
      console.error('Failed to load college leaders:', err);
    } finally {
      setLoadingLeaders(false);
    }
  };

  if (!college) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-6">
            {college.name}
          </DialogTitle>
        </DialogHeader>
        
        {/* College Leader Section */}
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-primary">
              <AvatarImage src={college.leader_image} alt={college.leader_name} />
              <AvatarFallback className="text-2xl">
                {college.leader_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{college.leader_name}</h3>
            <p className="text-muted-foreground">Dean</p>
          </div>
        </div>
        
        <Tabs defaultValue="departments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="leaders">
              <Users className="w-4 h-4 mr-2" />
              Leaders ({collegeLeaders.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="departments" className="space-y-4 mt-4">
            <h4 className="text-lg font-semibold mb-4">Departments</h4>
            {college.departments.map((department, index) => (
              <div key={index} className="border rounded-lg p-4 bg-card">
                <h5 className="font-medium text-lg mb-3 text-primary">{department.name}</h5>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{department.leader_name}</p>
                    <p className="text-sm text-muted-foreground">Department Head</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{department.email}</span>
                    </div>
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{department.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="leaders" className="mt-4">
            {loadingLeaders ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading leaders...</p>
                </div>
              </div>
            ) : collegeLeaders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collegeLeaders.map((leader) => (
                  <LeaderCard key={leader.id} leader={leader} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No leaders assigned to this college yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CollegeModal;
