import { Link, useNavigate } from '@tanstack/react-router';
import LoginButton from './LoginButton';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/assets/generated/vs-appliances-logo-uploaded.dim_512x512.png"
              alt="VS Appliances Hub"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-xl text-foreground hidden sm:inline">VS Appliances Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Register Request
            </Link>
            <Link
              to="/my-requests"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My Requests
            </Link>
            {!isAdminLoading && isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            )}
            <LoginButton />
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <LoginButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register Request
              </Link>
              <Link
                to="/my-requests"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Requests
              </Link>
              {!isAdminLoading && isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
