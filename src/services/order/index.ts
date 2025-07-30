import { BaseServiceConfig } from '../shared/BaseService';
import { OrderQueryService } from './orderQueries';
import { OrderMutationService } from './orderMutations';

export class OrderService {
  private static instance: OrderService;
  private queryService: OrderQueryService;
  private mutationService: OrderMutationService;

  private constructor(config: BaseServiceConfig) {
    this.queryService = new OrderQueryService(config);
    this.mutationService = new OrderMutationService(config);
    this.initializeMethods();
  }

  private initializeMethods(): void {
    // Query Methods
    this.getOrderById = this.queryService.getOrderById.bind(this.queryService);
    this.getOrders = this.queryService.getOrders.bind(this.queryService);
    this.getCustomerOrders = this.queryService.getCustomerOrders.bind(this.queryService);
    this.getOrdersByStatus = this.queryService.getOrdersByStatus.bind(this.queryService);
    this.getOrderStats = this.queryService.getOrderStats.bind(this.queryService);

    // Mutation Methods
    this.createOrder = this.mutationService.createOrder.bind(this.mutationService);
    this.updateOrder = this.mutationService.updateOrder.bind(this.mutationService);
    this.cancelOrder = this.mutationService.cancelOrder.bind(this.mutationService);
  }

  public static initialize(config: BaseServiceConfig): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService(config);
    }
    return OrderService.instance;
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      throw new Error('OrderService must be initialized before use');
    }
    return OrderService.instance;
  }

  // Query Methods
  public getOrderById!: typeof OrderQueryService.prototype.getOrderById;
  public getOrders!: typeof OrderQueryService.prototype.getOrders;
  public getCustomerOrders!: typeof OrderQueryService.prototype.getCustomerOrders;
  public getOrdersByStatus!: typeof OrderQueryService.prototype.getOrdersByStatus;
  public getOrderStats!: typeof OrderQueryService.prototype.getOrderStats;

  // Mutation Methods
  public createOrder!: typeof OrderMutationService.prototype.createOrder;
  public updateOrder!: typeof OrderMutationService.prototype.updateOrder;
  public cancelOrder!: typeof OrderMutationService.prototype.cancelOrder;
}

// Export types
export * from './types'; 