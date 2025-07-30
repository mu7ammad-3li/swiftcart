import { BaseService } from '../shared/BaseService';
import { QueryOptions } from '../shared/types';
import { 
  Order, 
  OrderResponse, 
  OrdersResponse, 
  OrderStats, 
  OrderStatsResponse,
  OrderStatus 
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

export class OrderQueryService extends BaseService {
  private readonly ordersCollection = 'orders';
  private readonly orderStatusUpdatesCollection = 'orderStatusUpdates';

  async getOrderById(id: string): Promise<OrderResponse> {
    return this.withErrorHandling(async () => {
      const docRef = doc(this.firestore, this.ordersCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Order with ID ${id} not found`,
          },
        };
      }

      return {
        success: true,
        data: this.formatOrderData(docSnap.data() as Order),
      };
    }, 'getOrderById');
  }

  async getOrders(options?: QueryOptions): Promise<OrdersResponse> {
    return this.withErrorHandling(async () => {
      let q = collection(this.firestore, this.ordersCollection);

      if (options?.filters) {
        Object.entries(options.filters).forEach(([field, value]) => {
          q = query(q, where(field, '==', value));
        });
      }

      if (options?.sort) {
        q = query(q, orderBy(options.sort.field, options.sort.direction));
      } else {
        // Default sort by createdAt descending
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
          this.formatOrderData({ id: doc.id, ...doc.data() } as Order)
        ),
      };
    }, 'getOrders');
  }

  async getCustomerOrders(customerId: string): Promise<OrdersResponse> {
    return this.withErrorHandling(async () => {
      const q = query(
        collection(this.firestore, this.ordersCollection),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      
      return {
        success: true,
        data: querySnapshot.docs.map(doc => 
          this.formatOrderData({ id: doc.id, ...doc.data() } as Order)
        ),
      };
    }, 'getCustomerOrders');
  }

  async getOrdersByStatus(status: OrderStatus): Promise<OrdersResponse> {
    return this.withErrorHandling(async () => {
      const q = query(
        collection(this.firestore, this.ordersCollection),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      
      return {
        success: true,
        data: querySnapshot.docs.map(doc => 
          this.formatOrderData({ id: doc.id, ...doc.data() } as Order)
        ),
      };
    }, 'getOrdersByStatus');
  }

  async getOrderStats(): Promise<OrderStatsResponse> {
    return this.withErrorHandling(async () => {
      const q = collection(this.firestore, this.ordersCollection);
      const querySnapshot = await getDocs(q);
      
      const stats: OrderStats = {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalRevenue: '0',
      };

      querySnapshot.docs.forEach(doc => {
        const order = doc.data() as Order;
        stats.totalOrders++;
        
        // Update status counts
        switch (order.status) {
          case 'pending':
            stats.pendingOrders++;
            break;
          case 'processing':
            stats.processingOrders++;
            break;
          case 'shipped':
            stats.shippedOrders++;
            break;
          case 'delivered':
            stats.deliveredOrders++;
            break;
          case 'cancelled':
            stats.cancelledOrders++;
            break;
        }

        // Update total revenue for delivered orders
        if (order.status === 'delivered') {
          const revenue = parseFloat(order.totalAmount.replace(/[^0-9.-]+/g, ''));
          const currentRevenue = parseFloat(stats.totalRevenue.replace(/[^0-9.-]+/g, ''));
          stats.totalRevenue = (currentRevenue + revenue).toFixed(2);
        }
      });

      return {
        success: true,
        data: stats,
      };
    }, 'getOrderStats');
  }

  private formatOrderData(order: Order): Order {
    return {
      ...order,
      createdAt: order.createdAt instanceof Timestamp 
        ? order.createdAt.toMillis() 
        : order.createdAt,
      updatedAt: order.updatedAt instanceof Timestamp 
        ? order.updatedAt.toMillis() 
        : order.updatedAt,
      estimatedDeliveryDate: order.estimatedDeliveryDate instanceof Timestamp 
        ? order.estimatedDeliveryDate.toMillis() 
        : order.estimatedDeliveryDate,
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