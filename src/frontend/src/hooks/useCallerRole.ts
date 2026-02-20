import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export function useCallerRole() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) {
        console.log('[useCallerRole] No actor available');
        return false;
      }
      console.log('[useCallerRole] Checking admin status...');
      const result = await actor.isCallerAdmin();
      console.log('[useCallerRole] Admin status:', result);
      return result;
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Log the current state for debugging
  console.log('[useCallerRole] State:', {
    isAuthenticated,
    actorFetching,
    hasActor: !!actor,
    queryEnabled: !!actor && !actorFetching && isAuthenticated,
    isLoading: query.isLoading,
    isFetched: query.isFetched,
    data: query.data,
  });

  return {
    isAdmin: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
}
