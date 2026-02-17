import { useState } from 'react';
import { useGetAllBreeds, useGetAllPetCategories, useAddBreed, useUpdateBreed, useRemoveBreed } from '../../hooks/useContentManagement';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import BlobImageUploader from '../../components/admin/BlobImageUploader';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Breed } from '../../backend';
import { ExternalBlob } from '../../backend';

export default function AdminBreedsPage() {
  const { data: breeds = [], isLoading } = useGetAllBreeds();
  const { data: categories = [] } = useGetAllPetCategories();
  const addBreed = useAddBreed();
  const updateBreed = useUpdateBreed();
  const removeBreed = useRemoveBreed();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBreed, setEditingBreed] = useState<Breed | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: null as ExternalBlob | null,
    videos: [] as Array<{ title: string; url: string }>,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      image: null,
      videos: [],
    });
    setEditingBreed(null);
  };

  const handleEdit = (breed: Breed) => {
    setEditingBreed(breed);
    setFormData({
      name: breed.name,
      category: breed.category,
      description: breed.description,
      image: breed.image || null,
      videos: breed.videos,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const breedData: Breed = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      image: formData.image || undefined,
      videos: formData.videos,
    };

    try {
      if (editingBreed) {
        await updateBreed.mutateAsync({ name: editingBreed.name, updatedBreed: breedData });
        toast.success('Breed updated successfully');
      } else {
        await addBreed.mutateAsync(breedData);
        toast.success('Breed added successfully');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save breed');
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete the breed "${name}"?`)) return;

    try {
      await removeBreed.mutateAsync(name);
      toast.success('Breed deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete breed');
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom section-spacing">
        <p>Loading breeds...</p>
      </div>
    );
  }

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage Breeds</h1>
          <p className="text-muted-foreground">Add, edit, or remove breed information</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Breed
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBreed ? 'Edit Breed' : 'Add New Breed'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Breed Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Golden Retriever, Persian Cat"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
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

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the breed"
                  rows={4}
                  required
                />
              </div>

              <BlobImageUploader
                label="Breed Image"
                onImageSelected={(blob) => setFormData({ ...formData, image: blob })}
                currentImageUrl={formData.image?.getDirectURL()}
              />

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addBreed.isPending || updateBreed.isPending}>
                  {addBreed.isPending || updateBreed.isPending ? 'Saving...' : 'Save Breed'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {breeds.map((breed) => (
          <Card key={breed.name}>
            <CardHeader>
              {breed.image && (
                <img
                  src={breed.image.getDirectURL()}
                  alt={breed.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <CardTitle>{breed.name}</CardTitle>
              <p className="text-sm text-muted-foreground">Category: {breed.category}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{breed.description}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(breed)} className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(breed.name)} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {breeds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No breeds yet. Click "Add Breed" to create one.</p>
        </div>
      )}
    </div>
  );
}
