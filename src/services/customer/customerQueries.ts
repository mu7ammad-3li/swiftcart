import { BaseService } from '../shared/BaseService';
import { QueryOptions } from '../shared/types';
import {
  Customer,
  CustomerResponse,
  CustomersResponse,
  CustomerSearchFilters,
  CustomerStats,
  CustomerStatsResponse
} from './types';
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
  DocumentData,
  Timestamp
} from 'firebase/firestore';

export class CustomerQueryService extends BaseService {
  private readonly customersCollection = 'customers';

  async getCustomerById(id: string): Promise<CustomerResponse> {
    return this.withErrorHandling(async () => {
      const docRef = doc(this.firestore, this.customersCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Customer with ID ${id} not found`,
          },
        };
      }

      return {
        success: true,
        data: this.formatCustomerData(docSnap.data() as Customer),
      };
    }, 'getCustomerById');
  }

  async getCustomerByUid(uid: string): Promise<CustomerResponse> {
    return this.withErrorHandling(async () => {
      const q = query(
        collection(this.firestore, this.customersCollection),
        where('uid', '==', uid),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Customer with UID ${uid} not found`,
          },
        };
      }

      return {
        success: true,
        data: this.formatCustomerData(querySnapshot.docs[0].data() as Customer),
      };
    }, 'getCustomerByUid');
  }

  async getCustomers(options?: QueryOptions<CustomerSearchFilters>): Promise<CustomersResponse> {
    return this.withErrorHandling(async () => {
      let q = collection(this.firestore, this.customersCollection);

      if (options?.filters) {
        const { isActive, minTotalOrders, minTotalSpent, createdAfter, createdBefore } = options.filters;
        
        if (typeof isActive === 'boolean') {
          q = query(q, where('isActive', '==', isActive));
        }
        
        if (minTotalOrders) {
          q = query(q, where('stats.totalOrders', '>=', minTotalOrders));
        }
        
        if (minTotalSpent) {
          q = query(q, where('stats.totalSpent', '>=', minTotalSpent.toString()));
        }
        
        if (createdAfter) {
          q = query(q, where('createdAt', '>=', createdAfter));
        }
        
        if (createdBefore) {
          q = query(q, where('createdAt', '<=', createdBefore));
        }
      }

      if (options?.sort) {
        q = query(q, orderBy(options.sort.field, options.sort.direction));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      if (options?.pagination) {
        q = query(q, limit(options.pagination.limit));
        if (options.pagination.page > 1) {
          const snapshot = await this.getPaginationSnapshot(q, options.pagination.page);
          if (snapshot) {
            q = query(q, startAfter(snapshot));
          }
        }
      }

      const querySnapshot = await getDocs(q);
      
      return {
        success: true,
        data: querySnapshot.docs.map(doc => 
          this.formatCustomerData({ id: doc.id, ...doc.data() } as Customer)
        ),
      };
    }, 'getCustomers');
  }

  async getCustomerStats(customerId: string): Promise<CustomerStatsResponse> {
    return this.withErrorHandling(async () => {
      const docRef = doc(this.firestore, this.customersCollection, customerId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Customer with ID ${customerId} not found`,
          },
        };
      }

      const customer = docSnap.data() as Customer;
      return {
        success: true,
        data: customer.stats,
      };
    }, 'getCustomerStats');
  }

  private formatCustomerData(customer: Customer): Customer {
    return {
      ...customer,
      createdAt: customer.createdAt instanceof Timestamp 
        ? customer.createdAt.toMillis() 
        : customer.createdAt,
      updatedAt: customer.updatedAt instanceof Timestamp 
        ? customer.updatedAt.toMillis() 
        : customer.updatedAt,
      lastLoginAt: customer.lastLoginAt instanceof Timestamp 
        ? customer.lastLoginAt.toMillis() 
        : customer.lastLoginAt,
    };
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