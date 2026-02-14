import CategoryGrid from '../components/CategoryGrid';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Wrench, Package, Clock, Shield, Phone } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { BRANDING } from '../constants/branding';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 flex justify-center">
              <BrandLogo size="lg" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              {BRANDING.companyName}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Professional <span className="text-primary font-semibold">Services</span> and Quality{' '}
              <span className="text-primary font-semibold">Spare Parts</span> for all your appliance needs
            </p>
            <div className="flex items-center justify-center gap-2 mb-8 text-lg">
              <Phone className="h-5 w-5 text-primary" />
              <a href={`tel:${BRANDING.phone}`} className="font-semibold text-primary hover:underline">
                {BRANDING.phone}
              </a>
            </div>
            <div className="flex flex-wrap gap-4 justify-center text-sm md:text-base text-muted-foreground mb-10">
              <span className="px-4 py-2 bg-background border border-border rounded-full">Air Conditioners</span>
              <span className="px-4 py-2 bg-background border border-border rounded-full">Washing Machines</span>
              <span className="px-4 py-2 bg-background border border-border rounded-full">Refrigerators</span>
              <span className="px-4 py-2 bg-background border border-border rounded-full">Geysers</span>
              <span className="px-4 py-2 bg-background border border-border rounded-full">Water Purifiers</span>
            </div>
            <Button size="lg" onClick={() => navigate({ to: '/register' })} className="text-lg px-8 py-6">
              Book Now
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select a category to register your service request or order spare parts
            </p>
          </div>
          <CategoryGrid />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Wrench className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Expert Services</h3>
            <p className="text-sm text-muted-foreground">Professional repair and maintenance by certified technicians</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Quality Spares</h3>
            <p className="text-sm text-muted-foreground">Genuine spare parts for all major appliance brands</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Quick Response</h3>
            <p className="text-sm text-muted-foreground">Fast turnaround time for all service requests</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">Trusted Service</h3>
            <p className="text-sm text-muted-foreground">Reliable and transparent service you can count on</p>
          </div>
        </div>
      </section>
    </div>
  );
}
