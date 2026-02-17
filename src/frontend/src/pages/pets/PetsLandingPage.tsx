import { Link } from '@tanstack/react-router';
import { useGetAllPetCategories } from '../../hooks/useContentManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Cat, Dog, Bird, Rabbit } from 'lucide-react';
import { mapCategoryNameToSlug } from '../../utils/catalogRouting';
import type { ExternalBlob } from '../../backend';

export default function PetsLandingPage() {
  const { data: backendCategories = [], isLoading } = useGetAllPetCategories();

  // Always show the four core categories
  const staticCategories = [
    {
      id: 'cat',
      name: 'Cats',
      description: 'Explore cat breeds, care guides, and health information',
      icon: Cat,
      color: 'text-orange-500',
    },
    {
      id: 'dog',
      name: 'Dogs',
      description: 'Discover dog breeds, training tips, and care essentials',
      icon: Dog,
      color: 'text-blue-500',
    },
    {
      id: 'bird',
      name: 'Birds',
      description: 'Learn about bird species, habitat setup, and nutrition',
      icon: Bird,
      color: 'text-green-500',
    },
    {
      id: 'other',
      name: 'Other Pets',
      description: 'Small mammals, reptiles, aquatic pets, and more',
      icon: Rabbit,
      color: 'text-purple-500',
    },
  ];

  const iconMap: Record<string, any> = {
    'Cats': Cat,
    'Dogs': Dog,
    'Birds': Bird,
    'Other Pets': Rabbit,
  };

  const colorMap: Record<string, string> = {
    'Cats': 'text-orange-500',
    'Dogs': 'text-blue-500',
    'Birds': 'text-green-500',
    'Other Pets': 'text-purple-500',
  };

  // Merge backend categories with static ones, preferring backend data when available
  const categories = backendCategories.length > 0
    ? staticCategories.map(staticCat => {
        const backendCat = backendCategories.find(bc => 
          mapCategoryNameToSlug(bc.name) === staticCat.id
        );
        if (backendCat) {
          return {
            id: staticCat.id,
            name: backendCat.name,
            description: backendCat.description,
            icon: staticCat.icon,
            color: staticCat.color,
            image: backendCat.image as ExternalBlob | undefined,
          };
        }
        return {
          ...staticCat,
          image: undefined as ExternalBlob | undefined,
        };
      })
    : staticCategories.map(cat => ({ ...cat, image: undefined as ExternalBlob | undefined }));

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Pet Categories</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our comprehensive collection of pet information, breed guides, and care instructions
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} to={`/pets/${category.id}` as any}>
              <Card className="card-hover h-full cursor-pointer overflow-hidden">
                {category.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={category.image.getDirectURL()}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <category.icon className={`h-12 w-12 ${category.color} mb-2`} />
                  <CardTitle>{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
