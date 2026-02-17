import { Link, useParams } from '@tanstack/react-router';
import { useGetAllPetCategories } from '../../hooks/useContentManagement';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { petsCatalog } from '../../content/pets/petsCatalog';
import { ArrowRight } from 'lucide-react';
import { slugMatchesCategory, mapSlugToDisplayName } from '../../utils/catalogRouting';

export default function PetCategoryPage() {
  const { category } = useParams({ from: '/pets/$category' });
  const { data: backendCategories = [] } = useGetAllPetCategories();
  
  // Try to find backend category using slug matching
  const backendCategory = backendCategories.find(c => slugMatchesCategory(category, c.name));
  
  // Always fall back to static catalog
  const staticCategory = petsCatalog[category];
  
  // Use backend data if available, otherwise static
  const categoryData = backendCategory || staticCategory;

  if (!categoryData) {
    return (
      <div className="container-custom section-spacing">
        <p>Category not found</p>
      </div>
    );
  }

  const displayName = backendCategory ? backendCategory.name : (staticCategory?.name || mapSlugToDisplayName(category));
  const displayDescription = backendCategory ? backendCategory.description : (staticCategory?.description || '');

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <Breadcrumbs items={[{ label: 'Pets', to: '/pets' }, { label: displayName }]} />

      <div className="mt-8 mb-12">
        {backendCategory?.image && (
          <img
            src={backendCategory.image.getDirectURL()}
            alt={displayName}
            className="w-full max-w-2xl h-64 object-cover rounded-lg mb-6"
          />
        )}
        <h1 className="text-4xl font-bold mb-4">{displayName}</h1>
        <p className="text-lg text-muted-foreground">{displayDescription}</p>
      </div>

      {staticCategory?.hasBreeds && (
        <div className="mb-8">
          <Link to={`/pets/${category}/breeds` as any}>
            <Button size="lg" className="gap-2">
              View {displayName} Breeds
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      )}

      {staticCategory?.subcategories && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Subcategories</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {staticCategory.subcategories.map((sub) => (
              <Card key={sub.id} className="card-hover">
                <CardHeader>
                  <CardTitle>{sub.name}</CardTitle>
                  <CardDescription>{sub.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {sub.pets.slice(0, 5).map((pet) => (
                      <Link key={pet.id} to={`/pets/${category}/${pet.id}` as any}>
                        <Button variant="outline" size="sm">
                          {pet.name}
                        </Button>
                      </Link>
                    ))}
                    {sub.pets.length > 5 && (
                      <span className="text-sm text-muted-foreground self-center">
                        +{sub.pets.length - 5} more
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
