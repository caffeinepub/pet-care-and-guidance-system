import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderTree, Dog, Video, Shield } from 'lucide-react';

export default function AdminLandingPage() {
  const adminSections = [
    {
      id: 'categories',
      name: 'Pet Categories',
      description: 'Add, edit, or remove pet categories and assign images',
      icon: FolderTree,
      to: '/admin/categories',
      color: 'text-blue-500',
    },
    {
      id: 'breeds',
      name: 'Breeds',
      description: 'Manage breed information, images, and category assignments',
      icon: Dog,
      to: '/admin/breeds',
      color: 'text-green-500',
    },
    {
      id: 'videos',
      name: 'Video Links',
      description: 'Add and manage YouTube video links for breeds and topics',
      icon: Video,
      to: '/admin/videos',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Manage all content on the Pet Care System. Add categories, breeds, images, and video links.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminSections.map((section) => (
          <Link key={section.id} to={section.to as any}>
            <Card className="card-hover h-full cursor-pointer">
              <CardHeader>
                <section.icon className={`h-12 w-12 ${section.color} mb-2`} />
                <CardTitle>{section.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{section.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
