import { Outlet } from '@tanstack/react-router';
import SiteHeader from './SiteHeader';
import { SiFacebook, SiInstagram, SiX } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function PageLayout() {
  const appIdentifier = encodeURIComponent(window.location.hostname || 'vs-appliances-hub');
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-muted/30 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">VS Appliances Hub</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your trusted partner for appliance services and spare parts. We specialize in AC, Washing Machines, Refrigerators, and Electrical services.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="/register" className="hover:text-primary transition-colors">Register Request</a></li>
                <li><a href="/my-requests" className="hover:text-primary transition-colors">My Requests</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-foreground">Connect With Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                  <SiFacebook size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                  <SiInstagram size={20} />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="X (Twitter)">
                  <SiX size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1.5 flex-wrap">
              © {currentYear} VS Appliances Hub. Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
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
