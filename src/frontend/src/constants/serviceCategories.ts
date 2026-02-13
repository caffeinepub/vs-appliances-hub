export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Category images mapping:
// - ac: Wall-mounted AC unit (IMG_20260213_094441.jpg)
// - washing-machine: Front-load washing machine (IMG_20260213_094525.jpg)
// - refrigerator: Side-by-side refrigerator (IMG_20260213_094503.jpg)
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'ac',
    name: 'Air Conditioner',
    description: 'AC repair, maintenance & spare parts',
    image: '/assets/generated/category-ac.v2.dim_800x600.png',
  },
  {
    id: 'washing-machine',
    name: 'Washing Machine',
    description: 'Washing machine services & parts',
    image: '/assets/generated/category-washing-machine.v2.dim_800x600.png',
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    description: 'Refrigerator repair & spare parts',
    image: '/assets/generated/category-refrigerator.v2.dim_800x600.png',
  },
  {
    id: 'electrical',
    name: 'Electrical',
    description: 'Electrical services & components',
    image: '/assets/generated/category-electrical.dim_800x600.png',
  },
  {
    id: 'geyser',
    name: 'Geyser',
    description: 'Geyser repair & maintenance services',
    image: '/assets/generated/category-geyser.dim_800x600.png',
  },
  {
    id: 'water-purifier',
    name: 'Water Purifier',
    description: 'Water purifier services & filters',
    image: '/assets/generated/category-water-purifier.dim_800x600.png',
  },
];

export function getCategoryById(id: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find(cat => cat.id === id);
}

export function getCategoryName(id: string): string {
  const category = getCategoryById(id);
  return category ? category.name : id;
}
