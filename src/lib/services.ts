import { app, db, auth } from './firebase';
import { AnalyticsService } from '@/services/analytics';
import { BlogService } from '@/services/blog';
import { CustomerService } from '@/services/customer';
import { OrderService } from '@/services/order';
import { ProductService } from '@/services/product';

const serviceConfig = {
  firebaseApp: app,
  firestore: db,
  auth
};

let initialized = false;

// Initialize all services
export const initializeServices = () => {
  if (initialized) {
    console.warn('Services have already been initialized');
    return;
  }

  if (!app || !db || !auth) {
    throw new Error('Firebase services not properly initialized. Check your firebase.ts configuration.');
  }

  try {
    // Initialize services in dependency order
    console.log('Starting service initialization...');

    // 1. Initialize core services first (no dependencies)
    ProductService.initialize(serviceConfig);
    console.log('Product service initialized');

    BlogService.initialize(serviceConfig);
    console.log('Blog service initialized');

    CustomerService.initialize(serviceConfig);
    console.log('Customer service initialized');

    // 2. Initialize services with dependencies
    OrderService.initialize(serviceConfig);
    console.log('Order service initialized');

    // 3. Initialize analytics last as it might depend on other services
    AnalyticsService.initialize(serviceConfig);
    console.log('Analytics service initialized');

    initialized = true;
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
    throw error; // Re-throw to prevent app from running with uninitialized services
  }
};

// Check if services are initialized
export const areServicesInitialized = () => initialized;

// Export service instances for convenience
export const services = {
  analytics: () => {
    if (!initialized) throw new Error('Services not initialized. Call initializeServices() first.');
    return AnalyticsService.getInstance();
  },
  blog: () => {
    if (!initialized) throw new Error('Services not initialized. Call initializeServices() first.');
    return BlogService.getInstance();
  },
  customer: () => {
    if (!initialized) throw new Error('Services not initialized. Call initializeServices() first.');
    return CustomerService.getInstance();
  },
  order: () => {
    if (!initialized) throw new Error('Services not initialized. Call initializeServices() first.');
    return OrderService.getInstance();
  },
  product: () => {
    if (!initialized) throw new Error('Services not initialized. Call initializeServices() first.');
    return ProductService.getInstance();
  }
}; 