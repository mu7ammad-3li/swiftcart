import { BaseService } from '../shared/BaseService';
import { 
  CreateOrderDTO, 
  UpdateOrderDTO, 
  Order, 
  OrderResponse,
  OrderStatusUpdate
} from './types';
import { 
  collection, 
  doc, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  increment,
  runTransaction
} from 'firebase/firestore';
import { ProductService } from '../product';

export class OrderMutationService extends BaseService {
  private readonly ordersCollection = 'orders';
  private readonly orderStatusUpdatesCollection = 'orderStatusUpdates';
  private productService: ProductService;

  constructor(config: any) {
    super(config);
    // Get ProductService instance after ensuring it's initialized
    try {
      this.productService = ProductService.getInstance();
    } catch (error) {
      console.error('Failed to get ProductService instance:', error);
      throw new Error('ProductService must be initialized before OrderService');
    }
  }

  async createOrder(data: CreateOrderDTO): Promise<OrderResponse> {
    return this.withErrorHandling(async () => {
      const orderRef = doc(collection(this.firestore, this.ordersCollection));
      
      // Calculate total amount and validate inventory
      let totalAmount = 0;
      for (const item of data.items) {
        const productResponse = await this.productService.getProductById(item.productId);
        if (!productResponse.success || !productResponse.data) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const product = productResponse.data;
        const price = parseFloat(product.onSale ? (product.salePrice || product.price) : product.price);
        totalAmount += price * item.quantity;

        // Validate inventory
        const inventoryResponse = await this.productService.getProductInventory(item.productId);
        if (inventoryResponse.success && inventoryResponse.data) {
          if (inventoryResponse.data.quantity < item.quantity) {
            throw new Error(`Insufficient inventory for product ${product.name}`);
          }
        }
      }

      // Calculate shipping fee (example logic)
      const shippingFee = totalAmount > 499 ? '0' : '50';

      const orderData: Order = {
        id: orderRef.id,
        customerId: data.customerId,
        items: data.items,
        totalAmount: totalAmount.toFixed(2),
        shippingFee,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod
      };

      // Create the order
      await setDoc(orderRef, orderData);

      // Update inventory for each item
      for (const item of data.items) {
        await this.productService.updateInventory(item.productId, -item.quantity);
      }

      // Create initial status update
      await this.createOrderStatusUpdate(orderRef.id, {
        status: 'pending',
        note: 'Order created successfully',
        timestamp: Date.now()
      });

      return {
        success: true,
        data: orderData
      };
    }, 'createOrder');
  }

  async updateOrder(data: UpdateOrderDTO): Promise<OrderResponse> {
    return this.withErrorHandling(async () => {
      const orderRef = doc(this.firestore, this.ordersCollection, data.id);
      
      // Get the current order data
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error(`Order ${data.id} not found`);
      }
      
      const currentOrder = orderDoc.data() as Order;
      const updateData: Partial<Order> = {
        ...currentOrder,
        ...data,
        updatedAt: Date.now()
      };

      await updateDoc(orderRef, updateData);

      return {
        success: true,
        data: updateData as Order
      };
    }, 'updateOrder');
  }

  async cancelOrder(orderId: string, reason: string): Promise<OrderResponse> {
    return this.withErrorHandling(async () => {
      const orderRef = doc(this.firestore, this.ordersCollection, orderId);
      
      // Get the current order data
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        throw new Error(`Order ${orderId} not found`);
      }
      
      const order = orderDoc.data() as Order;
      if (order.status === 'delivered') {
        throw new Error('Cannot cancel a delivered order');
      }

      // Update order status
      const updateData: Partial<Order> = {
        ...order,
        status: 'cancelled',
        updatedAt: Date.now(),
        notes: reason
      };

      await updateDoc(orderRef, updateData);

      // Restore inventory
      for (const item of order.items) {
        await this.productService.updateInventory(item.productId, item.quantity);
      }

      // Create status update
      await this.createOrderStatusUpdate(orderId, {
        status: 'cancelled',
        note: reason,
        timestamp: Date.now()
      });

      return {
        success: true,
        data: updateData as Order
      };
    }, 'cancelOrder');
  }

  async deleteOrder(id: string): Promise<{ success: boolean }> {
    return this.withErrorHandling(async () => {
      const orderRef = doc(this.firestore, this.ordersCollection, id);
      await deleteDoc(orderRef);
      return { success: true };
    }, 'deleteOrder');
  }

  private async createOrderStatusUpdate(
    orderId: string,
    statusUpdate: OrderStatusUpdate
  ): Promise<void> {
    const statusUpdateRef = doc(collection(
      this.firestore,
      this.ordersCollection,
      orderId,
      this.orderStatusUpdatesCollection
    ));

    await setDoc(statusUpdateRef, statusUpdate);
  }
} 