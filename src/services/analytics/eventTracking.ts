import { BaseService } from '../shared/BaseService';
import { ButtonClickEvent, SectionViewEvent, UserInteractionEvent } from './types';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export class EventTrackingService extends BaseService {
  private readonly buttonClicksCollection = 'buttonClicks';
  private readonly sectionViewsCollection = 'sectionViews';
  private readonly userInteractionsCollection = 'userInteractions';

  async trackButtonClick(
    buttonId: string,
    section: string,
    productId?: string
  ): Promise<void> {
    const event: ButtonClickEvent = {
      buttonId,
      section,
      productId,
      timestamp: Date.now(),
    };

    return this.withErrorHandling(async () => {
      await addDoc(collection(this.firestore, this.buttonClicksCollection), event);
    }, 'trackButtonClick');
  }

  async trackSectionView(
    sectionName: string,
    sectionId: string,
    path: string
  ): Promise<void> {
    const event: SectionViewEvent = {
      sectionName,
      sectionId,
      path,
      timestamp: Date.now(),
    };

    return this.withErrorHandling(async () => {
      await addDoc(collection(this.firestore, this.sectionViewsCollection), event);
    }, 'trackSectionView');
  }

  async trackUserInteraction(
    eventType: string,
    elementId: string,
    value?: string | number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const event: UserInteractionEvent = {
      eventType,
      elementId,
      value,
      metadata,
      timestamp: Date.now(),
    };

    return this.withErrorHandling(async () => {
      await addDoc(collection(this.firestore, this.userInteractionsCollection), event);
    }, 'trackUserInteraction');
  }

  async getMostClickedButtons(timeframe: number = 7 * 24 * 60 * 60 * 1000): Promise<ButtonClickEvent[]> {
    return this.withErrorHandling(async () => {
      const cutoffTime = Date.now() - timeframe;
      const clicksRef = collection(this.firestore, this.buttonClicksCollection);
      const q = query(
        clicksRef,
        where('timestamp', '>', cutoffTime),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as ButtonClickEvent);
    }, 'getMostClickedButtons');
  }

  async getSectionViewStats(path: string): Promise<SectionViewEvent[]> {
    return this.withErrorHandling(async () => {
      const viewsRef = collection(this.firestore, this.sectionViewsCollection);
      const q = query(viewsRef, where('path', '==', path));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as SectionViewEvent);
    }, 'getSectionViewStats');
  }
} 