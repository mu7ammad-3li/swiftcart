import { BaseService } from '../shared/BaseService';
import { PageViewEvent } from './types';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export class PageTrackingService extends BaseService {
  private readonly collectionName = 'pageViews';

  async trackPageView(path: string, title: string): Promise<void> {
    const event: PageViewEvent = {
      path,
      title,
      timestamp: Date.now(),
    };

    return this.withErrorHandling(async () => {
      await addDoc(collection(this.firestore, this.collectionName), event);
    }, 'trackPageView');
  }

  async getPageViews(path?: string): Promise<PageViewEvent[]> {
    return this.withErrorHandling(async () => {
      const pageViewsRef = collection(this.firestore, this.collectionName);
      const q = path 
        ? query(pageViewsRef, where('path', '==', path))
        : query(pageViewsRef);
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as PageViewEvent);
    }, 'getPageViews');
  }

  async getMostViewedPages(limit: number = 10): Promise<Array<{ path: string; views: number }>> {
    return this.withErrorHandling(async () => {
      const pageViews = await this.getPageViews();
      const viewCounts = pageViews.reduce((acc, view) => {
        acc[view.path] = (acc[view.path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(viewCounts)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    }, 'getMostViewedPages');
  }
} 