import { useState } from 'react';
import { useGetAllPetCategories, useAddPetCategory, useUpdatePetCategory, useRemovePetCategory } from '../../hooks/useContentManagement';
import AdminShell from '../../components/admin/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import BlobImageUploader from '../../components/admin/BlobImageUploader';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { toast } from 'sonner';
import type { PetCategory } from '../../backend';
import { ExternalBlob } from '../../backend';

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useGetAllPetCategories();
  const addCategory = useAddPetCategory();
  const updateCategory = useUpdatePetCategory();
  const removeCategory = useRemovePetCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PetCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as ExternalBlob | null,
    videos: [] as Array<{ title: string; url: string }>,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: null,
      videos: [],
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: PetCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: category.image || null,
      videos: category.videos,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const categoryData: PetCategory = {
      name: formData.name,
      description: formData.description,
      image: formData.image || undefined,
      videos: formData.videos,
    };

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ name: editingCategory.name, updatedCategory: categoryData });
        toast.success('Category updated successfully');
      } else {
        await addCategory.mutateAsync(categoryData);
        toast.success('Category added successfully');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;

    try {
      await removeCategory.mutateAsync(name);
      toast.success('Category deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleOpenDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AdminShell title="Manage Pet Categories" description="Add, edit, or remove pet categories">
        <div className="text-center py-12">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-admin-accent border-t-transparent mx-auto"></div>
          <p className="text-admin-muted">Loading categories...</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Manage Pet Categories"
      description="Add, edit, or remove pet categories"
      breadcrumbs={[{ label: 'Categories' }]}
    >
      <div className="flex justify-end mb-6">
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenDialog}
              className="gap-2 bg-admin-accent hover:bg-admin-accent/90 text-white"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Dogs, Cats, Birds"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this pet category"
                  rows={4}
                  required
                />
              </div>

              <BlobImageUploader
                label="Category Image"
                currentImageUrl={formData.image?.getDirectURL()}
                onImageSelected={(blob) => setFormData({ ...formData, image: blob })}
                onImageCleared={() => setFormData({ ...formData, image: null })}
              />

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addCategory.isPending || updateCategory.isPending}>
                  {addCategory.isPending || updateCategory.isPending ? 'Saving...' : 'Save Category'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-admin-card">
          <FolderTree className="h-12 w-12 text-admin-muted mx-auto mb-4" />
          <p className="text-admin-muted">No categories yet. Click "Add Category" to create one.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.name} className="admin-card">
              <CardHeader>
                {category.image && (
                  <img
                    src={category.image.getDirectURL()}
                    alt={category.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-admin-accent" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">{category.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(category)} className="gap-2 flex-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(category.name)}
                    disabled={removeCategory.isPending}
                    className="gap-2 flex-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
