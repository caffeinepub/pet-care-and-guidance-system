import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Pet, PetId, VideoId, VaccinationFrequency, Timestamp, Favorite, VideoLink, VideoCategory } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: (_, profile) => {
      // Immediately update both caches with the saved profile
      queryClient.setQueryData(['currentUserProfile'], profile);
      queryClient.setQueryData(['dashboardInfo'], profile);
      // Then invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardInfo'] });
    },
  });
}

export function useGetDashboardInfo() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile>({
    queryKey: ['dashboardInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDashboardInfo();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useAddPet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pet: Pet) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPet(pet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardInfo'] });
    },
  });
}

export function useUpdatePet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, updatedPet }: { petId: PetId; updatedPet: Pet }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePet(petId, updatedPet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardInfo'] });
    },
  });
}

export function useRemovePet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (petId: PetId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removePet(petId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardInfo'] });
    },
  });
}

export function useAddVaccination() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      petId,
      name,
      dueDate,
      reminderFrequency,
    }: {
      petId: PetId;
      name: string;
      dueDate: Timestamp;
      reminderFrequency: VaccinationFrequency;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVaccination(petId, name, dueDate, reminderFrequency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardInfo'] });
    },
  });
}

export function useMarkVaccinationCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ petId, vaccinationName }: { petId: PetId; vaccinationName: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markVaccinationCompleted(petId, vaccinationName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardInfo'] });
    },
  });
}

export function useGetAllFavoriteVideos() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Favorite[]>({
    queryKey: ['favoriteVideos'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllFavoriteVideos();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, name }: { videoId: VideoId; name: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addFavorite(videoId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteVideos'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: VideoId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeFavorite(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favoriteVideos'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin video management hooks
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetVideosByCategory() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (category: VideoCategory) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getVideosByCategory(category);
    },
  });
}

export function useAddAdminVideoLink() {
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
  });
}

export function useUpdateAdminVideoLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ videoId, updatedVideo }: { videoId: VideoId; updatedVideo: VideoLink }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAdminVideoLink(videoId, updatedVideo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
    },
  });
}

export function useRemoveAdminVideoLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: VideoId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAdminVideoLink(videoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminVideos'] });
    },
  });
}

export function useSubmitOnboardingPet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pet: Pet) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitOnboardingPet(pet);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardInfo'] });
    },
  });
}
