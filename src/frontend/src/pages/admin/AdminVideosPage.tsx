import { useState } from 'react';
import { useGetAllBreeds, useGetAllPetCategories } from '../../hooks/useContentManagement';
import { useAddAdminVideo, useUpdateAdminVideo, useRemoveAdminVideo } from '../../hooks/useAdminVideos';
import AdminShell from '../../components/admin/AdminShell';
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
import { petTypeToString, stringToPetType } from '../../utils/petTypeHelpers';

export default function AdminVideosPage() {
  const { identity } = useInternetIdentity();
  const { data: breeds = [], isLoading: breedsLoading } = useGetAllBreeds();
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllPetCategories();
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

  const isLoading = breedsLoading || categoriesLoading;

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
      categoryValue = petTypeToString(video.category.petType);
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
      // For pet type categories, convert string to PetType
      videoCategory = { __kind__: 'petType', petType: stringToPetType(formData.categoryValue) };
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

  if (isLoading) {
    return (
      <AdminShell
        title="Manage Video Links"
        description="Add YouTube video links for breeds, categories, and health topics"
        breadcrumbs={[{ label: 'Videos' }]}
      >
        <div className="text-center py-12">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-admin-accent border-t-transparent mx-auto"></div>
          <p className="text-admin-muted">Loading...</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Manage Video Links"
      description="Add YouTube video links for breeds, categories, and health topics"
      breadcrumbs={[{ label: 'Videos' }]}
    >
      <div className="flex justify-end mb-6">
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-admin-accent hover:bg-admin-accent/90 text-white" onClick={handleAddNewClick}>
              <Plus className="h-4 w-4" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  <SelectContent className="z-[100]">
                    <SelectItem value="breed">Breed</SelectItem>
                    <SelectItem value="category">Pet Type (Cat/Dog/Bird)</SelectItem>
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
                    <SelectContent className="z-[100]">
                      {breeds.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">No breeds available</div>
                      ) : (
                        breeds.map((breed) => (
                          <SelectItem key={breed.name} value={breed.name}>
                            {breed.name} ({breed.category})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.categoryType === 'category' && (
                <div>
                  <Label>Select Pet Type *</Label>
                  <Select value={formData.categoryValue} onValueChange={(value) => setFormData({ ...formData, categoryValue: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pet type" />
                    </SelectTrigger>
                    <SelectContent className="z-[100]">
                      <SelectItem value="cat">Cats</SelectItem>
                      <SelectItem value="dog">Dogs</SelectItem>
                      <SelectItem value="bird">Birds</SelectItem>
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
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="breed">By Breed</TabsTrigger>
          <TabsTrigger value="category">By Pet Type</TabsTrigger>
          <TabsTrigger value="health">By Health Topic</TabsTrigger>
        </TabsList>

        <TabsContent value="breed">
          <AdminVideoLinksManager
            type="breed"
            breeds={breeds}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="category">
          <AdminVideoLinksManager
            type="category"
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="health">
          <AdminVideoLinksManager
            type="health"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
}
