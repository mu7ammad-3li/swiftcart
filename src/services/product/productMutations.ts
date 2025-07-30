import { BaseService } from '../shared/BaseService';
import { 
  CreateProductDTO, 
  UpdateProductDTO, 
  ProductResponse, 
  ProductInventoryResponse 
} from './types';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

export class ProductMutationService extends BaseService {
  private readonly productsCollection = 'products';
  private readonly inventoryCollection = 'inventory';

  async createProduct(data: CreateProductDTO): Promise<ProductResponse> {
    return this.withErrorHandling(async () => {
      const productRef = doc(collection(this.firestore, this.productsCollection));
      const productData = {
        ...data,
        id: productRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(productRef, productData);

      return {
        success: true,
        data: productData,
      };
    }, 'createProduct');
  }

  async updateProduct(data: UpdateProductDTO): Promise<ProductResponse> {
    return this.withErrorHandling(async () => {
      const productRef = doc(this.firestore, this.productsCollection, data.id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(productRef, updateData);

      return {
        success: true,
        data: updateData,
      };
    }, 'updateProduct');
  }

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return this.withErrorHandling(async () => {
      const productRef = doc(this.firestore, this.productsCollection, id);
      await deleteDoc(productRef);

      // Also delete related inventory
      const inventoryRef = doc(this.firestore, this.inventoryCollection, id);
      await deleteDoc(inventoryRef);

      return { success: true };
    }, 'deleteProduct');
  }

  async updateInventory(
    productId: string, 
    quantity: number
  ): Promise<ProductInventoryResponse> {
    return this.withErrorHandling(async () => {
      const inventoryRef = doc(this.firestore, this.inventoryCollection, productId);
      const inventoryData = {
        productId,
        quantity,
        lastUpdated: Date.now(),
      };

      await setDoc(inventoryRef, inventoryData, { merge: true });

      return {
        success: true,
        data: inventoryData,
      };
    }, 'updateInventory');
  }
} 