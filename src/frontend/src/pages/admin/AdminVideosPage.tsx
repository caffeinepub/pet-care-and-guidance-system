import { useState } from 'react';
import { useGetAllBreeds, useGetAllPetCategories } from '../../hooks/useContentManagement';
import { useAddAdminVideo, useUpdateAdminVideo, useRemoveAdminVideo } from '../../hooks/useAdminVideos';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import AdminVideoLinksManager from '../../components/admin/AdminVideoLinksManager';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { VideoLink, VideoCategory } from '../../backend';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function AdminVideosPage() {
  const { identity } = useInternetIdentity();
  const { data: breeds = [] } = useGetAllBreeds();
  const { data: categories = [] } = useGetAllPetCategories();
  const addVideo = useAddAdminVideo();
  const updateVideo = useUpdateAdminVideo();
  const removeVideo = useRemoveAdminVideo();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLink | null>(null);
  const [selectedTab, setSelectedTab] = useState<'breed' | 'category' | 'health'>('breed');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    categoryType: 'breed' as 'breed' | 'category' | 'health',
    categoryValue: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      description: '',
      categoryType: selectedTab,
      categoryValue: '',
    });
    setEditingVideo(null);
  };

  const handleEdit = (video: VideoLink) => {
    setEditingVideo(video);
    
    // Determine category type and value from video
    let categoryType: 'breed' | 'category' | 'health' = 'breed';
    let categoryValue = '';
    
    if (video.category.__kind__ === 'breed') {
      categoryType = 'breed';
      categoryValue = video.category.breed;
    } else if (video.category.__kind__ === 'petType') {
      categoryType = 'category';
      categoryValue = video.category.petType;
    } else if (video.category.__kind__ === 'healthTopic') {
      categoryType = 'health';
      categoryValue = video.category.healthTopic;
    }

    setFormData({
      title: video.title,
      url: video.url,
      description: video.description,
      categoryType,
      categoryValue,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim() || !formData.categoryValue) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!identity) {
      toast.error('You must be logged in to add videos');
      return;
    }

    let videoCategory: VideoCategory;
    if (formData.categoryType === 'breed') {
      videoCategory = { __kind__: 'breed', breed: formData.categoryValue };
    } else if (formData.categoryType === 'health') {
      videoCategory = { __kind__: 'healthTopic', healthTopic: formData.categoryValue };
    } else {
      // For pet type categories (cat/dog)
      videoCategory = { __kind__: 'petType', petType: formData.categoryValue as any };
    }

    const videoData: VideoLink = {
      id: editingVideo?.id || BigInt(Date.now()),
      title: formData.title,
      url: formData.url,
      description: formData.description,
      category: videoCategory,
      uploadedBy: identity.getPrincipal(),
    };

    try {
      if (editingVideo) {
        await updateVideo.mutateAsync({ videoId: editingVideo.id, updatedVideo: videoData });
        toast.success('Video updated successfully');
      } else {
        await addVideo.mutateAsync(videoData);
        toast.success('Video added successfully');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save video');
    }
  };

  const handleDelete = async (videoId: bigint) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await removeVideo.mutateAsync(videoId);
      toast.success('Video deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete video');
    }
  };

  const handleAddNewClick = () => {
    resetForm();
    setFormData({ ...formData, categoryType: selectedTab });
    setDialogOpen(true);
  };

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage Video Links</h1>
          <p className="text-muted-foreground">Add YouTube video links for breeds, categories, and health topics</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={handleAddNewClick}>
              <Plus className="h-4 w-4" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Video Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., How to Groom Your Golden Retriever"
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">YouTube URL *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the video"
                  rows={3}
                />
              </div>

              <div>
                <Label>Category Type *</Label>
                <Select value={formData.categoryType} onValueChange={(value: any) => setFormData({ ...formData, categoryType: value, categoryValue: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breed">Breed</SelectItem>
                    <SelectItem value="category">Pet Category</SelectItem>
                    <SelectItem value="health">Health Topic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.categoryType === 'breed' && (
                <div>
                  <Label>Select Breed *</Label>
                  <Select value={formData.categoryValue} onValueChange={(value) => setFormData({ ...formData, categoryValue: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a breed" />
                    </SelectTrigger>
                    <SelectContent>
                      {breeds.map((breed) => (
                        <SelectItem key={breed.name} value={breed.name}>
                          {breed.name} ({breed.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.categoryType === 'category' && (
                <div>
                  <Label>Select Category *</Label>
                  <Select value={formData.categoryValue} onValueChange={(value) => setFormData({ ...formData, categoryValue: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.categoryType === 'health' && (
                <div>
                  <Label htmlFor="healthTopic">Health Topic *</Label>
                  <Input
                    id="healthTopic"
                    value={formData.categoryValue}
                    onChange={(e) => setFormData({ ...formData, categoryValue: e.target.value })}
                    placeholder="e.g., Vaccination, Grooming, Nutrition"
                    required
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addVideo.isPending || updateVideo.isPending}>
                  {addVideo.isPending || updateVideo.isPending ? 'Saving...' : 'Save Video'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)}>
        <TabsList>
          <TabsTrigger value="breed">Breed Videos</TabsTrigger>
          <TabsTrigger value="category">Category Videos</TabsTrigger>
          <TabsTrigger value="health">Health Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="breed" className="mt-6">
          <AdminVideoLinksManager
            type="breed"
            breeds={breeds}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="category" className="mt-6">
          <AdminVideoLinksManager
            type="category"
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="health" className="mt-6">
          <AdminVideoLinksManager
            type="health"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
