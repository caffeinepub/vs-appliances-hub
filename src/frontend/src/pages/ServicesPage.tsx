import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';

export default function ServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Our Services</h1>
          <p className="text-lg text-muted-foreground">
            We provide professional repair, maintenance, and spare parts for all major home appliances
          </p>
        </div>

        <div className="space-y-6">
          {SERVICE_CATEGORIES.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{category.name}</CardTitle>
                    <CardDescription className="text-base">{category.description}</CardDescription>
                  </div>
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    decoding="async"
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      console.error(`Failed to load image: ${category.image}`);
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate({ to: '/register', search: { category: category.id } })}
                  className="w-full sm:w-auto"
                >
                  Request Service
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
