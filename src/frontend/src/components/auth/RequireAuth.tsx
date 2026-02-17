import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { storeReturnDestination } from '../../utils/urlParams';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity, loginStatus, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Wait for initialization to complete before redirecting
    if (isInitializing || loginStatus === 'logging-in') {
      return;
    }

    if (!identity) {
      // Store the current location as the return destination
      const currentPath = location.pathname + (location.search || '');
      if (currentPath && currentPath !== '/login') {
        storeReturnDestination(currentPath);
      }
      navigate({ to: '/login' });
    }
  }, [identity, loginStatus, isInitializing, navigate, location]);

  // Show loading while initializing or logging in
  if (isInitializing || loginStatus === 'logging-in' || !identity) {
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
