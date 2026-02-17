import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCallerRole } from '../../hooks/useCallerRole';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Menu, X, Heart, Shield } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const { isAdmin } = useCallerRole();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/pets', label: 'Pets' },
    { to: '/health', label: 'Health & Care' },
    { to: '/ai-assistant', label: 'AI Assistant' },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }, { to: '/profile', label: 'Profile' }] : []),
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: Shield }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-7 w-7 fill-primary text-primary" />
            <span className="text-xl font-bold text-foreground">Pet Care System</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
                activeProps={{ className: 'text-foreground' }}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
            <Button onClick={handleAuth} disabled={isLoggingIn} variant={isAuthenticated ? 'outline' : 'default'}>
              {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-2"
                  activeProps={{ className: 'text-foreground' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
              <Button onClick={handleAuth} disabled={isLoggingIn} variant={isAuthenticated ? 'outline' : 'default'} className="w-full">
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
