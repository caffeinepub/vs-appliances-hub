import { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';
import BrandLogo from './BrandLogo';
import ContactInfoCompact from './ContactInfoCompact';
import { BRANDING } from '../constants/branding';

export default function SiteHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Track Status', path: '/track' },
    { label: 'My Requests', path: '/my-requests' },
    { label: 'Admin Login', path: '/admin-login' },
  ];

  if (isAdmin) {
    navItems.push({ label: 'Admin', path: '/admin' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate({ to: '/' })}>
              <BrandLogo size="sm" />
              <span className="font-bold text-lg text-foreground hidden sm:inline">{BRANDING.companyName}</span>
            </div>
            <button
              onClick={() => navigate({ to: '/' })}
              className="hidden lg:flex flex-col items-start gap-1 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
            >
              <span className="hover:underline">{BRANDING.website}</span>
              <BrandLogo size="sm" className="h-[32px] w-[32px]" />
            </button>
          </div>

          {/* Desktop Navigation with Contact Info */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <ContactInfoCompact variant="header" mode="phone-email" emailLabel="Email us" />
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ContactInfoCompact variant="header" mode="phone-email" emailLabel="Email us" />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <button
                    onClick={() => {
                      navigate({ to: '/' });
                      setMobileMenuOpen(false);
                    }}
                    className="flex flex-col items-start gap-2 text-left text-base font-medium text-primary hover:opacity-80 transition-opacity"
                  >
                    <span className="hover:underline">{BRANDING.website}</span>
                    <BrandLogo size="sm" className="h-[36px] w-[36px]" />
                  </button>
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate({ to: item.path });
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left text-base font-medium transition-colors hover:text-primary ${
                        isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
