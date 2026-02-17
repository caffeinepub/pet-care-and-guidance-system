import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginStatus !== 'initializing' && !identity) {
      navigate({ to: '/login' });
    }
  }, [identity, loginStatus, navigate]);

  if (loginStatus === 'initializing' || !identity) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
