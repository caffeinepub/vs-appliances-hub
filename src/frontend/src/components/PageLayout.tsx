import { Outlet, useNavigate } from '@tanstack/react-router';
import SiteHeader from './SiteHeader';
import ContactInfoCompact from './ContactInfoCompact';
import { SiFacebook, SiX, SiInstagram } from 'react-icons/si';
import { Heart } from 'lucide-react';
import { BRANDING } from '../constants/branding';

export default function PageLayout() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'vs-appliances'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">{BRANDING.companyName}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Professional services and quality spare parts for all your appliance needs in {BRANDING.location}.
              </p>
              <div className="space-y-3 mb-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Phone:</strong> {BRANDING.phone}
                </p>
                <ContactInfoCompact variant="footer" />
              </div>
              <button
                onClick={() => navigate({ to: '/' })}
                className="text-sm font-medium text-primary hover:underline transition-colors"
              >
                {BRANDING.website}
              </button>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button onClick={() => navigate({ to: '/' })} className="hover:text-primary transition-colors">
                    Home
                  </button>
                </li>
                <li>
                  <a href="/services" className="hover:text-primary transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/track" className="hover:text-primary transition-colors">
                    Track Status
                  </a>
                </li>
                <li>
                  <a href="/admin-login" className="hover:text-primary transition-colors">
                    Admin Login
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <SiX className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <SiInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {currentYear} {BRANDING.companyName}. All rights reserved.
            </p>
            <p className="mt-2 flex items-center justify-center gap-1">
              Built with <Heart className="h-4 w-4 fill-primary text-primary" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
