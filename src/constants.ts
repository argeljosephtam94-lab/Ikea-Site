export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Cakes' | 'Desserts' | 'Meals' | 'Snacks' | 'Drinks';
  image: string;
  popular?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  // Cakes
  {
    id: 'c1',
    name: 'Classic Chocolate Cake',
    description: 'Rich, moist chocolate cake with signature fudge frosting.',
    price: 450,
    category: 'Cakes',
    image: 'https://picsum.photos/seed/chocolate-cake/400/400',
    popular: true,
  },
  {
    id: 'c2',
    name: 'Mango Bravo Cake',
    description: 'Fresh mangoes with light cream and chiffon layers.',
    price: 550,
    category: 'Cakes',
    image: 'https://picsum.photos/seed/mango-cake/400/400',
  },
  {
    id: 'c3',
    name: 'Ube Celebration Cake',
    description: 'Authentic purple yam flavor with macapuno strings.',
    price: 480,
    category: 'Cakes',
    image: 'https://picsum.photos/seed/ube-cake/400/400',
  },
  // Desserts
  {
    id: 'd1',
    name: 'Special Halo-Halo',
    description: 'The ultimate Filipino dessert with 12 ingredients and ice cream.',
    price: 120,
    category: 'Desserts',
    image: 'https://picsum.photos/seed/halo-halo/400/400',
    popular: true,
  },
  {
    id: 'd2',
    name: 'Ice Cream Scoop',
    description: 'Assorted local flavors: Ube, Cheese, Chocolate, Vanilla.',
    price: 45,
    category: 'Desserts',
    image: 'https://picsum.photos/seed/ice-cream/400/400',
  },
  // Meals
  {
    id: 'm1',
    name: 'Filipino Style Spaghetti',
    description: 'Sweet and savory sauce with hotdog slices and lots of cheese.',
    price: 85,
    category: 'Meals',
    image: 'https://picsum.photos/seed/spaghetti/400/400',
    popular: true,
  },
  {
    id: 'm2',
    name: 'Pancit Guisado',
    description: 'Stir-fried noodles with fresh vegetables and meat.',
    price: 150,
    category: 'Meals',
    image: 'https://picsum.photos/seed/pancit/400/400',
  },
  {
    id: 'm3',
    name: 'Pork Lumpia (10pcs)',
    description: 'Crispy fried spring rolls with sweet chili dip.',
    price: 120,
    category: 'Meals',
    image: 'https://picsum.photos/seed/lumpia/400/400',
    popular: true,
  },
  // Snacks
  {
    id: 's1',
    name: 'Special Empanada',
    description: 'Golden crust filled with savory meat and vegetables.',
    price: 35,
    category: 'Snacks',
    image: 'https://picsum.photos/seed/empanada/400/400',
    popular: true,
  },
  {
    id: 's2',
    name: 'Ham & Cheese Sandwich',
    description: 'Classic merienda favorite.',
    price: 55,
    category: 'Snacks',
    image: 'https://picsum.photos/seed/sandwich/400/400',
  },
  // Drinks
  {
    id: 'dr1',
    name: 'Mango Shake',
    description: 'Fresh Ormoc mangoes blended with milk.',
    price: 85,
    category: 'Drinks',
    image: 'https://picsum.photos/seed/mango-shake/400/400',
  },
  {
    id: 'dr2',
    name: 'Buko Pandan Shake',
    description: 'Refreshing coconut and pandan flavor.',
    price: 75,
    category: 'Drinks',
    image: 'https://picsum.photos/seed/buko-pandan/400/400',
  },
];
