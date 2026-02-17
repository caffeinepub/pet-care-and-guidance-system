import { useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="container-custom section-spacing">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to access your pet care dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 text-sm">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-1">Secure Authentication</p>
                <p className="text-muted-foreground">
                  We use Internet Identity for secure, password-free authentication. Your privacy is protected.
                </p>
              </div>
            </div>

            <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full" size="lg">
              {isLoggingIn ? 'Signing in...' : 'Sign in with Internet Identity'}
              {!isLoggingIn && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>

            <div className="space-y-2 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="text-muted-foreground">
                <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                  Need help with recovery?
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
