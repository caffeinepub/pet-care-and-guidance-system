import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PetCategory, Breed } from '../backend';

export function useGetAllPetCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PetCategory[]>({
    queryKey: ['petCategories'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllPetCategories();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetAllBreeds() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Breed[]>({
    queryKey: ['breeds'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllBreeds();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetBreedsByCategory(category: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Breed[]>({
    queryKey: ['breeds', category],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBreedsByCategory(category);
    },
    enabled: !!actor && !actorFetching && !!category,
  });
}

export function useAddPetCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: PetCategory) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPetCategory(category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petCategories'] });
    },
    onError: (error: any) => {
      console.error('Failed to add category:', error);
      throw new Error(error.message || 'Failed to add category. You may not have permission.');
    },
  });
}

export function useUpdatePetCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, updatedCategory }: { name: string; updatedCategory: PetCategory }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePetCategory(name, updatedCategory);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petCategories'] });
    },
    onError: (error: any) => {
      console.error('Failed to update category:', error);
      throw new Error(error.message || 'Failed to update category. You may not have permission.');
    },
  });
}

export function useRemovePetCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removePetCategory(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petCategories'] });
    },
    onError: (error: any) => {
      console.error('Failed to remove category:', error);
      throw new Error(error.message || 'Failed to remove category. You may not have permission.');
    },
  });
}

export function useAddBreed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (breed: Breed) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addBreed(breed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeds'] });
    },
    onError: (error: any) => {
      console.error('Failed to add breed:', error);
      throw new Error(error.message || 'Failed to add breed. You may not have permission.');
    },
  });
}

export function useUpdateBreed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, updatedBreed }: { name: string; updatedBreed: Breed }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBreed(name, updatedBreed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeds'] });
    },
    onError: (error: any) => {
      console.error('Failed to update breed:', error);
      throw new Error(error.message || 'Failed to update breed. You may not have permission.');
    },
  });
}

export function useRemoveBreed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeBreed(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breeds'] });
    },
    onError: (error: any) => {
      console.error('Failed to remove breed:', error);
      throw new Error(error.message || 'Failed to remove breed. You may not have permission.');
    },
  });
}
