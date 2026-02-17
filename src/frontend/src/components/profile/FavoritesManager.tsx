import { useGetAllFavoriteVideos, useRemoveFavorite, useSaveCallerUserProfile, useGetCallerUserProfile } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function FavoritesManager() {
  const { data: profile, isFetched } = useGetCallerUserProfile();
  const { data: favorites, isLoading } = useGetAllFavoriteVideos();
  const removeFavorite = useRemoveFavorite();
  const saveProfile = useSaveCallerUserProfile();

  const ensureProfileExists = async () => {
    if (!profile) {
      await saveProfile.mutateAsync({
        name: 'User',
        email: '',
        pets: [],
        favorites: [],
      });
    }
  };

  const handleRemove = async (videoId: bigint) => {
    try {
      await ensureProfileExists();
      await removeFavorite.mutateAsync(videoId);
      toast.success('Removed from favorites');
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to remove favorite';
      toast.error(errorMessage);
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const isNewProfile = isFetched && profile === null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Favorites</CardTitle>
        <CardDescription>Your saved breeds and videos</CardDescription>
      </CardHeader>
      <CardContent>
        {isNewProfile && (
          <Alert className="mb-4">
            <AlertDescription>
              Please save your profile first before managing favorites.
            </AlertDescription>
          </Alert>
        )}
        {!favorites || favorites.length === 0 ? (
          <Alert>
            <AlertDescription>
              You haven't saved any favorites yet. Browse pets and health topics to save your favorites.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {favorites.map((favorite) => (
              <div key={Number(favorite.videoId)} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex-1">
                  <p className="font-medium">{favorite.name}</p>
                  <p className="text-sm text-muted-foreground">Video ID: {favorite.videoId.toString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemove(favorite.videoId)}
                    disabled={removeFavorite.isPending || saveProfile.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
