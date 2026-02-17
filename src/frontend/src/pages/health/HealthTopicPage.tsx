import { useParams } from '@tanstack/react-router';
import { useGetVideosByCategory } from '../../hooks/useAdminVideos';
import Breadcrumbs from '../../components/navigation/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import YouTubeEmbed from '../../components/media/YouTubeEmbed';
import { healthCatalog, type HealthTopic } from '../../content/health/healthCatalog';
import { AlertCircle } from 'lucide-react';

export default function HealthTopicPage() {
  const { category, topic: topicId } = useParams({ from: '/health/$category/$topic' });
  const categoryData = healthCatalog[category];

  let topicData: HealthTopic | null = null;
  if (categoryData) {
    const found = categoryData.topics.find(t => t.id === topicId);
    if (found) {
      topicData = found;
    }
  }

  const { data: adminVideos = [] } = useGetVideosByCategory({ __kind__: 'healthTopic', healthTopic: topicId });

  if (!topicData) {
    return (
      <div className="container-custom section-spacing">
        <p>Topic not found</p>
      </div>
    );
  }

  const videos = adminVideos.length > 0
    ? adminVideos.map(v => ({ title: v.title, url: v.url }))
    : topicData.videos;

  return (
    <div className="container-custom section-spacing animate-fade-in">
      <Breadcrumbs
        items={[
          { label: 'Health & Care', to: '/health' },
          { label: categoryData.name, to: `/health/${category}` as any },
          { label: topicData.name },
        ]}
      />

      <div className="mt-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">{topicData.name}</h1>
          <p className="text-lg text-muted-foreground">{topicData.description}</p>
        </div>

        {topicData.isEmergency && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Emergency Information:</strong> If your pet is experiencing severe symptoms, contact a veterinarian immediately. 
              This information is for educational purposes only and does not replace professional veterinary care.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {topicData.symptoms.map((symptom, idx) => (
                <li key={idx}>{symptom}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Causes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {topicData.causes.map((cause, idx) => (
                <li key={idx}>{cause}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prevention</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {topicData.prevention.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Immediate Care Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              {topicData.immediateCare.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Video Guides</h2>
          <div className="space-y-4">
            {videos.map((video, idx) => (
              <YouTubeEmbed key={idx} title={video.title} url={video.url} videoId={`${topicData.id}-${idx}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
