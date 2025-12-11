import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X } from 'lucide-react';
import { collegesService } from '@/services';
import { College } from '@/data/colleges';

interface AdminLeaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leader: any) => void;
}

const AdminLeaderModal = ({ isOpen, onClose, onSubmit }: AdminLeaderModalProps) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    imageFile: null as File | null,
    college: '',
    is_cabinet: true,
  });

  const departments = ['Executive', 'Technology', 'Human Resources', 'Marketing', 'Sales', 'Finance'];
  const cabinetPositions = [
    'President',
    'Vice President',
    'Secretary General',
    'Deputy Secretary General',
    'Treasurer',
    'Minister',
    'Deputy Minister',
    'Director',
    'Other'
  ];

  useEffect(() => {
    if (isOpen) {
      loadColleges();
    }
  }, [isOpen]);

  const loadColleges = async () => {
    try {
      const response = await collegesService.getColleges();
      if (response.success && response.data) {
        setColleges(response.data);
      }
    } catch (err) {
      console.error('Failed to load colleges:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLeader = {
      id: Date.now().toString(),
      name: formData.name,
      position: formData.position,
      department: formData.department,
      description: formData.description,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      joinDate: new Date().toLocaleDateString(),
      teamSize: 0,
      achievements: [],
      image: formData.imageFile ? URL.createObjectURL(formData.imageFile) : '',
      college: formData.college || null,
      is_cabinet: formData.is_cabinet,
    };
    
    onSubmit(newLeader);
    setFormData({
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      location: '',
      description: '',
      imageFile: null,
      college: '',
      is_cabinet: true,
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, imageFile: null });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Leader</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Leader Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter leader's full name..."
              required
            />
          </div>

          {/* Position */}
          <div className="space-y-2">
            <Label htmlFor="position">Position/Title *</Label>
            <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })} required>
              <SelectTrigger>
                <SelectValue placeholder="Select position..." />
              </SelectTrigger>
              <SelectContent>
                {cabinetPositions.map((pos) => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* College */}
          <div className="space-y-2">
            <Label htmlFor="college">College (Optional)</Label>
            <Select value={formData.college} onValueChange={(value) => setFormData({ ...formData, college: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select college..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {colleges.map((college) => (
                  <SelectItem key={college.id} value={college.id}>{college.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Is Cabinet Member */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_cabinet"
              checked={formData.is_cabinet}
              onCheckedChange={(checked) => setFormData({ ...formData, is_cabinet: checked as boolean })}
            />
            <Label htmlFor="is_cabinet" className="cursor-pointer">
              This leader is part of the main cabinet
            </Label>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="leader@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State"
            />
          </div>

          {/* Profile Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {!formData.imageFile ? (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click to upload profile image
                      </span>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{formData.imageFile.name}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter leader's background, experience, and achievements..."
              className="min-h-[120px]"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Leader
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLeaderModal;