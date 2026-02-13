import { useState } from 'react';
import { useGetAllTechnicians, useAddTechnician } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { Plus, AlertCircle, Users } from 'lucide-react';

export default function TechniciansManager() {
  const { data: technicians, isLoading } = useGetAllTechnicians();
  const addTechnician = useAddTechnician();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `TECH-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    try {
      await addTechnician.mutateAsync({
        id,
        name: name.trim(),
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      setName('');
      setPhone('');
      setNotes('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add technician:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Technicians
            </CardTitle>
            <CardDescription>Manage your technician team</CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Technician
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="techName">Name *</Label>
              <Input
                id="techName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Technician name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techPhone">Phone</Label>
              <Input
                id="techPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techNotes">Notes</Label>
              <Textarea
                id="techNotes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
            {addTechnician.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to add technician. Please try again.</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={addTechnician.isPending} className="flex-1">
                {addTechnician.isPending ? 'Adding...' : 'Add Technician'}
              </Button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !technicians || technicians.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No technicians added yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell>{tech.phone || '-'}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{tech.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
