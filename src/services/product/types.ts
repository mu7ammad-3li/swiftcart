import { ServiceResponse } from '../shared/types';

export interface ProductFeature {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

export interface ProductDetails {
  longDescription: string;
  features: string[];
  instructions: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  salePrice?: string;
  onSale: boolean;
  shortDescription: string;
  image: string;
  FreeDelivery: boolean;
  featured: boolean;
  details: ProductDetails;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: string;
  inStock: boolean;
}

export interface ProductInventory {
  productId: string;
  quantity: number;
  lastUpdated: number;
}

export interface CreateProductDTO {
  name: string;
  slug: string;
  price: string;
  shortDescription: string;
  details: ProductDetails;
  image: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}

export type ProductResponse = ServiceResponse<Product>;
export type ProductsResponse = ServiceResponse<Product[]>;
export type ProductInventoryResponse = ServiceResponse<ProductInventory>; 