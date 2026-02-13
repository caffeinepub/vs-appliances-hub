import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle2, Home, FileText } from 'lucide-react';

export default function RequestSuccessPage() {
  const { requestId } = useParams({ strict: false }) as { requestId: string };
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-2">Request Submitted Successfully!</CardTitle>
            <CardDescription className="text-base">
              Your service request has been received and will be processed shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Request Reference</p>
              <p className="text-2xl font-bold text-foreground font-mono">{requestId}</p>
              <p className="text-xs text-muted-foreground mt-2">Please save this reference number for tracking</p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Our team will review your request and contact you within 24 hours</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You can track your request status in the "My Requests" section</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Keep your phone accessible for our technician's call</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={() => navigate({ to: '/' })} variant="outline" className="flex-1 gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
              <Button
                onClick={() => navigate({ to: '/request/$requestId', params: { requestId } })}
                className="flex-1 gap-2"
              >
                <FileText className="h-4 w-4" />
                View Request Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
