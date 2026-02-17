import { Card, CardContent } from '../ui/card';
import { Video } from 'lucide-react';
import FavoriteButton from '../favorites/FavoriteButton';

interface YouTubeEmbedProps {
  title: string;
  url: string;
  videoId?: string;
}

export default function YouTubeEmbed({ title, url, videoId }: YouTubeEmbedProps) {
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  const ytId = getYouTubeId(url);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1">
            <Video className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <h4 className="font-medium">{title}</h4>
          </div>
          {videoId && <FavoriteButton itemId={videoId} itemName={title} type="video" />}
        </div>
        {ytId ? (
          <div className="aspect-video">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${ytId}`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg border hover:bg-accent transition-colors text-center"
          >
            <p className="text-sm text-muted-foreground">Click to watch on YouTube</p>
          </a>
        )}
      </CardContent>
    </Card>
  );
}
