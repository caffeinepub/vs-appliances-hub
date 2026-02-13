import { Request, RequestStatus } from '../backend';

export type FilterOptions = {
  status: 'all' | RequestStatus;
  category: 'all' | string;
  type: 'all' | 'service' | 'spares';
};

export type SortOption = 'created-newest' | 'created-oldest' | 'status';

/**
 * Normalize text for case-insensitive search
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Check if a request matches the search query
 */
export function matchesSearch(request: Request, searchQuery: string): boolean {
  if (!searchQuery) return true;
  
  const normalized = normalizeText(searchQuery);
  
  return (
    normalizeText(request.id).includes(normalized) ||
    normalizeText(request.customerName).includes(normalized) ||
    normalizeText(request.phoneNumber).includes(normalized)
  );
}

/**
 * Check if a request matches the filters
 */
export function matchesFilters(request: Request, filters: FilterOptions): boolean {
  // Status filter
  if (filters.status !== 'all' && request.status !== filters.status) {
    return false;
  }
  
  // Category filter
  if (filters.category !== 'all' && request.category !== filters.category) {
    return false;
  }
  
  // Type filter
  if (filters.type !== 'all' && request.requestType !== filters.type) {
    return false;
  }
  
  return true;
}

/**
 * Sort requests based on the selected option
 */
export function sortRequests(requests: Request[], sortBy: SortOption): Request[] {
  const sorted = [...requests];
  
  switch (sortBy) {
    case 'created-newest':
      return sorted.sort((a, b) => Number(b.createdTime - a.createdTime));
    case 'created-oldest':
      return sorted.sort((a, b) => Number(a.createdTime - b.createdTime));
    case 'status':
      return sorted.sort((a, b) => {
        // Priority order: open > assigned > enRoute > pendingSpares > completed
        const statusOrder: Record<RequestStatus, number> = {
          [RequestStatus.open]: 1,
          [RequestStatus.assigned]: 2,
          [RequestStatus.enRoute]: 3,
          [RequestStatus.pendingSpares]: 4,
          [RequestStatus.completed]: 5,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    default:
      return sorted;
  }
}

/**
 * Apply all filters, search, and sorting to get the visible request list
 */
export function getVisibleRequests(
  requests: Request[],
  searchQuery: string,
  filters: FilterOptions,
  sortBy: SortOption
): Request[] {
  let visible = requests;
  
  // Apply search
  if (searchQuery) {
    visible = visible.filter(req => matchesSearch(req, searchQuery));
  }
  
  // Apply filters
  visible = visible.filter(req => matchesFilters(req, filters));
  
  // Apply sorting
  visible = sortRequests(visible, sortBy);
  
  return visible;
}
