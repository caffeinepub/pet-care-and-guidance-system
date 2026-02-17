import { useParams } from '@tanstack/react-router';
import { useGetAllBreeds } from '../../hooks/useContentManagement';
import { useGetVideosByCategory } from '../../hooks/useAdminVideos';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import YouTubeEmbed from '../../components/media/YouTubeEmbed';
import FavoriteButton from '../../components/favorites/FavoriteButton';
import { breedsCatalog } from '../../content/pets/breedsCatalog';
import { slugMatchesBreed, mapSlugToDisplayName } from '../../utils/catalogRouting';
import type { Breed } from '../../backend';

export default function BreedDetailPage() {
  const { category, breed: breedId } = useParams({ from: '/pets/$category/breeds/$breed' });
  const { data: backendBreeds = [] } = useGetAllBreeds();
  const staticBreeds = breedsCatalog[category] || [];

  // Try to find breed using slug matching
  const backendBreed = backendBreeds.find(b => slugMatchesBreed(breedId, b.name));
  const staticBreed = staticBreeds.find(b => b.id === breedId);
  const breed = backendBreed || staticBreed;

  const { data: adminVideos = [] } = useGetVideosByCategory({ __kind__: 'breed', breed: breed?.name || '' });

  if (!breed) {
    return (
      <div className="container-custom section-spacing">
        <p>Breed not found</p>
      </div>
    );
  }

  // Type guard to check if it's a backend Breed
  const isBackendBreed = (b: any): b is Breed => {
    return 'image' in b || !('id' in b);
  };

  const imageUrl = isBackendBreed(breed) && breed.image 
    ? breed.image.getDirectURL() 
    : ('imageUrl' in breed ? breed.imageUrl : null);

  const videos = adminVideos.length > 0 
    ? adminVideos.map(v => ({ title: v.title, url: v.url }))
    : breed.videos;

  const displayCategoryName = mapSlugToDisplayName(category);

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <Breadcrumbs
        items={[
          { label: 'Pets', to: '/pets' },
          { label: displayCategoryName, to: `/pets/${category}` },
          { label: 'Breeds', to: `/pets/${category}/breeds` },
          { label: breed.name },
        ]}
      />

      <div className="mt-8 flex items-start justify-between mb-6">
        <h1 className="text-4xl font-bold">{breed.name}</h1>
        <FavoriteButton itemId={breedId} itemName={breed.name} type="breed" />
      </div>

      {imageUrl ? (
        <div className="mb-8">
          <img 
            src={imageUrl} 
            alt={breed.name}
            className="w-full max-w-2xl h-auto rounded-lg object-cover shadow-lg"
            onError={(e) => {
              e.currentTarget.src = '/assets/generated/placeholder-pet.dim_1200x800.png';
            }}
          />
        </div>
      ) : (
        <div className="mb-8">
          <img 
            src="/assets/generated/placeholder-pet.dim_1200x800.png"
            alt={breed.name}
            className="w-full max-w-2xl h-auto rounded-lg object-cover shadow-lg"
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{breed.description}</p>
            </CardContent>
          </Card>

          {'temperament' in breed && (
            <Card>
              <CardHeader>
                <CardTitle>Temperament</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{breed.temperament}</p>
              </CardContent>
            </Card>
          )}

          {'diet' in breed && (
            <Card>
              <CardHeader>
                <CardTitle>Diet & Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{breed.diet}</p>
              </CardContent>
            </Card>
          )}

          {'careTips' in breed && (
            <Card>
              <CardHeader>
                <CardTitle>Care Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {breed.careTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {'healthIssues' in breed && (
            <Card>
              <CardHeader>
                <CardTitle>Common Health Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {breed.healthIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="text-2xl font-bold mb-4">Recommended Videos</h2>
            <div className="space-y-4">
              {videos.map((video, idx) => (
                <YouTubeEmbed key={idx} title={video.title} url={video.url} videoId={`${breedId}-${idx}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
