import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PetCategory, Breed } from '../backend';

export function useGetAllPetCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PetCategory[]>({
    queryKey: ['petCategories'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAllPetCategories();
      } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    staleTime: 30000,
  });
}

export function useGetAllBreeds() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Breed[]>({
    queryKey: ['breeds'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAllBreeds();
      } catch (error: any) {
        console.error('Failed to fetch breeds:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    staleTime: 30000,
  });
}

export function useGetBreedsByCategory(category: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Breed[]>({
    queryKey: ['breeds', category],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getBreedsByCategory(category);
      } catch (error: any) {
        console.error('Failed to fetch breeds by category:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!category,
    retry: 2,
    staleTime: 30000,
  });
}

export function useAddPetCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: PetCategory) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addPetCategory(category);
      } catch (error: any) {
        console.error('Failed to add category:', error);
        throw new Error(error.message || 'Failed to add category. You may not have permission.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petCategories'] });
    },
  });
}

export function useUpdatePetCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, updatedCategory }: { name: string; updatedCategory: PetCategory }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updatePetCategory(name, updatedCategory);
      } catch (error: any) {
        console.error('Failed to update category:', error);
        throw new Error(error.message || 'Failed to update category. You may not have permission.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petCategories'] });
    },
  });
}

export function useRemovePetCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.removePetCategory(name);
      } catch (error: any) {
        console.error('Failed to remove category:', error);
        throw new Error(error.message || 'Failed to remove category. You may not have permission.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petCategories'] });
    },
  });
}

export function useAddBreed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (breed: Breed) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addBreed(breed);
      } catch (error: any) {
        console.error('Failed to add breed:', error);
        throw new Error(error.message || 'Failed to add breed. You may not have permission.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeds'] });
    },
  });
}

export function useUpdateBreed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, updatedBreed }: { name: string; updatedBreed: Breed }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateBreed(name, updatedBreed);
      } catch (error: any) {
        console.error('Failed to update breed:', error);
        throw new Error(error.message || 'Failed to update breed. You may not have permission.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeds'] });
    },
  });
}

export function useRemoveBreed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.removeBreed(name);
      } catch (error: any) {
        console.error('Failed to remove breed:', error);
        throw new Error(error.message || 'Failed to remove breed. You may not have permission.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeds'] });
    },
  });
}
