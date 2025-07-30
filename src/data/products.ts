export interface Product {
  slug: any;
  id: string;
  name: string;
  image: string;
  price: string; // Original price
  shortDescription: string;
  FreeDelivery: boolean;
  featured: boolean;
  onSale: boolean; // Flag to indicate if the product is on sale
  salePrice?: string; // Optional sale price (only relevant if onSale is true)
  details: {
    longDescription: string;
    features: string[];
    instructions: string[];
  };
}
