import { Request } from '../backend';
import { formatTimestamp } from './formatters';

/**
 * Escape CSV field value (handle quotes and commas)
 */
function escapeCSVField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Convert requests to CSV format and trigger download
 */
export function exportRequestsToCSV(requests: Request[], filename: string = 'service-requests.csv'): void {
  // Define CSV headers
  const headers = [
    'Request ID',
    'Category',
    'Request Type',
    'Customer Name',
    'Phone Number',
    'Status',
    'Assigned Technician',
    'Spares Used',
    'Created Time',
    'Updated Time',
  ];
  
  // Build CSV rows
  const rows = requests.map(request => [
    escapeCSVField(request.id),
    escapeCSVField(request.category),
    escapeCSVField(request.requestType === 'service' ? 'Service' : 'Spares'),
    escapeCSVField(request.customerName),
    escapeCSVField(request.phoneNumber),
    escapeCSVField(request.status === 'open' ? 'Open' : 'Closed'),
    escapeCSVField(request.assignedTechnician || 'Not assigned'),
    escapeCSVField(request.sparesUsed || 'None'),
    escapeCSVField(formatTimestamp(request.createdTime)),
    escapeCSVField(formatTimestamp(request.updatedTime)),
  ]);
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
