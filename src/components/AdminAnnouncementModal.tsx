import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';

interface AdminAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (announcement: any) => void;
}

const AdminAnnouncementModal = ({ isOpen, onClose, onSubmit }: AdminAnnouncementModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    mediaType: '',
    mediaFile: null as File | null,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAnnouncement = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: 'General',
      author: 'Admin',
      timestamp: new Date().toLocaleDateString(),
      likes: 0,
      comments: [],
      media: formData.mediaFile ? URL.createObjectURL(formData.mediaFile) : '',
      avatar: '',
    };
    
    onSubmit(newAnnouncement);
    setFormData({ title: '', mediaType: '', mediaFile: null, description: '' });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, mediaFile: file });
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, mediaFile: null });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Announcement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Announcement Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter announcement title..."
              required
            />
          </div>

          {/* Media Type */}
          <div className="space-y-2">
            <Label htmlFor="mediaType">Media Type</Label>
            <Select value={formData.mediaType} onValueChange={(value) => setFormData({ ...formData, mediaType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select media type (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="pdf">PDF Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Upload */}
          {formData.mediaType && (
            <div className="space-y-2">
              <Label htmlFor="media">Upload {formData.mediaType}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {!formData.mediaFile ? (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="media-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Click to upload {formData.mediaType}
                        </span>
                        <input
                          id="media-upload"
                          type="file"
                          className="hidden"
                          accept={
                            formData.mediaType === 'image' ? 'image/*' :
                            formData.mediaType === 'video' ? 'video/*' :
                            formData.mediaType === 'pdf' ? '.pdf' : '*'
                          }
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{formData.mediaFile.name}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter announcement description..."
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
              Post Announcement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAnnouncementModal;