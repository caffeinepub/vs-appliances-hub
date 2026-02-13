import { useState, useMemo } from 'react';
import { useGetAllRequests, useIsCallerAdmin, useAdminUpdateRequest } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertCircle, Package, Wrench, Edit, ShieldAlert, Loader2, Search, X, Download, CheckCircle, XCircle } from 'lucide-react';
import RequireAuth from '../components/RequireAuth';
import { Request, RequestStatus } from '../backend';
import { getVisibleRequests, FilterOptions, SortOption } from '../utils/adminRequestsView';
import { computeMetrics } from '../utils/adminRequestsMetrics';
import { formatTimestamp, formatShortDate } from '../utils/formatters';
import { exportRequestsToCSV } from '../utils/csvExport';

const categoryNames: Record<string, string> = {
  ac: 'Air Conditioner',
  'washing-machine': 'Washing Machine',
  refrigerator: 'Refrigerator',
  electrical: 'Electrical',
};

export default function AdminDashboardPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: requests, isLoading: requestsLoading, isError, error } = useGetAllRequests();
  const updateRequest = useAdminUpdateRequest();

  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [formData, setFormData] = useState({
    technician: '',
    spares: '',
    status: '' as RequestStatus | '',
  });

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    category: 'all',
    type: 'all',
  });
  const [sortBy, setSortBy] = useState<SortOption>('created-newest');

  // Compute visible requests and metrics
  const visibleRequests = useMemo(() => {
    if (!requests) return [];
    return getVisibleRequests(requests, searchQuery, filters, sortBy);
  }, [requests, searchQuery, filters, sortBy]);

  const metrics = useMemo(() => {
    if (!requests) return { total: 0, open: 0, closed: 0, unassigned: 0 };
    return computeMetrics(requests);
  }, [requests]);

  const handleEdit = (request: Request) => {
    setEditingRequest(request);
    setFormData({
      technician: request.assignedTechnician || '',
      spares: request.sparesUsed || '',
      status: request.status,
    });
  };

  const handleSave = async () => {
    if (!editingRequest) return;

    try {
      await updateRequest.mutateAsync({
        id: editingRequest.id,
        status: formData.status || undefined,
        technician: formData.technician || undefined,
        spares: formData.spares || undefined,
      });
      setEditingRequest(null);
    } catch (err) {
      console.error('Failed to update request:', err);
    }
  };

  const handleQuickStatusToggle = async (request: Request) => {
    const newStatus: RequestStatus = request.status === RequestStatus.open ? RequestStatus.closed : RequestStatus.open;
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        status: newStatus,
        technician: request.assignedTechnician || undefined,
        spares: request.sparesUsed || undefined,
      });
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({
      status: 'all',
      category: 'all',
      type: 'all',
    });
    setSortBy('created-newest');
  };

  const handleExportCSV = () => {
    exportRequestsToCSV(visibleRequests, `service-requests-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const hasActiveFilters = searchQuery || filters.status !== 'all' || filters.category !== 'all' || filters.type !== 'all' || sortBy !== 'created-newest';

  if (isAdminLoading || requestsLoading) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </RequireAuth>
    );
  }

  if (!isAdmin) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Alert variant="destructive">
              <ShieldAlert className="h-4 w-4" />
              <AlertDescription>
                Access Denied: You do not have permission to view this page. Only administrators can access the admin dashboard.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </RequireAuth>
    );
  }

  if (isError) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : 'Failed to load requests. Please try again.'}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage all service requests, assign technicians, and track status</p>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Requests</CardDescription>
                <CardTitle className="text-3xl">{metrics.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Open Requests</CardDescription>
                <CardTitle className="text-3xl text-primary">{metrics.open}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Closed Requests</CardDescription>
                <CardTitle className="text-3xl text-muted-foreground">{metrics.closed}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Unassigned</CardDescription>
                <CardTitle className="text-3xl text-warning">{metrics.unassigned}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">All Service Requests</CardTitle>
                  <CardDescription>
                    Showing {visibleRequests.length} of {requests?.length || 0} request{requests?.length !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                      <X className="h-4 w-4" />
                      Reset
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={visibleRequests.length === 0} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Request ID, Customer Name, or Phone Number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="filter-status" className="text-sm mb-2 block">Status</Label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) => setFilters({ ...filters, status: value as FilterOptions['status'] })}
                    >
                      <SelectTrigger id="filter-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="filter-category" className="text-sm mb-2 block">Category</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger id="filter-category">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="ac">Air Conditioner</SelectItem>
                        <SelectItem value="washing-machine">Washing Machine</SelectItem>
                        <SelectItem value="refrigerator">Refrigerator</SelectItem>
                        <SelectItem value="electrical">Electrical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="filter-type" className="text-sm mb-2 block">Type</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(value) => setFilters({ ...filters, type: value as FilterOptions['type'] })}
                    >
                      <SelectTrigger id="filter-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="spares">Spares</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sort-by" className="text-sm mb-2 block">Sort By</Label>
                    <Select
                      value={sortBy}
                      onValueChange={(value) => setSortBy(value as SortOption)}
                    >
                      <SelectTrigger id="sort-by">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created-newest">Newest First</SelectItem>
                        <SelectItem value="created-oldest">Oldest First</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Table */}
              {!requests || requests.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">No Requests Yet</h3>
                  <p className="text-muted-foreground">No service requests have been submitted.</p>
                </div>
              ) : visibleRequests.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">No Matching Requests</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleRequests.map((request) => {
                        const isService = request.requestType === 'service';
                        const categoryName = categoryNames[request.category] || request.category;
                        const isOpen = request.status === 'open';

                        return (
                          <TableRow key={request.id}>
                            <TableCell className="font-mono text-sm">{request.id}</TableCell>
                            <TableCell>{categoryName}</TableCell>
                            <TableCell>
                              <Badge variant={isService ? 'default' : 'secondary'} className="gap-1.5">
                                {isService ? <Wrench className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                                {isService ? 'Service' : 'Spares'}
                              </Badge>
                            </TableCell>
                            <TableCell>{request.customerName}</TableCell>
                            <TableCell className="text-sm">{request.phoneNumber}</TableCell>
                            <TableCell>
                              <Badge variant={isOpen ? 'default' : 'outline'}>
                                {isOpen ? 'Open' : 'Closed'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {request.assignedTechnician || <span className="text-muted-foreground">Not assigned</span>}
                            </TableCell>
                            <TableCell className="text-sm">{formatShortDate(request.createdTime)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuickStatusToggle(request)}
                                  disabled={updateRequest.isPending}
                                  className="gap-1.5"
                                  title={isOpen ? 'Mark as Closed' : 'Mark as Open'}
                                >
                                  {isOpen ? (
                                    <>
                                      <XCircle className="h-4 w-4" />
                                      Close
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4" />
                                      Open
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(request)}
                                  className="gap-1.5"
                                >
                                  <Edit className="h-4 w-4" />
                                  Edit
                                </Button>
                              </div>
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
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingRequest} onOpenChange={(open) => !open && setEditingRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Request</DialogTitle>
            <DialogDescription className="font-mono">{editingRequest?.id}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Customer Information */}
            <div className="space-y-3 pb-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                  <p className="text-base font-medium text-foreground mt-1">{editingRequest?.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                  <p className="text-base font-medium text-foreground mt-1">{editingRequest?.phoneNumber}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                <p className="text-base font-medium text-foreground mt-1">{editingRequest?.address}</p>
              </div>
            </div>

            {/* Request Details */}
            <div className="space-y-3 pb-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Request Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <p className="text-base font-medium text-foreground mt-1">
                    {editingRequest && (categoryNames[editingRequest.category] || editingRequest.category)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <p className="text-base font-medium text-foreground mt-1">
                    {editingRequest?.requestType === 'service' ? 'Service' : 'Spares'}
                  </p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">{editingRequest?.description}</p>
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-3 pb-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Timestamps</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-sm text-foreground mt-1">
                    {editingRequest && formatTimestamp(editingRequest.createdTime)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-sm text-foreground mt-1">
                    {editingRequest && formatTimestamp(editingRequest.updatedTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Admin Controls</h3>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as RequestStatus })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="technician">Assigned Technician</Label>
                <Input
                  id="technician"
                  placeholder="Enter technician name"
                  value={formData.technician}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="spares">Spares Used</Label>
                <Textarea
                  id="spares"
                  placeholder="Enter spares used (optional)"
                  value={formData.spares}
                  onChange={(e) => setFormData({ ...formData, spares: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRequest(null)} disabled={updateRequest.isPending}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateRequest.isPending}>
              {updateRequest.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RequireAuth>
  );
}
