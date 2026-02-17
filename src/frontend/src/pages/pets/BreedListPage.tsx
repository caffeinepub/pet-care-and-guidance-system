import { Link, useParams } from '@tanstack/react-router';
import { useGetBreedsByCategory } from '../../hooks/useContentManagement';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { breedsCatalog } from '../../content/pets/breedsCatalog';
import { normalizeSlug, mapSlugToDisplayName } from '../../utils/catalogRouting';
import type { Breed } from '../../backend';

export default function BreedListPage() {
  const { category } = useParams({ from: '/pets/$category/breeds' });
  const { data: backendBreeds = [] } = useGetBreedsByCategory(category);
  const staticBreeds = breedsCatalog[category] || [];

  // Use backend breeds if available, otherwise static
  const breeds = backendBreeds.length > 0 ? backendBreeds : staticBreeds;

  // Type guard to check if it's a backend Breed
  const isBackendBreed = (b: any): b is Breed => {
    return 'image' in b || !('id' in b);
  };

  const displayName = mapSlugToDisplayName(category);

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <Breadcrumbs
        items={[
          { label: 'Pets', to: '/pets' },
          { label: displayName, to: `/pets/${category}` as any },
          { label: 'Breeds' },
        ]}
      />

      <div className="mt-8 mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {displayName} Breeds
        </h1>
        <p className="text-lg text-muted-foreground">
          Explore detailed information about popular {category} breeds
        </p>
      </div>

      {breeds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No breeds available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {breeds.map((breed) => {
            const breedId = 'id' in breed ? breed.id : normalizeSlug(breed.name);
            const imageUrl = isBackendBreed(breed) && breed.image 
              ? breed.image.getDirectURL() 
              : ('imageUrl' in breed ? breed.imageUrl : null);
            
            return (
              <Link key={breedId} to={`/pets/${category}/breeds/${breedId}` as any}>
                <Card className="card-hover h-full cursor-pointer overflow-hidden">
                  {imageUrl ? (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={breed.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/generated/placeholder-pet.dim_1200x800.png';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img 
                        src="/assets/generated/placeholder-pet.dim_1200x800.png"
                        alt={breed.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{breed.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{breed.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Click to learn more</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
