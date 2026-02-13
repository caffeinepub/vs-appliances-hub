/**
 * Format a bigint timestamp (nanoseconds) to a human-readable date string
 */
export function formatTimestamp(timestamp: bigint): string {
  if (timestamp === 0n) return 'N/A';
  
  // Convert nanoseconds to milliseconds
  const date = new Date(Number(timestamp) / 1000000);
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a bigint timestamp to a short date string
 */
export function formatShortDate(timestamp: bigint): string {
  if (timestamp === 0n) return 'N/A';
  
  const date = new Date(Number(timestamp) / 1000000);
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
