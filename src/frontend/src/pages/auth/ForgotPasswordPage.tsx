import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Shield, ExternalLink, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="container-custom section-spacing">
      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Account Recovery</CardTitle>
            <CardDescription>Help with accessing your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 text-sm">
              <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-2">Internet Identity Recovery</p>
                <p className="text-muted-foreground mb-3">
                  This application uses Internet Identity for authentication. We don't store passwords, so account recovery is handled through Internet Identity's secure recovery process.
                </p>
                <p className="text-muted-foreground">
                  If you've lost access to your Internet Identity, you'll need to use the recovery methods you set up when creating your identity (recovery phrase, security key, or recovery device).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Recovery Steps:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Visit the Internet Identity recovery page</li>
                <li>Use your recovery phrase or device</li>
                <li>Follow the on-screen instructions</li>
                <li>Return here and sign in with your recovered identity</li>
              </ol>
            </div>

            <Button asChild className="w-full" size="lg">
              <a href="https://identity.ic0.app/recover" target="_blank" rel="noopener noreferrer">
                Go to Internet Identity Recovery
                <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>

            <Link to="/login">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
