import { RequestStatus } from '../backend';

export function getStatusLabel(status: RequestStatus): string {
  switch (status) {
    case RequestStatus.open:
      return 'Open';
    case RequestStatus.assigned:
      return 'Assigned';
    case RequestStatus.enRoute:
      return 'Technician En Route';
    case RequestStatus.pendingSpares:
      return 'Pending Spares';
    case RequestStatus.completed:
      return 'Completed';
    default:
      return 'Unknown';
  }
}

export function getStatusVariant(status: RequestStatus): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case RequestStatus.open:
      return 'default';
    case RequestStatus.assigned:
      return 'secondary';
    case RequestStatus.enRoute:
      return 'default';
    case RequestStatus.pendingSpares:
      return 'outline';
    case RequestStatus.completed:
      return 'outline';
    default:
      return 'outline';
  }
}
