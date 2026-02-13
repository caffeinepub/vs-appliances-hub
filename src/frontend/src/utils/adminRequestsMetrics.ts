import { Request } from '../backend';

export interface RequestMetrics {
  total: number;
  open: number;
  closed: number;
  unassigned: number;
}

/**
 * Compute summary metrics from the request list
 */
export function computeMetrics(requests: Request[]): RequestMetrics {
  const metrics: RequestMetrics = {
    total: requests.length,
    open: 0,
    closed: 0,
    unassigned: 0,
  };
  
  for (const request of requests) {
    if (request.status === 'open') {
      metrics.open++;
    } else if (request.status === 'closed') {
      metrics.closed++;
    }
    
    if (!request.assignedTechnician || request.assignedTechnician.trim() === '') {
      metrics.unassigned++;
    }
  }
  
  return metrics;
}
