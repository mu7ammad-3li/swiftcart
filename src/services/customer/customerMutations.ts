import { BaseService } from '../shared/BaseService';
import {
  CreateCustomerDTO,
  UpdateCustomerDTO,
  Customer,
  CustomerResponse,
  AddressOperationResult,
  CustomerPreferences,
  CustomerStats,
  ShippingAddress
} from './types';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment,
  runTransaction
} from 'firebase/firestore';

export class CustomerMutationService extends BaseService {
  private readonly customersCollection = 'customers';

  async createCustomer(data: CreateCustomerDTO): Promise<CustomerResponse> {
    return this.withErrorHandling(async () => {
      const customerRef = doc(collection(this.firestore, this.customersCollection));
      
      const defaultPreferences: CustomerPreferences = {
        marketingEmails: true,
        orderNotifications: true,
        language: 'en',
        currency: 'EGP'
      };

      const defaultStats: CustomerStats = {
        totalOrders: 0,
        totalSpent: '0',
        averageOrderValue: '0',
        cancelledOrders: 0
      };

      const customerData: Customer = {
        id: customerRef.id,
        uid: data.uid,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        alternativePhone: data.alternativePhone,
        savedAddresses: [],
        preferences: { ...defaultPreferences, ...data.preferences },
        stats: defaultStats,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isActive: true
      };

      await setDoc(customerRef, customerData);

      return {
        success: true,
        data: customerData
      };
    }, 'createCustomer');
  }

  async updateCustomer(data: UpdateCustomerDTO): Promise<CustomerResponse> {
    return this.withErrorHandling(async () => {
      const customerRef = doc(this.firestore, this.customersCollection, data.id);
      const updateData = {
        ...data,
        updatedAt: Date.now()
      };

      await updateDoc(customerRef, updateData);

      return this.getUpdatedCustomer(data.id);
    }, 'updateCustomer');
  }

  async addShippingAddress(
    customerId: string,
    address: ShippingAddress
  ): Promise<AddressOperationResult> {
    return this.withErrorHandling(async () => {
      const customerRef = doc(this.firestore, this.customersCollection, customerId);
      
      await updateDoc(customerRef, {
        savedAddresses: arrayUnion(address),
        updatedAt: Date.now()
      });

      return {
        success: true,
        addressId: address.buildingNo // Using buildingNo as a unique identifier
      };
    }, 'addShippingAddress');
  }

  async removeShippingAddress(
    customerId: string,
    address: ShippingAddress
  ): Promise<AddressOperationResult> {
    return this.withErrorHandling(async () => {
      const customerRef = doc(this.firestore, this.customersCollection, customerId);
      
      await updateDoc(customerRef, {
        savedAddresses: arrayRemove(address),
        updatedAt: Date.now()
      });

      return {
        success: true,
        addressId: address.buildingNo
      };
    }, 'removeShippingAddress');
  }

  async setDefaultShippingAddress(
    customerId: string,
    address: ShippingAddress
  ): Promise<CustomerResponse> {
    return this.withErrorHandling(async () => {
      const customerRef = doc(this.firestore, this.customersCollection, customerId);
      
      await updateDoc(customerRef, {
        defaultShippingAddress: address,
        updatedAt: Date.now()
      });

      return this.getUpdatedCustomer(customerId);
    }, 'setDefaultShippingAddress');
  }

  async updateCustomerStats(
    customerId: string,
    orderAmount: string,
    isNewOrder: boolean = true,
    isCancelled: boolean = false
  ): Promise<CustomerResponse> {
    return this.withErrorHandling(async () => {
      const customerRef = doc(this.firestore, this.customersCollection, customerId);

      await runTransaction(this.firestore, async (transaction) => {
        const customerDoc = await transaction.get(customerRef);
        if (!customerDoc.exists()) {
          throw new Error(`Customer ${customerId} not found`);
        }

        const customer = customerDoc.data() as Customer;
        const currentTotal = parseFloat(customer.stats.totalSpent);
        const orderAmountNum = parseFloat(orderAmount);

        const updates: any = {
          updatedAt: Date.now()
        };

        if (isNewOrder) {
          updates['stats.totalOrders'] = increment(1);
          updates['stats.totalSpent'] = (currentTotal + orderAmountNum).toFixed(2);
          updates['stats.lastOrderDate'] = Date.now();
          updates['stats.averageOrderValue'] = (
            (currentTotal + orderAmountNum) / (customer.stats.totalOrders + 1)
          ).toFixed(2);
        }

        if (isCancelled) {
          updates['stats.cancelledOrders'] = increment(1);
        }

        transaction.update(customerRef, updates);
      });

      return this.getUpdatedCustomer(customerId);
    }, 'updateCustomerStats');
  }

  async deactivateCustomer(customerId: string): Promise<CustomerResponse> {
    return this.withErrorHandling(async () => {
      const customerRef = doc(this.firestore, this.customersCollection, customerId);
      
      await updateDoc(customerRef, {
        isActive: false,
        updatedAt: Date.now()
      });

      return this.getUpdatedCustomer(customerId);
    }, 'deactivateCustomer');
  }

  private async getUpdatedCustomer(customerId: string): Promise<CustomerResponse> {
    const customerRef = doc(this.firestore, this.customersCollection, customerId);
    const customerDoc = await getDoc(customerRef);

    if (!customerDoc.exists()) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Customer ${customerId} not found`
        }
      };
    }

    return {
      success: true,
      data: customerDoc.data() as Customer
    };
  }
} 