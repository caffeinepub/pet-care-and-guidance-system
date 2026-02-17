import { Link } from '@tanstack/react-router';
import AdminShell from '../../components/admin/AdminShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderTree, Dog, Video } from 'lucide-react';

export default function AdminLandingPage() {
  const adminSections = [
    {
      id: 'categories',
      name: 'Pet Categories',
      description: 'Add, edit, or remove pet categories and assign images',
      icon: FolderTree,
      to: '/admin/categories',
    },
    {
      id: 'breeds',
      name: 'Breeds',
      description: 'Manage breed information, images, and category assignments',
      icon: Dog,
      to: '/admin/breeds',
    },
    {
      id: 'videos',
      name: 'Video Links',
      description: 'Add and manage YouTube video links for breeds and topics',
      icon: Video,
      to: '/admin/videos',
    },
  ];

  return (
    <AdminShell
      title="Admin Dashboard"
      description="Manage all content on the Pet Care System. Add categories, breeds, images, and video links."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link key={section.id} to={section.to as any}>
            <Card className="admin-card card-hover h-full cursor-pointer">
              <CardHeader>
                <section.icon className="h-12 w-12 text-admin-accent mb-2" />
                <CardTitle>{section.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
