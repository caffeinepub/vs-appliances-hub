import { useState } from 'react';
import { useAddInventoryLog, useGetInventoryItems, useGetFilteredRequests } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { ClipboardList, AlertCircle } from 'lucide-react';

export default function SparesUsageLogger() {
  const { data: inventory } = useGetInventoryItems();
  const { data: requests } = useGetFilteredRequests({});
  const addLog = useAddInventoryLog();

  const [ticketId, setTicketId] = useState('');
  const [technician, setTechnician] = useState('');
  const [itemId, setItemId] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addLog.mutateAsync({
        ticketId: ticketId.trim(),
        technician: technician.trim(),
        itemId,
        quantity: parseInt(quantity),
      });
      setTicketId('');
      setTechnician('');
      setItemId('');
      setQuantity('');
    } catch (error) {
      console.error('Failed to log usage:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Log Spares Usage
        </CardTitle>
        <CardDescription>Record spare parts used for service requests</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logTicket">Ticket ID *</Label>
            <Select value={ticketId} onValueChange={setTicketId}>
              <SelectTrigger id="logTicket">
                <SelectValue placeholder="Select ticket" />
              </SelectTrigger>
              <SelectContent>
                {requests?.map((req) => (
                  <SelectItem key={req.id} value={req.id}>
                    {req.id} - {req.customerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logTech">Technician Name *</Label>
            <Input
              id="logTech"
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              placeholder="Technician name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logItem">Spare Part *</Label>
            <Select value={itemId} onValueChange={setItemId}>
              <SelectTrigger id="logItem">
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {inventory?.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} (Available: {Number(item.quantity)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logQty">Quantity Used *</Label>
            <Input
              id="logQty"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          {addLog.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {addLog.error instanceof Error ? addLog.error.message : 'Failed to log usage'}
              </AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={addLog.isPending} className="w-full">
            {addLog.isPending ? 'Logging...' : 'Log Usage'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
