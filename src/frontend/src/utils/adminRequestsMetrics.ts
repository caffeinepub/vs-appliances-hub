import { Request, RequestStatus } from '../backend';

export interface RequestMetrics {
  total: number;
  open: number;
  assigned: number;
  completed: number;
  unassigned: number;
}

/**
 * Compute summary metrics from the request list
 */
export function computeMetrics(requests: Request[]): RequestMetrics {
  const metrics: RequestMetrics = {
    total: requests.length,
    open: 0,
    assigned: 0,
    completed: 0,
    unassigned: 0,
  };
  
  for (const request of requests) {
    if (request.status === RequestStatus.open) {
      metrics.open++;
    } else if (request.status === RequestStatus.assigned || request.status === RequestStatus.enRoute) {
      metrics.assigned++;
    } else if (request.status === RequestStatus.completed) {
      metrics.completed++;
    }
    
    if (!request.assignedTechnician || request.assignedTechnician.trim() === '') {
      metrics.unassigned++;
    }
  }
  
  return metrics;
}
