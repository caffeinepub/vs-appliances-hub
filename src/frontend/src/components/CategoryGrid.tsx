import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from './ui/card';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'ac',
    name: 'Air Conditioner',
    image: '/assets/generated/category-ac.dim_800x600.png',
    description: 'AC repair, maintenance & spare parts',
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    image: '/assets/generated/category-washing-machine.dim_800x600.png',
    description: 'Washing machine services & parts',
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    image: '/assets/generated/category-refrigerator.dim_800x600.png',
    description: 'Refrigerator repair & spare parts',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    image: '/assets/generated/category-electrical.dim_800x600.png',
    description: 'Electrical services & components',
  },
];

export default function CategoryGrid() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate({ to: '/register', search: { category: categoryId } });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="group cursor-pointer overflow-hidden border-2 hover:border-primary hover:shadow-lg transition-all duration-300"
          onClick={() => handleCategoryClick(category.id)}
        >
          <CardContent className="p-0">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
