import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCreateRequest } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { RequestType } from '../backend';
import RequireAuth from '../components/RequireAuth';

const categories = [
  { id: 'ac', name: 'Air Conditioner' },
  { id: 'washing-machine', name: 'Washing Machine' },
  { id: 'refrigerator', name: 'Refrigerator' },
  { id: 'electrical', name: 'Electrical' },
];

export default function RegisterRequestPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { category?: string };
  const createRequest = useCreateRequest();

  const [category, setCategory] = useState(search.category || '');
  const [requestType, setRequestType] = useState<'service' | 'spares'>('service');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (search.category) {
      setCategory(search.category);
    }
  }, [search.category]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!category) newErrors.category = 'Please select a category';
    if (!customerName.trim()) newErrors.customerName = 'Name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\+?[\d\s-()]{10,}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      await createRequest.mutateAsync({
        id: requestId,
        category,
        requestType: requestType === 'service' ? RequestType.service : RequestType.spares,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        description: description.trim(),
      });

      navigate({ to: '/success/$requestId', params: { requestId } });
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Register Service Request</CardTitle>
              <CardDescription>
                Fill out the form below to request a service or order spare parts for your appliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select appliance category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>

                {/* Request Type */}
                <div className="space-y-3">
                  <Label>Request Type *</Label>
                  <RadioGroup value={requestType} onValueChange={(val) => setRequestType(val as 'service' | 'spares')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="service" id="service" />
                      <Label htmlFor="service" className="font-normal cursor-pointer">
                        Service / Repair
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spares" id="spares" />
                      <Label htmlFor="spares" className="font-normal cursor-pointer">
                        Spare Parts
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Customer Name */}
                <div className="space-y-2">
                  <Label htmlFor="customerName">Your Name *</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.customerName ? 'border-destructive' : ''}
                  />
                  {errors.customerName && <p className="text-sm text-destructive">{errors.customerName}</p>}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={errors.phoneNumber ? 'border-destructive' : ''}
                  />
                  {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Service Address *</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address"
                    rows={3}
                    className={errors.address ? 'border-destructive' : ''}
                  />
                  {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    {requestType === 'service' ? 'Problem Description' : 'Part Details'} *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={
                      requestType === 'service'
                        ? 'Describe the issue with your appliance'
                        : 'Describe the spare part you need'
                    }
                    rows={4}
                    className={errors.description ? 'border-destructive' : ''}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                {/* Error Alert */}
                {createRequest.isError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {createRequest.error instanceof Error
                        ? createRequest.error.message
                        : 'Failed to submit request. Please try again.'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate({ to: '/' })} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createRequest.isPending} className="flex-1">
                    {createRequest.isPending ? 'Submitting...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </RequireAuth>
  );
}
