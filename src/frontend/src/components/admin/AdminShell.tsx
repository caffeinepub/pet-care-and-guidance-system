import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ChevronRight, Home } from 'lucide-react';

interface AdminShellProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
}

export default function AdminShell({ children, title, description, breadcrumbs }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-admin-bg">
      <div className="admin-header">
        <div className="container-custom">
          <div className="py-6">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-2 text-sm mb-4">
                <Link to="/" className="text-admin-muted hover:text-admin-foreground transition-colors">
                  <Home className="h-4 w-4" />
                </Link>
                <ChevronRight className="h-4 w-4 text-admin-muted" />
                <Link to="/admin" className="text-admin-muted hover:text-admin-foreground transition-colors">
                  Admin
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-admin-muted" />
                    {crumb.to ? (
                      <Link to={crumb.to as any} className="text-admin-muted hover:text-admin-foreground transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-admin-foreground font-medium">{crumb.label}</span>
                    )}
                  </div>
                ))}
              </nav>
            )}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-admin-foreground mb-2">{title}</h1>
              {description && <p className="text-admin-muted text-lg">{description}</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="container-custom py-8">
        {children}
      </div>
    </div>
  );
}
