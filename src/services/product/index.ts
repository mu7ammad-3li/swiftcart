import { BaseServiceConfig } from '../shared/BaseService';
import { ProductQueryService } from './productQueries';
import { ProductMutationService } from './productMutations';

export class ProductService {
  private static instance: ProductService;
  private queryService: ProductQueryService;
  private mutationService: ProductMutationService;

  private constructor(config: BaseServiceConfig) {
    this.queryService = new ProductQueryService(config);
    this.mutationService = new ProductMutationService(config);
    this.initializeMethods();
  }

  private initializeMethods(): void {
    // Query Methods
    this.getProductById = this.queryService.getProductById.bind(this.queryService);
    this.getProductBySlug = this.queryService.getProductBySlug.bind(this.queryService);
    this.getProducts = this.queryService.getProducts.bind(this.queryService);
    this.getFeaturedProducts = this.queryService.getFeaturedProducts.bind(this.queryService);
    this.getProductInventory = this.queryService.getProductInventory.bind(this.queryService);

    // Mutation Methods
    this.createProduct = this.mutationService.createProduct.bind(this.mutationService);
    this.updateProduct = this.mutationService.updateProduct.bind(this.mutationService);
    this.deleteProduct = this.mutationService.deleteProduct.bind(this.mutationService);
    this.updateInventory = this.mutationService.updateInventory.bind(this.mutationService);
  }

  public static initialize(config: BaseServiceConfig): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService(config);
    }
    return ProductService.instance;
  }

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      throw new Error('ProductService must be initialized before use');
    }
    return ProductService.instance;
  }

  // Query Methods
  public getProductById!: typeof ProductQueryService.prototype.getProductById;
  public getProductBySlug!: typeof ProductQueryService.prototype.getProductBySlug;
  public getProducts!: typeof ProductQueryService.prototype.getProducts;
  public getFeaturedProducts!: typeof ProductQueryService.prototype.getFeaturedProducts;
  public getProductInventory!: typeof ProductQueryService.prototype.getProductInventory;

  // Mutation Methods
  public createProduct!: typeof ProductMutationService.prototype.createProduct;
  public updateProduct!: typeof ProductMutationService.prototype.updateProduct;
  public deleteProduct!: typeof ProductMutationService.prototype.deleteProduct;
  public updateInventory!: typeof ProductMutationService.prototype.updateInventory;
}

// Export types
export * from './types'; 