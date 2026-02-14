import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCreateRequest } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { RequestType } from '../backend';
import RequireAuth from '../components/RequireAuth';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';

export default function RegisterRequestPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { category?: string };
  const createRequest = useCreateRequest();

  const [category, setCategory] = useState(search.category || '');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (search.category) {
      setCategory(search.category);
    }
  }, [search.category]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerName.trim()) newErrors.customerName = 'Name is required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^\+?[\d\s-()]{10,}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    if (!location.trim()) newErrors.location = 'Location is required';

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
        brand: { __kind__: 'other', other: '' },
        category: category || '',
        requestType: RequestType.service,
        customerName: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        location: location.trim(),
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
                Fill out the form below to request a service for your appliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select appliance category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    placeholder="+91 9701078342"
                    className={errors.phoneNumber ? 'border-destructive' : ''}
                  />
                  {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber}</p>}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location (Locality/Landmark/Pincode) *</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Srikalahasti, Near Temple, 517644"
                    className={errors.location ? 'border-destructive' : ''}
                  />
                  {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Service Address</Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete address (optional)"
                    rows={3}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Problem Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue with your appliance (optional)"
                    rows={4}
                  />
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
