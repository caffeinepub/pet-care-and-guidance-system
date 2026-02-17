import { useEffect } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Shield, Check, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/dashboard' });
    }
  }, [identity, navigate]);

  const handleSignup = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Signup error:', error);
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  const benefits = [
    'Track your pets and their health records',
    'Get personalized vaccination reminders',
    'Save favorite breeds and resources',
    'Access AI-powered health assessments',
    'Secure, password-free authentication',
  ];

  return (
    <div className="container-custom section-spacing">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Create Your Account</CardTitle>
            <CardDescription>Join thousands of pet owners providing better care</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 text-sm">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-1">How It Works</p>
                <p className="text-muted-foreground">
                  Click below to create your Internet Identity. This is a secure, decentralized authentication method that doesn't require passwords.
                </p>
              </div>
            </div>

            <Button onClick={handleSignup} disabled={isLoggingIn} className="w-full" size="lg">
              {isLoggingIn ? 'Creating account...' : 'Create Account with Internet Identity'}
              {!isLoggingIn && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
