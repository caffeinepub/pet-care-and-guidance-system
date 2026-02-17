import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetAllFavoriteVideos, useAddFavorite, useRemoveFavorite } from '../../hooks/useQueries';
import { Button } from '../ui/button';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

interface FavoriteButtonProps {
  itemId: string;
  itemName: string;
  type: 'breed' | 'video';
}

export default function FavoriteButton({ itemId, itemName, type }: FavoriteButtonProps) {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: favorites } = useGetAllFavoriteVideos();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const videoId = BigInt(itemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const isFavorited = favorites?.some(f => f.videoId === videoId) || false;

  const handleToggle = async () => {
    if (!identity) {
      toast.error('Please sign in to save favorites');
      navigate({ to: '/login' });
      return;
    }

    try {
      if (isFavorited) {
        await removeFavorite.mutateAsync(videoId);
        toast.success('Removed from favorites');
      } else {
        await addFavorite.mutateAsync({ videoId, name: itemName });
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
      console.error(error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={addFavorite.isPending || removeFavorite.isPending}
      className="gap-2"
    >
      <Star className={`h-4 w-4 ${isFavorited ? 'fill-primary text-primary' : ''}`} />
      {isFavorited ? 'Saved' : 'Save'}
    </Button>
  );
}
