import { useMemo } from 'react';
import { useGetInventoryLogs, useGetInventoryItems } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { BarChart3 } from 'lucide-react';

export default function UsageReport() {
  const { data: logs, isLoading: logsLoading } = useGetInventoryLogs();
  const { data: inventory, isLoading: invLoading } = useGetInventoryItems();

  const usageStats = useMemo(() => {
    if (!logs || !inventory) return [];

    const statsMap = new Map<string, { name: string; count: number }>();

    logs.forEach((log) => {
      const item = inventory.find(i => i.id === log.itemId);
      if (item) {
        const current = statsMap.get(log.itemId) || { name: item.name, count: 0 };
        current.count += Number(log.quantity);
        statsMap.set(log.itemId, current);
      }
    });

    return Array.from(statsMap.values()).sort((a, b) => b.count - a.count);
  }, [logs, inventory]);

  const isLoading = logsLoading || invLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Usage Report
        </CardTitle>
        <CardDescription>Most frequently used spare parts</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : usageStats.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No usage data available</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Spare Part</TableHead>
                <TableHead className="text-right">Total Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageStats.map((stat, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{stat.name}</TableCell>
                  <TableCell className="text-right">{stat.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
