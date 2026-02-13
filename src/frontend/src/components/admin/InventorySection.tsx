import { useState } from 'react';
import { useGetInventoryItems, useGetLowStockItems, useAddInventoryItem, useUpdateInventoryItem } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Alert, AlertDescription } from '../ui/alert';
import { Plus, AlertTriangle, Package, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

export default function InventorySection() {
  const { data: inventory, isLoading } = useGetInventoryItems();
  const { data: lowStock } = useGetLowStockItems();
  const addItem = useAddInventoryItem();
  const updateItem = useUpdateInventoryItem();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<{ id: string; name: string; quantity: number } | null>(null);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [threshold, setThreshold] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = `ITEM-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    try {
      await addItem.mutateAsync({
        id,
        name: name.trim(),
        quantity: parseInt(quantity),
        threshold: parseInt(threshold),
      });
      setName('');
      setQuantity('');
      setThreshold('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      await updateItem.mutateAsync({
        id: editingItem.id,
        quantity: parseInt(newQuantity),
      });
      setEditingItem(null);
      setNewQuantity('');
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const lowStockIds = new Set(lowStock?.map(item => item.id) || []);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Inventory Management
              </CardTitle>
              <CardDescription>Track spare parts stock levels</CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {lowStock && lowStock.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {lowStock.length} item{lowStock.length !== 1 ? 's' : ''} running low on stock
              </AlertDescription>
            </Alert>
          )}

          {showAddForm && (
            <form onSubmit={handleAdd} className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., AC Capacitor"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemQty">Quantity *</Label>
                  <Input
                    id="itemQty"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="itemThreshold">Low Stock Threshold *</Label>
                  <Input
                    id="itemThreshold"
                    type="number"
                    min="0"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={addItem.isPending} className="flex-1">
                  {addItem.isPending ? 'Adding...' : 'Add Item'}
                </Button>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !inventory || inventory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No inventory items yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Threshold</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => {
                  const isLowStock = lowStockIds.has(item.id);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{Number(item.quantity)}</TableCell>
                      <TableCell className="text-right">{Number(item.threshold)}</TableCell>
                      <TableCell className="text-right">
                        {isLowStock ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : (
                          <Badge variant="outline">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingItem({ id: item.id, name: item.name, quantity: Number(item.quantity) });
                            setNewQuantity(String(item.quantity));
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock Quantity</DialogTitle>
            <DialogDescription>{editingItem?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newQty">New Quantity</Label>
              <Input
                id="newQty"
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateItem.isPending}>
              {updateItem.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
