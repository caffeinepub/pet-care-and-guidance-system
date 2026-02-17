import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { VideoLink, VideoCategory } from '../backend';

export function useGetVideosByCategory(category: VideoCategory, enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<VideoLink[]>({
    queryKey: ['adminVideos', category],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getVideosByCategory(category);
    },
    enabled: !!actor && !actorFetching && enabled,
  });
}

export function useAddAdminVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (video: VideoLink) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAdminVideoLink(video);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
    },
    onError: (error: any) => {
      console.error('Failed to add video:', error);
      throw new Error(error.message || 'Failed to add video. You may not have permission.');
    },
  });
}

export function useUpdateAdminVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, updatedVideo }: { videoId: bigint; updatedVideo: VideoLink }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAdminVideoLink(videoId, updatedVideo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
    },
    onError: (error: any) => {
      console.error('Failed to update video:', error);
      throw new Error(error.message || 'Failed to update video. You may not have permission.');
    },
  });
}

export function useRemoveAdminVideo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAdminVideoLink(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
    },
    onError: (error: any) => {
      console.error('Failed to remove video:', error);
      throw new Error(error.message || 'Failed to remove video. You may not have permission.');
    },
  });
}
