import { useEffect, useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { consumeReturnDestination, peekReturnDestination } from '../../utils/urlParams';

export default function LoginPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Check if user is trying to access admin area
  const returnTo = peekReturnDestination();
  const isAdminLogin = returnTo?.startsWith('/admin');

  // Handle post-login redirect only once
  useEffect(() => {
    if (identity && !hasRedirected) {
      setHasRedirected(true);
      const destination = consumeReturnDestination();
      navigate({ to: destination || '/dashboard' });
    }
  }, [identity, hasRedirected, navigate]);

  const handleLogin = async () => {
    setLoginError(null);
    try {
      await login();
      // Navigation will be handled by the useEffect after identity is set
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'UserInterrupt') {
        setLoginError('Login was cancelled. Please try again.');
      } else {
        setLoginError(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="container-custom section-spacing">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">
              {isAdminLogin ? 'Admin Access Required' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isAdminLogin
                ? 'Sign in with your administrator account to access the admin area'
                : 'Sign in to access your pet care dashboard'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAdminLogin && (
              <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-sm">
                <Shield className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Administrator Login</p>
                  <p className="text-muted-foreground">
                    You are signing in to access the admin area. Only authorized administrators can manage content.
                  </p>
                </div>
              </div>
            )}

            {!isAdminLogin && (
              <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 text-sm">
                <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Secure Authentication</p>
                  <p className="text-muted-foreground">
                    We use Internet Identity for secure, password-free authentication. Your privacy is protected.
                  </p>
                </div>
              </div>
            )}

            {loginError && (
              <div className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground mb-1">Login Failed</p>
                  <p className="text-muted-foreground">{loginError}</p>
                </div>
              </div>
            )}

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
