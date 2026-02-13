import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Request, RequestType, RequestStatus, UserProfile } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

export function useCreateRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      category: string;
      requestType: RequestType;
      customerName: string;
      phoneNumber: string;
      address: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createRequest(
        params.id,
        params.category,
        params.requestType,
        params.customerName,
        params.phoneNumber,
        params.address,
        params.description
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useGetRequestById(requestId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Request | null>({
    queryKey: ['request', requestId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRequestById(requestId);
    },
    enabled: !!actor && !actorFetching && !!requestId,
  });
}

export function useGetRequestsByCaller() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Request[]>({
    queryKey: ['requests', 'caller'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRequestsByCaller();
    },
    enabled: !!actor && !actorFetching,
  });
}

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
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useGetAllRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Request[]>({
    queryKey: ['requests', 'all'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAdminUpdateRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      status?: RequestStatus;
      technician?: string;
      spares?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.adminUpdateRequest(
        params.id,
        params.status ?? null,
        params.technician ?? null,
        params.spares ?? null
      );
    },
    onSuccess: (_data, variables) => {
      // Invalidate all request-related queries
      queryClient.invalidateQueries({ queryKey: ['requests', 'all'] });
      queryClient.invalidateQueries({ queryKey: ['requests', 'caller'] });
      queryClient.invalidateQueries({ queryKey: ['request', variables.id] });
    },
  });
}
