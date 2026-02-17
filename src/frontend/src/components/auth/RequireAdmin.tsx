import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCallerRole } from '../../hooks/useCallerRole';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import RequireAuth from './RequireAuth';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface RequireAdminProps {
  children: ReactNode;
}

export default function RequireAdmin({ children }: RequireAdminProps) {
  const { isAdmin, isLoading, isFetched } = useCallerRole();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  return (
    <RequireAuth>
      {isLoading || !isFetched ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Checking permissions...</p>
          </div>
        </div>
      ) : !isAdmin ? (
        <div className="flex min-h-[60vh] items-center justify-center bg-muted/30">
          <div className="text-center max-w-md mx-auto p-8 bg-card rounded-lg shadow-lg">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You do not have permission to access this area. Only administrators can manage content.
            </p>
            <Button onClick={() => navigate({ to: '/' })}>
              Return to Home
            </Button>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </RequireAuth>
  );
}
