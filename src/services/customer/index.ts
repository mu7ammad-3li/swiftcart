import { BaseServiceConfig } from '../shared/BaseService';
import { CustomerQueryService } from './customerQueries';
import { CustomerMutationService } from './customerMutations';

export class CustomerService {
  private static instance: CustomerService;
  private queryService: CustomerQueryService;
  private mutationService: CustomerMutationService;

  private constructor(config: BaseServiceConfig) {
    this.queryService = new CustomerQueryService(config);
    this.mutationService = new CustomerMutationService(config);
    this.initializeMethods();
  }

  private initializeMethods(): void {
    // Query Methods
    this.getCustomerById = this.queryService.getCustomerById.bind(this.queryService);
    this.getCustomerByUid = this.queryService.getCustomerByUid.bind(this.queryService);
    this.getCustomers = this.queryService.getCustomers.bind(this.queryService);
    this.getCustomerStats = this.queryService.getCustomerStats.bind(this.queryService);

    // Mutation Methods
    this.createCustomer = this.mutationService.createCustomer.bind(this.mutationService);
    this.updateCustomer = this.mutationService.updateCustomer.bind(this.mutationService);
    this.addShippingAddress = this.mutationService.addShippingAddress.bind(this.mutationService);
    this.removeShippingAddress = this.mutationService.removeShippingAddress.bind(this.mutationService);
    this.setDefaultShippingAddress = this.mutationService.setDefaultShippingAddress.bind(this.mutationService);
    this.updateCustomerStats = this.mutationService.updateCustomerStats.bind(this.mutationService);
    this.deactivateCustomer = this.mutationService.deactivateCustomer.bind(this.mutationService);
  }

  public static initialize(config: BaseServiceConfig): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService(config);
    }
    return CustomerService.instance;
  }

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      throw new Error('CustomerService must be initialized before use');
    }
    return CustomerService.instance;
  }

  // Query Methods
  public getCustomerById!: typeof CustomerQueryService.prototype.getCustomerById;
  public getCustomerByUid!: typeof CustomerQueryService.prototype.getCustomerByUid;
  public getCustomers!: typeof CustomerQueryService.prototype.getCustomers;
  public getCustomerStats!: typeof CustomerQueryService.prototype.getCustomerStats;

  // Mutation Methods
  public createCustomer!: typeof CustomerMutationService.prototype.createCustomer;
  public updateCustomer!: typeof CustomerMutationService.prototype.updateCustomer;
  public addShippingAddress!: typeof CustomerMutationService.prototype.addShippingAddress;
  public removeShippingAddress!: typeof CustomerMutationService.prototype.removeShippingAddress;
  public setDefaultShippingAddress!: typeof CustomerMutationService.prototype.setDefaultShippingAddress;
  public updateCustomerStats!: typeof CustomerMutationService.prototype.updateCustomerStats;
  public deactivateCustomer!: typeof CustomerMutationService.prototype.deactivateCustomer;
}

// Export types
export * from './types'; 