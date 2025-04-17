export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  brand: string;
  tags: string[];
  rating: number;
  stock: number;
  createdAt: string;
  imageUrl: string;
}

// Generate realistic product dataset
function generateProducts(count: number): Product[] {
  const categories = [
    'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 
    'Sports', 'Beauty', 'Toys', 'Automotive', 'Health'
  ];
  
  const brands = [
    'TechMaster', 'StyleCo', 'HomeEssentials', 'BookWorm', 
    'SportsPro', 'BeautyGlow', 'ToyWorld', 'AutoParts', 'HealthFirst'
  ];
  
  const adjectives = [
    'Premium', 'Deluxe', 'Advanced', 'Compact', 'Professional', 
    'Portable', 'Smart', 'Ultra', 'Ergonomic', 'Lightweight'
  ];
  
  const nouns = [
    'Laptop', 'Shirt', 'Blender', 'Novel', 'Sneakers', 
    'Moisturizer', 'Action Figure', 'Headlight', 'Vitamins'
  ];
  
  const tags = [
    'new', 'bestseller', 'sale', 'trending', 'premium', 
    'eco-friendly', 'limited-edition', 'handmade', 'imported'
  ];

  return Array(count).fill(null).map((_, index) => {
    const id = `prod-${index + 1}`;
    const categoryIndex = index % categories.length;
    const category = categories[categoryIndex];
    const brand = brands[categoryIndex];
    
    const adjectiveIndex = Math.floor(Math.random() * adjectives.length);
    const adjective = adjectives[adjectiveIndex];
    const noun = nouns[categoryIndex % nouns.length];
    
    const name = `${adjective} ${brand} ${noun}`;
    
    // Generate 2-5 random tags
    const productTags: string[] = [];
    const tagCount = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < tagCount; i++) {
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      if (!productTags.includes(randomTag)) {
        productTags.push(randomTag);
      }
    }
    
    // Generate a realistic description
    const features = [
      'High quality materials',
      'Easy to use',
      'Durable construction',
      'Modern design',
      'Energy efficient',
      'Multifunctional',
      'Eco-friendly',
      'Compact size',
      'Versatile usage'
    ];
    
    const randomFeatures: string[] = [];
    const featureCount = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < featureCount; i++) {
      const randomFeature = features[Math.floor(Math.random() * features.length)];
      if (!randomFeatures.includes(randomFeature)) {
        randomFeatures.push(randomFeature);
      }
    }
    
    const description = `The ${name} is a high-quality ${category.toLowerCase()} product from ${brand}. ${randomFeatures.join('. ')}. Perfect for everyday use and makes a great gift.`;
    
    return {
      id,
      name,
      description,
      category,
      price: Math.floor(Math.random() * 900) + 100, // $100-$999
      brand,
      tags: productTags,
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0
      stock: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      imageUrl: `https://picsum.photos/seed/${id}/300/300`
    };
  });
}

export const products: Product[] = generateProducts(200);

export const categories = [...new Set(products.map(product => product.category))];
export const brands = [...new Set(products.map(product => product.brand))];
export const tags = [...new Set(products.flatMap(product => product.tags))]; 