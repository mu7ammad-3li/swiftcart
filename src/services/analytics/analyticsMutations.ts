import { BaseService } from '../shared/BaseService';
import {
  TrackingEvent,
  PageView,
  UserSession,
  TrackingEventResponse,
  PageViewResponse,
  UserSessionResponse
} from './types';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  FieldValue
} from 'firebase/firestore';

export class AnalyticsMutationService extends BaseService {
  private readonly eventsCollection = 'analytics_events';
  private readonly pageViewsCollection = 'analytics_pageviews';
  private readonly sessionsCollection = 'analytics_sessions';

  async trackEvent(event: Omit<TrackingEvent, 'id' | 'timestamp'>): Promise<TrackingEventResponse> {
    return this.withErrorHandling(async () => {
      const eventRef = doc(collection(this.firestore, this.eventsCollection));
      
      const eventData: TrackingEvent = {
        id: eventRef.id,
        timestamp: Date.now(),
        ...event
      };

      await setDoc(eventRef, eventData);

      return {
        success: true,
        data: eventData
      };
    }, 'trackEvent');
  }

  async trackPageView(
    pageView: Omit<PageView, 'id' | 'timestamp' | 'sessionId'>
  ): Promise<PageViewResponse> {
    return this.withErrorHandling(async () => {
      const pageViewRef = doc(collection(this.firestore, this.pageViewsCollection));
      const sessionId = await this.getOrCreateSession(pageView.userId);
      
      const pageViewData: PageView = {
        id: pageViewRef.id,
        sessionId,
        timestamp: Date.now(),
        ...pageView
      };

      await setDoc(pageViewRef, pageViewData);

      // Update session
      await this.updateSession(sessionId, {
        lastActivityTime: Date.now(),
        pageViews: increment(1) as unknown as number
      });

      return {
        success: true,
        data: pageViewData
      };
    }, 'trackPageView');
  }

  async updatePageViewDuration(
    pageViewId: string,
    duration: number
  ): Promise<PageViewResponse> {
    return this.withErrorHandling(async () => {
      const pageViewRef = doc(this.firestore, this.pageViewsCollection, pageViewId);
      
      await updateDoc(pageViewRef, { duration });

      return {
        success: true,
        data: {
          id: pageViewId,
          duration
        } as PageView
      };
    }, 'updatePageViewDuration');
  }

  async createSession(userId?: string): Promise<UserSessionResponse> {
    return this.withErrorHandling(async () => {
      const sessionRef = doc(collection(this.firestore, this.sessionsCollection));
      
      const sessionData: UserSession = {
        id: sessionRef.id,
        userId: userId || null,
        startTime: Date.now(),
        lastActivityTime: Date.now(),
        pageViews: 0,
        events: 0,
        isActive: true,
        deviceType: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        entryPage: typeof window !== 'undefined' ? window.location.pathname : '/'
      };

      await setDoc(sessionRef, sessionData);

      return {
        success: true,
        data: sessionData
      };
    }, 'createSession');
  }

  async updateSession(
    sessionId: string,
    updates: Partial<UserSession>
  ): Promise<UserSessionResponse> {
    return this.withErrorHandling(async () => {
      const sessionRef = doc(this.firestore, this.sessionsCollection, sessionId);
      
      await updateDoc(sessionRef, updates);

      return {
        success: true,
        data: {
          id: sessionId,
          ...updates
        } as UserSession
      };
    }, 'updateSession');
  }

  async endSession(sessionId: string): Promise<UserSessionResponse> {
    return this.withErrorHandling(async () => {
      const endTime = Date.now();
      const sessionRef = doc(this.firestore, this.sessionsCollection, sessionId);
      
      const updates: Partial<UserSession> = {
        endTime,
        isActive: false,
        exitPage: typeof window !== 'undefined' ? window.location.pathname : '/',
        duration: endTime - (await this.getSessionStartTime(sessionId))
      };

      await updateDoc(sessionRef, updates);

      return {
        success: true,
        data: {
          id: sessionId,
          ...updates
        } as UserSession
      };
    }, 'endSession');
  }

  private async getOrCreateSession(userId?: string): Promise<string> {
    if (typeof window === 'undefined') {
      return 'server-side';
    }

    const sessionId = localStorage.getItem('analytics_session_id');
    if (sessionId) {
      // Check if session is still valid (less than 30 minutes old)
      const lastActivity = localStorage.getItem('analytics_last_activity');
      const now = Date.now();
      if (lastActivity && now - parseInt(lastActivity) < 30 * 60 * 1000) {
        localStorage.setItem('analytics_last_activity', now.toString());
        return sessionId;
      }
    }

    // Create new session
    const result = await this.createSession(userId);
    if (result.success) {
      localStorage.setItem('analytics_session_id', result.data.id);
      localStorage.setItem('analytics_last_activity', Date.now().toString());
      return result.data.id;
    }

    // Fallback to temporary session ID if creation fails
    const tempSessionId = crypto.randomUUID();
    localStorage.setItem('analytics_session_id', tempSessionId);
    localStorage.setItem('analytics_last_activity', Date.now().toString());
    return tempSessionId;
  }

  private async getSessionStartTime(sessionId: string): Promise<number> {
    try {
      const sessionRef = doc(this.firestore, this.sessionsCollection, sessionId);
      const sessionDoc = await getDoc(sessionRef);
      if (sessionDoc.exists()) {
        const data = sessionDoc.data() as UserSession;
        return data.startTime;
      }
      return Date.now();
    } catch (error) {
      console.error('Error getting session start time:', error);
      return Date.now();
    }
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'server';
    
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getBrowser(): string {
    if (typeof window === 'undefined') return 'server';
    
    const ua = navigator.userAgent;
    const browserRegexes = {
      chrome: /chrome|chromium|crios/i,
      safari: /safari/i,
      firefox: /firefox|fxios/i,
      opera: /opera|opr/i,
      ie: /msie|trident/i,
      edge: /edg/i
    };

    for (const [browser, regex] of Object.entries(browserRegexes)) {
      if (regex.test(ua)) return browser;
    }
    return 'unknown';
  }

  private getOS(): string {
    if (typeof window === 'undefined') return 'server';
    
    const ua = navigator.userAgent;
    const osRegexes = {
      windows: /windows nt/i,
      mac: /macintosh|mac os x/i,
      linux: /linux/i,
      android: /android/i,
      ios: /iphone|ipad|ipod/i
    };

    for (const [os, regex] of Object.entries(osRegexes)) {
      if (regex.test(ua)) return os;
    }
    return 'unknown';
  }
} 