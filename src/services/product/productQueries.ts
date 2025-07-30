import { BaseService } from '../shared/BaseService';
import { QueryOptions } from '../shared/types';
import { Product, ProductResponse, ProductsResponse, ProductInventory, ProductInventoryResponse } from './types';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';

export class ProductQueryService extends BaseService {
  private readonly productsCollection = 'products';
  private readonly inventoryCollection = 'inventory';

  async getProductById(id: string): Promise<ProductResponse> {
    return this.withErrorHandling(async () => {
      const docRef = doc(this.firestore, this.productsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Product with ID ${id} not found`,
          },
        };
      }

      return {
        success: true,
        data: docSnap.data() as Product,
      };
    }, 'getProductById');
  }

  async getProductBySlug(slug: string): Promise<ProductResponse> {
    return this.withErrorHandling(async () => {
      const q = query(
        collection(this.firestore, this.productsCollection),
        where('slug', '==', slug),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Product with slug ${slug} not found`,
          },
        };
      }

      return {
        success: true,
        data: querySnapshot.docs[0].data() as Product,
      };
    }, 'getProductBySlug');
  }

  async getProducts(options?: QueryOptions): Promise<ProductsResponse> {
    return this.withErrorHandling(async () => {
      let q = collection(this.firestore, this.productsCollection);
      
      if (options?.filters) {
        Object.entries(options.filters).forEach(([field, value]) => {
          q = query(q, where(field, '==', value));
        });
      }

      if (options?.sort) {
        q = query(q, orderBy(options.sort.field, options.sort.direction));
      }

      if (options?.pagination) {
        q = query(q, limit(options.pagination.limit));
        if (options.pagination.page > 1) {
          // Implement pagination using startAfter
          // This is a simplified version - you might want to store the last doc
          const snapshot = await this.getPaginationSnapshot(q, options.pagination.page);
          if (snapshot) {
            q = query(q, startAfter(snapshot));
          }
        }
      }

      const querySnapshot = await getDocs(q);
      
      return {
        success: true,
        data: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product),
      };
    }, 'getProducts');
  }

  async getFeaturedProducts(limit: number = 4): Promise<ProductsResponse> {
    return this.withErrorHandling(async () => {
      const q = query(
        collection(this.firestore, this.productsCollection),
        where('featured', '==', true),
        limit
      );

      const querySnapshot = await getDocs(q);
      
      return {
        success: true,
        data: querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Product),
      };
    }, 'getFeaturedProducts');
  }

  async getProductInventory(productId: string): Promise<ProductInventoryResponse> {
    return this.withErrorHandling(async () => {
      const docRef = doc(this.firestore, this.inventoryCollection, productId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Inventory for product ${productId} not found`,
          },
        };
      }

      return {
        success: true,
        data: docSnap.data() as ProductInventory,
      };
    }, 'getProductInventory');
  }

  private async getPaginationSnapshot(
    q: any,
    page: number
  ): Promise<QuerySnapshot<DocumentData> | null> {
    try {
      const snapshot = await getDocs(q);
      const lastVisible = snapshot.docs[(page - 1) * 10 - 1];
      return lastVisible || null;
    } catch (error) {
      console.error('Error getting pagination snapshot:', error);
      return null;
    }
  }
} 