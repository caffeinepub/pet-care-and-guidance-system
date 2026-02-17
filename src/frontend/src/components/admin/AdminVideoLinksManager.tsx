import { useState } from 'react';
import { useGetVideosByCategory } from '../../hooks/useAdminVideos';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Edit, Trash2, Video, ExternalLink } from 'lucide-react';
import type { VideoCategory, VideoLink, PetType } from '../../backend';

interface AdminVideoLinksManagerProps {
  type: 'breed' | 'category' | 'health';
  breeds?: Array<{ name: string; category: string }>;
  categories?: Array<{ name: string }>;
  onEdit: (video: VideoLink) => void;
  onDelete: (videoId: bigint) => void;
}

export default function AdminVideoLinksManager({
  type,
  breeds = [],
  categories = [],
  onEdit,
  onDelete,
}: AdminVideoLinksManagerProps) {
  const [selectedItem, setSelectedItem] = useState<string>('');

  // Build the video category based on type and selection
  let videoCategory: VideoCategory | null = null;
  if (selectedItem) {
    if (type === 'breed') {
      videoCategory = { __kind__: 'breed', breed: selectedItem };
    } else if (type === 'category') {
      // For category type, use PetType enum values (cat/dog)
      videoCategory = { __kind__: 'petType', petType: selectedItem as PetType };
    } else if (type === 'health') {
      videoCategory = { __kind__: 'healthTopic', healthTopic: selectedItem };
    }
  }

  const { data: videos = [], isLoading } = useGetVideosByCategory(
    videoCategory || { __kind__: 'breed', breed: '' },
    !!selectedItem && !!videoCategory
  );

  const getSelectOptions = () => {
    if (type === 'breed') {
      return breeds.map((breed) => ({
        value: breed.name,
        label: `${breed.name} (${breed.category})`,
      }));
    } else if (type === 'category') {
      // Use PetType enum values
      return [
        { value: 'cat', label: 'Cats' },
        { value: 'dog', label: 'Dogs' },
      ];
    } else {
      // Health topics - provide common ones
      return [
        { value: 'Vaccination', label: 'Vaccination' },
        { value: 'Grooming', label: 'Grooming' },
        { value: 'Nutrition', label: 'Nutrition' },
        { value: 'Emergency Care', label: 'Emergency Care' },
        { value: 'Dental Care', label: 'Dental Care' },
        { value: 'Behavior', label: 'Behavior' },
      ];
    }
  };

  const options = getSelectOptions();
  const displayedVideos = selectedItem && videoCategory ? videos : [];

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <Label>
          Select {type === 'breed' ? 'Breed' : type === 'category' ? 'Pet Type' : 'Health Topic'}
        </Label>
        <Select value={selectedItem} onValueChange={setSelectedItem}>
          <SelectTrigger>
            <SelectValue
              placeholder={`Select a ${type === 'breed' ? 'breed' : type === 'category' ? 'pet type' : 'health topic'}`}
            />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedItem && (
        <>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-admin-accent border-t-transparent mx-auto"></div>
              <p className="text-admin-muted">Loading videos...</p>
            </div>
          ) : displayedVideos.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-admin-card">
              <Video className="h-12 w-12 text-admin-muted mx-auto mb-4" />
              <p className="text-admin-muted">
                No videos found for {selectedItem}. Click "Add Video" to create one.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayedVideos.map((video) => (
                <Card key={video.id.toString()} className="admin-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-2">
                      <Video className="h-5 w-5 shrink-0 mt-0.5 text-admin-accent" />
                      <span className="line-clamp-2">{video.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {video.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                    )}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-admin-accent hover:underline flex items-center gap-1"
                    >
                      View on YouTube
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(video)} className="gap-2 flex-1">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(video.id)}
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
        </>
      )}
    </div>
  );
}
