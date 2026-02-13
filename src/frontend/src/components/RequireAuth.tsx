import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ShieldAlert } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-2">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldAlert className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please sign in to access your service requests and manage your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={login} disabled={isLoggingIn} size="lg" className="w-full">
                {isLoggingIn ? 'Signing in...' : 'Sign In'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
