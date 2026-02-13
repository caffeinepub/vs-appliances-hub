import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Request, RequestType, RequestStatus, UserProfile, Brand, Technician, Feedback, InventoryItem, InventoryLog } from '../backend';
import { useInternetIdentity } from './useInternetIdentity';

export function useCreateRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      brand: Brand;
      category: string;
      requestType: RequestType;
      customerName: string;
      phoneNumber: string;
      address: string;
      location: string;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createRequest(
        params.id,
        params.brand,
        params.category,
        params.requestType,
        params.customerName,
        params.phoneNumber,
        params.address,
        params.location,
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

export function useGetFilteredRequests(params: {
  search?: string;
  brandFilter?: Brand;
  locationFilter?: string;
  statusFilter?: RequestStatus;
}) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Request[]>({
    queryKey: ['requests', 'filtered', params],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFilteredRequests(
        params.search || null,
        params.brandFilter || null,
        params.locationFilter || null,
        params.statusFilter || null
      );
    },
    enabled: !!actor && !actorFetching,
  });
}

// Track Status (public queries)
export function useTrackStatusById(ticketId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Request | null>({
    queryKey: ['trackStatus', ticketId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.trackStatusById(ticketId);
    },
    enabled: !!actor && !actorFetching && !!ticketId,
  });
}

export function useTrackStatusByIdAndPhone() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (params: { ticketId: string; phone: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.trackStatusByIdAndPhone(params.ticketId, params.phone);
    },
  });
}

// Technician Management
export function useGetAllTechnicians() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Technician[]>({
    queryKey: ['technicians'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllTechnicians();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddTechnician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; name: string; phone?: string; notes?: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addTechnician(params.id, params.name, params.phone || null, params.notes || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
    },
  });
}

export function useAssignTechnician() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { requestId: string; technicianId: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.assignTechnician(params.requestId, params.technicianId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['technicianPerformance'] });
    },
  });
}

// Technician Performance
export function useGetTechnicianPerformance() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Array<[string, bigint, bigint]>>({
    queryKey: ['technicianPerformance'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTechnicianPerformance();
    },
    enabled: !!actor && !actorFetching,
  });
}

// Feedback
export function useSubmitFeedback() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      ticketId: string;
      customerName: string;
      technician?: string;
      rating: number;
      comments?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.submitFeedback(
        params.ticketId,
        params.customerName,
        params.technician || null,
        BigInt(params.rating),
        params.comments || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['technicianPerformance'] });
    },
  });
}

export function useGetFeedbackByTechnician(technician?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Feedback[]>({
    queryKey: ['feedback', technician],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeedbackByTechnician(technician || null);
    },
    enabled: !!actor && !actorFetching,
  });
}

// Inventory Management
export function useGetInventoryItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInventoryItems();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetLowStockItems() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InventoryItem[]>({
    queryKey: ['inventory', 'lowStock'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLowStockItems();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddInventoryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; name: string; quantity: number; threshold: number }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addInventoryItem(params.id, params.name, BigInt(params.quantity), BigInt(params.threshold));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdateInventoryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; quantity: number }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateInventoryItem(params.id, BigInt(params.quantity));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useGetInventoryLogs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<InventoryLog[]>({
    queryKey: ['inventoryLogs'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getInventoryLogs();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddInventoryLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { ticketId: string; technician: string; itemId: string; quantity: number }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addInventoryLog(params.ticketId, params.technician, params.itemId, BigInt(params.quantity));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryLogs'] });
    },
  });
}
