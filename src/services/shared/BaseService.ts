import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

export interface BaseServiceConfig {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export abstract class BaseService {
  protected firebaseApp: FirebaseApp;
  protected firestore: Firestore;
  protected auth: Auth;

  constructor(config: BaseServiceConfig) {
    this.firebaseApp = config.firebaseApp;
    this.firestore = config.firestore;
    this.auth = config.auth;
  }

  protected handleError(error: unknown, context: string): never {
    console.error(`Error in ${context}:`, error);
    throw error;
  }

  protected async withErrorHandling<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      return this.handleError(error, context);
    }
  }
} 