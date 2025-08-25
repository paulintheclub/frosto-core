import { Product as DetailedProduct } from '@/components/client/product-details';

// This is the full, detailed product type used on the product page
export interface Product extends DetailedProduct {}

// This represents a category which can contain subcategories or products
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  subcategories?: Category[];
  products?: Product[];
}

export const categoriesData: Category[] = [
  {
    id: 'refrigeration-units',
    name: 'Refrigeration Units',
    slug: 'refrigeration-units',
    description: 'Commercial and industrial cooling systems',
    imageUrl: '/placeholder.svg?height=150&width=250&text=Refrigeration+Units',
    subcategories: [
      // ... other subcategories can be added here
    ],
  },
  {
    id: 'components',
    name: 'Components',
    slug: 'components',
    description: 'Essential parts for refrigeration systems',
    imageUrl: '/placeholder.svg?height=150&width=250&text=Components',
    subcategories: [
      {
        id: 'compressors',
        name: 'Compressors',
        slug: 'compressors',
        description: 'The heart of the refrigeration cycle',
        imageUrl: '/placeholder.svg?height=150&width=250&text=Compressors',
        products: [
          { 
            id: 1,
            name: 'Bitzer 4NES-20Y-40P semi-hermetic compressor',
            slug: 'bitzer-4nes-20y-40p',
            sku: '4NES-20Y-40P',
            mainImage: '/img.png',
            gallery: ['/img_1.png', '/img_2.png', '/img_3.png', '/img_4.png'],
            price: '€ 2,450.00',
            availability: 'In Stock',
            category: { name: 'Semi-Hermetic Compressors', href: '/categories/components/compressors' },
            brand: { name: 'Bitzer', href: '/brands-control/bitzer' },
            specImage: '/placeholder.svg?text=Spec+Image',
            includesImage: '/placeholder.svg?text=Includes+Image',
            accessories: [
                'Mounting bolts and sleeves',
                'Terminal box with cable gland',
                'Oil charge (POE)',
                'Built-in protection motor',
                'Inert gas charge (nitrogen)',
            ],
            catalogs: [
                { name: 'Product Catalog (PDF)', url: '#' },
                { name: 'Technical Manual (PDF)', url: '#' },
            ],
            relatedProducts: [],
            comments: [],
            imageUrl: '/img.png'
          },
          // You can add more detailed products here
        ],
      },
    ],
  },
];

