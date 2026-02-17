import { useParams } from '@tanstack/react-router';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import YouTubeEmbed from '../../components/media/YouTubeEmbed';
import { petsCatalog, type PetInfo } from '../../content/pets/petsCatalog';
import { CheckCircle } from 'lucide-react';

export default function PetDetailPage() {
  const { category, pet: petId } = useParams({ from: '/pets/$category/$pet' });
  const categoryData = petsCatalog[category];

  let petData: PetInfo | null = null;
  if (categoryData?.subcategories) {
    for (const sub of categoryData.subcategories) {
      const found = sub.pets.find(p => p.id === petId);
      if (found) {
        petData = found;
        break;
      }
    }
  }

  if (!petData) {
    return (
      <div className="container-custom section-spacing">
        <p>Pet not found</p>
      </div>
    );
  }

  const imageUrl = petData.imageUrl || '/assets/generated/placeholder-pet.dim_1200x800.png';

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <Breadcrumbs
        items={[
          { label: 'Pets', to: '/pets' },
          { label: categoryData.name, to: `/pets/${category}` as any },
          { label: petData.name },
        ]}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{petData.name}</h1>
            <p className="text-lg text-muted-foreground">{petData.description}</p>
          </div>

          <div className="mb-8">
            <img 
              src={imageUrl}
              alt={petData.name}
              className="w-full max-w-2xl h-auto rounded-lg object-cover shadow-lg"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Care Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {petData.care.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">Helpful Videos</h2>
            <div className="space-y-4">
              {petData.videos.map((video, idx) => (
                <YouTubeEmbed key={idx} title={video.title} url={video.url} videoId={`${petId}-${idx}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Facts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <Badge>{categoryData.name}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
