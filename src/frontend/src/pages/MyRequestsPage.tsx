import { useNavigate } from '@tanstack/react-router';
import { useGetRequestsByCaller } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { AlertCircle, FileText, Package, Wrench, Plus } from 'lucide-react';
import RequireAuth from '../components/RequireAuth';

const categoryNames: Record<string, string> = {
  ac: 'Air Conditioner',
  'washing-machine': 'Washing Machine',
  refrigerator: 'Refrigerator',
  electrical: 'Electrical',
};

export default function MyRequestsPage() {
  const navigate = useNavigate();
  const { data: requests, isLoading, isError, error } = useGetRequestsByCaller();

  const renderContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      );
    }

    if (isError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load your requests. Please try again.'}
          </AlertDescription>
        </Alert>
      );
    }

    if (!requests || requests.length === 0) {
      return (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">No Requests Yet</h3>
            <p className="text-muted-foreground mb-6">You haven't submitted any service requests.</p>
            <Button onClick={() => navigate({ to: '/register' })} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Request
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Service Requests</CardTitle>
          <CardDescription>View and manage all your submitted service requests</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const isService = request.requestType === 'service';
                  const categoryName = categoryNames[request.category] || request.category;
                  const isOpen = request.status === 'open';

                  return (
                    <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{request.id}</TableCell>
                      <TableCell>{categoryName}</TableCell>
                      <TableCell>
                        <Badge variant={isService ? 'default' : 'secondary'} className="gap-1.5">
                          {isService ? <Wrench className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                          {isService ? 'Service' : 'Spares'}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.customerName}</TableCell>
                      <TableCell>
                        <Badge variant={isOpen ? 'default' : 'outline'}>
                          {isOpen ? 'Open' : 'Closed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate({ to: '/request/$requestId', params: { requestId: request.id } })}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {requests.map((request) => {
              const isService = request.requestType === 'service';
              const categoryName = categoryNames[request.category] || request.category;
              const isOpen = request.status === 'open';

              return (
                <Card
                  key={request.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => navigate({ to: '/request/$requestId', params: { requestId: request.id } })}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-mono text-xs text-muted-foreground mb-1">{request.id}</p>
                        <p className="font-semibold text-foreground">{categoryName}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant={isService ? 'default' : 'secondary'} className="gap-1.5">
                          {isService ? <Wrench className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                          {isService ? 'Service' : 'Spares'}
                        </Badge>
                        <Badge variant={isOpen ? 'default' : 'outline'}>
                          {isOpen ? 'Open' : 'Closed'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{request.customerName}</p>
                    <Button variant="ghost" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Requests</h1>
              <p className="text-muted-foreground">Track and manage your service requests</p>
            </div>
            <Button onClick={() => navigate({ to: '/register' })} className="gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </div>
          {renderContent()}
        </div>
      </div>
    </RequireAuth>
  );
}
