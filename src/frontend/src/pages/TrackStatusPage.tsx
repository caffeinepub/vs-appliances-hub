import { useState } from 'react';
import { useTrackStatusByIdAndPhone } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle, Search, Package, Wrench } from 'lucide-react';
import { getCategoryName } from '../constants/serviceCategories';
import { brandToString } from '../utils/brand';
import { getStatusLabel, getStatusVariant } from '../utils/requestStatus';
import { Request } from '../backend';
import FeedbackForm from '../components/feedback/FeedbackForm';

export default function TrackStatusPage() {
  const [ticketId, setTicketId] = useState('');
  const [phone, setPhone] = useState('');
  const [searchResult, setSearchResult] = useState<Request | null>(null);
  const [notFound, setNotFound] = useState(false);
  const trackMutation = useTrackStatusByIdAndPhone();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotFound(false);
    setSearchResult(null);

    if (!ticketId.trim()) return;

    try {
      const result = await trackMutation.mutateAsync({ ticketId: ticketId.trim(), phone: phone.trim() });
      if (result) {
        setSearchResult(result);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    }
  };

  const isService = searchResult?.requestType === 'service';
  const isCompleted = searchResult?.status === 'completed';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Track Your Service Request</CardTitle>
            <CardDescription>
              Enter your Ticket ID and Phone Number to check the status of your service request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="ticketId">Ticket ID *</Label>
                <Input
                  id="ticketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="REQ-1234567890-abc123"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9701078342"
                  required
                />
              </div>
              <Button type="submit" disabled={trackMutation.isPending} className="w-full gap-2">
                {trackMutation.isPending ? (
                  'Searching...'
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Track Status
                  </>
                )}
              </Button>
            </form>

            {notFound && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Request not found or phone number does not match. Please check your details and try again.
                </AlertDescription>
              </Alert>
            )}

            {searchResult && (
              <div className="space-y-6 border-t pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">Request Found</h3>
                    <p className="font-mono text-sm text-muted-foreground">{searchResult.id}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Badge variant={isService ? 'default' : 'secondary'} className="gap-1.5">
                      {isService ? <Wrench className="h-3.5 w-3.5" /> : <Package className="h-3.5 w-3.5" />}
                      {isService ? 'Service' : 'Spares'}
                    </Badge>
                    <Badge variant={getStatusVariant(searchResult.status)}>
                      {getStatusLabel(searchResult.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                    <p className="text-base font-medium text-foreground">{getCategoryName(searchResult.category)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Brand</h4>
                    <p className="text-base font-medium text-foreground">{brandToString(searchResult.brand)}</p>
                  </div>
                </div>

                {searchResult.assignedTechnician && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned Technician</h4>
                    <p className="text-base text-foreground">{searchResult.assignedTechnician}</p>
                  </div>
                )}

                {searchResult.sparesUsed && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Spares Used</h4>
                    <p className="text-base text-foreground whitespace-pre-wrap">{searchResult.sparesUsed}</p>
                  </div>
                )}

                {isCompleted && (
                  <div className="border-t pt-6">
                    <FeedbackForm
                      ticketId={searchResult.id}
                      customerName={searchResult.customerName}
                      technician={searchResult.assignedTechnician}
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
