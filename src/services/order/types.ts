import { ServiceResponse } from '../shared/types';
import { Product } from '../product/types';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  notes?: string;
}

export interface PaymentMethod {
  type: 'cash_on_delivery' | 'bank_transfer' | 'credit_card';
  details?: Record<string, string>;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: string;
  shippingFee: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  trackingNumber?: string;
  estimatedDeliveryDate?: number;
  notes?: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface CreateOrderDTO {
  customerId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderDTO {
  id: string;
  status?: OrderStatus;
  trackingNumber?: string;
  estimatedDeliveryDate?: number;
  notes?: string;
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  timestamp: number;
  note: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: string;
}

export type OrderResponse = ServiceResponse<Order>;
export type OrdersResponse = ServiceResponse<Order[]>;
export type OrderStatsResponse = ServiceResponse<OrderStats>; 