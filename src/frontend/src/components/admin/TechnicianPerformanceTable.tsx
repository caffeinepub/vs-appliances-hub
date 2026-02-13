import { useGetTechnicianPerformance, useGetFilteredRequests } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { RequestStatus } from '../../backend';

export default function TechnicianPerformanceTable() {
  const { data: performanceData, isLoading: perfLoading } = useGetTechnicianPerformance();
  const { data: allRequests, isLoading: reqLoading } = useGetFilteredRequests({});

  const technicianStats = useMemo(() => {
    if (!allRequests) return [];

    const statsMap = new Map<string, { assigned: number; completed: number; pending: number }>();

    allRequests.forEach((req) => {
      if (req.assignedTechnician) {
        const current = statsMap.get(req.assignedTechnician) || { assigned: 0, completed: 0, pending: 0 };
        current.assigned++;
        if (req.status === RequestStatus.completed) {
          current.completed++;
        } else {
          current.pending++;
        }
        statsMap.set(req.assignedTechnician, current);
      }
    });

    return Array.from(statsMap.entries()).map(([name, stats]) => ({
      name,
      ...stats,
    }));
  }, [allRequests]);

  const isLoading = perfLoading || reqLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Technician Performance
        </CardTitle>
        <CardDescription>Track technician workload and completion rates</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : technicianStats.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No technician data available</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead className="text-right">Total Assigned</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="text-right">Pending</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicianStats.map((stat) => (
                <TableRow key={stat.name}>
                  <TableCell className="font-medium">{stat.name}</TableCell>
                  <TableCell className="text-right">{stat.assigned}</TableCell>
                  <TableCell className="text-right">{stat.completed}</TableCell>
                  <TableCell className="text-right">{stat.pending}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
