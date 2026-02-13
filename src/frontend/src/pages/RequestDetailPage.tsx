import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetRequestById } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, AlertCircle, Package, Wrench } from 'lucide-react';
import RequireAuth from '../components/RequireAuth';

const categoryNames: Record<string, string> = {
  ac: 'Air Conditioner',
  'washing-machine': 'Washing Machine',
  refrigerator: 'Refrigerator',
  electrical: 'Electrical',
};

export default function RequestDetailPage() {
  const { requestId } = useParams({ strict: false }) as { requestId: string };
  const navigate = useNavigate();
  const { data: request, isLoading, isError, error } = useGetRequestById(requestId);

  if (isLoading) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </RequireAuth>
    );
  }

  if (isError || !request) {
    return (
      <RequireAuth>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error instanceof Error ? error.message : 'Request not found or you do not have permission to view it.'}
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate({ to: '/my-requests' })} className="mt-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to My Requests
            </Button>
          </div>
        </div>
      </RequireAuth>
    );
  }

  const categoryName = categoryNames[request.category] || request.category;
  const isService = request.requestType === 'service';
  const isOpen = request.status === 'open';

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Button onClick={() => navigate({ to: '/my-requests' })} variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to My Requests
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">Request Details</CardTitle>
                  <CardDescription className="font-mono text-base">{request.id}</CardDescription>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <Badge variant={isService ? 'default' : 'secondary'} className="gap-1.5">
                    {isService ? <Wrench className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                    {isService ? 'Service' : 'Spares'}
                  </Badge>
                  <Badge variant={isOpen ? 'default' : 'outline'}>
                    {isOpen ? 'Open' : 'Closed'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Category</h3>
                  <p className="text-base font-medium text-foreground">{categoryName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Request Type</h3>
                  <p className="text-base font-medium text-foreground">{isService ? 'Service / Repair' : 'Spare Parts'}</p>
                </div>
              </div>

              {(request.assignedTechnician || request.sparesUsed) && (
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4 text-foreground">Service Information</h3>
                  <div className="space-y-4">
                    {request.assignedTechnician && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned Technician</h4>
                        <p className="text-base text-foreground">{request.assignedTechnician}</p>
                      </div>
                    )}
                    {request.sparesUsed && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Spares Used</h4>
                        <p className="text-base text-foreground whitespace-pre-wrap">{request.sparesUsed}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Customer Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Name</h4>
                    <p className="text-base text-foreground">{request.customerName}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone Number</h4>
                    <p className="text-base text-foreground">{request.phoneNumber}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
                    <p className="text-base text-foreground whitespace-pre-wrap">{request.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {isService ? 'Problem Description' : 'Part Details'}
                </h3>
                <p className="text-base text-foreground whitespace-pre-wrap leading-relaxed">{request.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
