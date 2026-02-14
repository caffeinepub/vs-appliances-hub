import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from './ui/card';
import { ArrowRight } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../constants/serviceCategories';
import AppImage from './AppImage';

export default function CategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate({ to: '/register', search: { category: categoryId } });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {SERVICE_CATEGORIES.map((category) => (
        <Card
          key={category.id}
          className="group cursor-pointer overflow-hidden border-2 hover:border-primary hover:shadow-lg transition-all duration-300"
          onClick={() => handleCategoryClick(category.id)}
        >
          <CardContent className="p-0">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <AppImage
                src={category.image}
                alt={category.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                fallbackClassName="w-full h-full"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
              <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                Request Service
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
