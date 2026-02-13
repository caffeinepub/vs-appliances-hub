import { useState, useMemo } from 'react';
import { useGetFilteredRequests, useIsCallerAdmin, useAssignTechnician } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertCircle, Package, Wrench, ShieldAlert, Search, Users, TrendingUp, Package as PackageIcon } from 'lucide-react';
import RequireAuth from '../components/RequireAuth';
import { Request, RequestStatus } from '../backend';
import { getCategoryName } from '../constants/serviceCategories';
import { brandToString } from '../utils/brand';
import { getStatusLabel, getStatusVariant } from '../utils/requestStatus';
import TechniciansManager from '../components/admin/TechniciansManager';
import TechnicianSelect from '../components/admin/TechnicianSelect';
import TechnicianPerformanceTable from '../components/admin/TechnicianPerformanceTable';
import TechnicianFeedbackPanel from '../components/admin/TechnicianFeedbackPanel';
import InventorySection from '../components/admin/InventorySection';
import SparesUsageLogger from '../components/admin/SparesUsageLogger';
import UsageReport from '../components/admin/UsageReport';

export default function AdminDashboardPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: requests, isLoading: requestsLoading, isError, error } = useGetFilteredRequests({});
  const assignTechnician = useAssignTechnician();

  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');

  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    let filtered = requests;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.id.toLowerCase().includes(query) ||
          r.customerName.toLowerCase().includes(query) ||
          r.phoneNumber.includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    return filtered;
  }, [requests, searchQuery, statusFilter]);

  const metrics = useMemo(() => {
    if (!requests) return { total: 0, open: 0, assigned: 0, completed: 0, unassigned: 0 };
    return {
      total: requests.length,
      open: requests.filter((r) => r.status === RequestStatus.open).length,
      assigned: requests.filter((r) => r.status === RequestStatus.assigned || r.status === RequestStatus.enRoute).length,
      completed: requests.filter((r) => r.status === RequestStatus.completed).length,
      unassigned: requests.filter((r) => !r.assignedTechnician).length,
    };
  }, [requests]);

  const handleAssignTechnician = async () => {
    if (!editingRequest || !selectedTechnicianId) return;

    try {
      await assignTechnician.mutateAsync({
        requestId: editingRequest.id,
        technicianId: selectedTechnicianId,
      });
      setEditingRequest(null);
      setSelectedTechnicianId('');
    } catch (err) {
      console.error('Failed to assign technician:', err);
    }
  };

  if (isAdminLoading) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </RequireAuth>
    );
  }

  if (!isAdmin) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-12">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              Access Denied: You do not have admin permissions to view this page.
            </AlertDescription>
          </Alert>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage service requests, technicians, and inventory</p>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Requests</CardDescription>
                  <CardTitle className="text-3xl">{metrics.total}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Open</CardDescription>
                  <CardTitle className="text-3xl">{metrics.open}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Assigned</CardDescription>
                  <CardTitle className="text-3xl">{metrics.assigned}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Completed</CardDescription>
                  <CardTitle className="text-3xl">{metrics.completed}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Unassigned</CardDescription>
                  <CardTitle className="text-3xl">{metrics.unassigned}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by ID, name, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as typeof statusFilter)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value={RequestStatus.open}>Open</SelectItem>
                      <SelectItem value={RequestStatus.assigned}>Assigned</SelectItem>
                      <SelectItem value={RequestStatus.enRoute}>En Route</SelectItem>
                      <SelectItem value={RequestStatus.pendingSpares}>Pending Spares</SelectItem>
                      <SelectItem value={RequestStatus.completed}>Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {requestsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : isError ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {error instanceof Error ? error.message : 'Failed to load requests'}
                    </AlertDescription>
                  </Alert>
                ) : filteredRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No requests found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Technician</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRequests.map((request) => {
                          const isService = request.requestType === 'service';
                          return (
                            <TableRow key={request.id}>
                              <TableCell className="font-mono text-xs">{request.id}</TableCell>
                              <TableCell>{request.customerName}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {isService ? <Wrench className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                                  {getCategoryName(request.category)}
                                </div>
                              </TableCell>
                              <TableCell>{brandToString(request.brand)}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusVariant(request.status)}>
                                  {getStatusLabel(request.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>{request.assignedTechnician || '-'}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingRequest(request);
                                    setSelectedTechnicianId('');
                                  }}
                                >
                                  Assign
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technicians" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TechniciansManager />
              <TechnicianPerformanceTable />
            </div>
            <TechnicianFeedbackPanel />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InventorySection />
              <SparesUsageLogger />
            </div>
            <UsageReport />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!editingRequest} onOpenChange={() => setEditingRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>
              {editingRequest?.id} - {editingRequest?.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <TechnicianSelect value={selectedTechnicianId} onChange={setSelectedTechnicianId} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRequest(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssignTechnician} disabled={!selectedTechnicianId || assignTechnician.isPending}>
              {assignTechnician.isPending ? 'Assigning...' : 'Assign'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RequireAuth>
  );
}
