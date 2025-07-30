import { BaseService } from '../shared/BaseService';
import {
  TrackingEvent,
  PageView,
  UserSession,
  AnalyticsReport,
  AnalyticsTimeframe,
  PageViewStats,
  EventStats,
  UserStats,
  EventCategory,
  EventAction,
  TrackingEventResponse,
  PageViewResponse,
  UserSessionResponse,
  AnalyticsReportResponse
} from './types';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';

export class AnalyticsQueryService extends BaseService {
  private readonly eventsCollection = 'analytics_events';
  private readonly pageViewsCollection = 'analytics_pageviews';
  private readonly sessionsCollection = 'analytics_sessions';

  async getEvent(id: string): Promise<TrackingEventResponse> {
    return this.withErrorHandling(async () => {
      const docRef = doc(this.firestore, this.eventsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Event with ID ${id} not found`,
          },
        };
      }

      return {
        success: true,
        data: this.formatEventData(docSnap.data() as TrackingEvent),
      };
    }, 'getEvent');
  }

  async getPageView(id: string): Promise<PageViewResponse> {
    return this.withErrorHandling(async () => {
      const docRef = doc(this.firestore, this.pageViewsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Page view with ID ${id} not found`,
          },
        };
      }

      return {
        success: true,
        data: this.formatPageViewData(docSnap.data() as PageView),
      };
    }, 'getPageView');
  }

  async getUserSession(id: string): Promise<UserSessionResponse> {
    return this.withErrorHandling(async () => {
      const docRef = doc(this.firestore, this.sessionsCollection, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Session with ID ${id} not found`,
          },
        };
      }

      return {
        success: true,
        data: this.formatSessionData(docSnap.data() as UserSession),
      };
    }, 'getUserSession');
  }

  async getAnalyticsReport(timeframe: AnalyticsTimeframe): Promise<AnalyticsReportResponse> {
    return this.withErrorHandling(async () => {
      const [pageViewStats, eventStats, userStats] = await Promise.all([
        this.getPageViewStats(timeframe),
        this.getEventStats(timeframe),
        this.getUserStats(timeframe)
      ]);

      const report: AnalyticsReport = {
        timeframe,
        pageViews: pageViewStats,
        events: eventStats,
        users: userStats
      };

      return {
        success: true,
        data: report
      };
    }, 'getAnalyticsReport');
  }

  private async getPageViewStats(timeframe: AnalyticsTimeframe): Promise<PageViewStats> {
    const pageViewsQuery = query(
      collection(this.firestore, this.pageViewsCollection),
      where('timestamp', '>=', timeframe.startDate),
      where('timestamp', '<=', timeframe.endDate)
    );

    const querySnapshot = await getDocs(pageViewsQuery);
    const pageViews = querySnapshot.docs.map(doc => 
      this.formatPageViewData(doc.data() as PageView)
    );

    // Calculate unique visitors
    const uniqueVisitors = new Set(pageViews.map(pv => pv.sessionId)).size;

    // Calculate average time on page
    const validDurations = pageViews
      .filter(pv => pv.duration !== undefined)
      .map(pv => pv.duration as number);
    const averageTimeOnPage = validDurations.length > 0
      ? validDurations.reduce((a, b) => a + b, 0) / validDurations.length
      : 0;

    // Calculate bounce rate (sessions with only one page view)
    const sessionPageCounts = pageViews.reduce((acc, pv) => {
      acc[pv.sessionId] = (acc[pv.sessionId] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    const bounceRate = Object.values(sessionPageCounts)
      .filter(count => count === 1).length / Object.keys(sessionPageCounts).length;

    // Get top pages
    const pageStats = pageViews.reduce((acc, pv) => {
      if (!acc[pv.path]) {
        acc[pv.path] = { views: 0, totalTime: 0 };
      }
      acc[pv.path].views++;
      acc[pv.path].totalTime += pv.duration || 0;
      return acc;
    }, {} as { [key: string]: { views: number; totalTime: number } });

    const topPages = Object.entries(pageStats)
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        averageTime: stats.totalTime / stats.views
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Calculate device breakdown
    const deviceBreakdown = pageViews.reduce(
      (acc, pv) => {
        acc[pv.deviceType.toLowerCase() as keyof typeof acc]++;
        return acc;
      },
      { desktop: 0, mobile: 0, tablet: 0 }
    );

    // Get traffic sources
    const trafficSources = Object.entries(
      pageViews.reduce((acc, pv) => {
        const source = pv.referrer || 'direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    )
      .map(([source, visits]) => ({ source, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);

    return {
      totalViews: pageViews.length,
      uniqueVisitors,
      averageTimeOnPage,
      bounceRate,
      topPages,
      deviceBreakdown,
      trafficSources
    };
  }

  private async getEventStats(timeframe: AnalyticsTimeframe): Promise<EventStats> {
    const eventsQuery = query(
      collection(this.firestore, this.eventsCollection),
      where('timestamp', '>=', timeframe.startDate),
      where('timestamp', '<=', timeframe.endDate)
    );

    const querySnapshot = await getDocs(eventsQuery);
    const events = querySnapshot.docs.map(doc => 
      this.formatEventData(doc.data() as TrackingEvent)
    );

    // Calculate unique users
    const uniqueUsers = new Set(events.map(e => e.userId).filter(Boolean)).size;

    // Calculate category breakdown
    const categoryBreakdown = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as { [key in EventCategory]?: number });

    // Get top events
    const eventCounts = events.reduce((acc, event) => {
      const key = `${event.category}:${event.action}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const topEvents = Object.entries(eventCounts)
      .map(([key, count]) => {
        const [category, action] = key.split(':');
        return {
          category: category as EventCategory,
          action: action as EventAction,
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate conversion rates
    const totalSessions = new Set(events.map(e => e.sessionId)).size;
    const addToCartSessions = new Set(
      events.filter(e => e.category === 'cart' && e.action === 'add')
        .map(e => e.sessionId)
    ).size;
    const checkoutSessions = new Set(
      events.filter(e => e.category === 'order' && e.action === 'start')
        .map(e => e.sessionId)
    ).size;
    const purchaseSessions = new Set(
      events.filter(e => e.category === 'order' && e.action === 'complete')
        .map(e => e.sessionId)
    ).size;

    return {
      totalEvents: events.length,
      uniqueUsers,
      categoryBreakdown,
      topEvents,
      conversionRates: {
        addToCart: addToCartSessions / totalSessions,
        checkout: checkoutSessions / totalSessions,
        purchase: purchaseSessions / totalSessions
      }
    };
  }

  private async getUserStats(timeframe: AnalyticsTimeframe): Promise<UserStats> {
    const sessionsQuery = query(
      collection(this.firestore, this.sessionsCollection),
      where('startTime', '>=', timeframe.startDate),
      where('startTime', '<=', timeframe.endDate)
    );

    const querySnapshot = await getDocs(sessionsQuery);
    const sessions = querySnapshot.docs.map(doc => 
      this.formatSessionData(doc.data() as UserSession)
    );

    // Calculate total and active users
    const totalUsers = new Set(sessions.map(s => s.userId).filter(Boolean)).size;
    const activeUsers = new Set(
      sessions.filter(s => s.isActive)
        .map(s => s.userId)
        .filter(Boolean)
    ).size;

    // Calculate new vs returning users
    const userFirstSessions = sessions.reduce((acc, session) => {
      if (session.userId) {
        if (!acc[session.userId] || acc[session.userId] > session.startTime) {
          acc[session.userId] = session.startTime;
        }
      }
      return acc;
    }, {} as { [key: string]: number });

    const newUsers = Object.values(userFirstSessions)
      .filter(time => time >= timeframe.startDate).length;
    const returningUsers = totalUsers - newUsers;

    // Calculate average session duration
    const validDurations = sessions
      .filter(s => s.duration !== undefined)
      .map(s => s.duration as number);
    const averageSessionDuration = validDurations.length > 0
      ? validDurations.reduce((a, b) => a + b, 0) / validDurations.length
      : 0;

    // Calculate average sessions per user
    const averageSessionsPerUser = totalUsers > 0
      ? sessions.length / totalUsers
      : 0;

    // Calculate user engagement levels
    const userEngagementScores = sessions.reduce((acc, session) => {
      if (session.userId) {
        const score = (
          (session.duration || 0) / 60000 + // Duration in minutes
          session.pageViews * 2 + // Page views weighted
          session.events * 3 // Events weighted more heavily
        );
        acc[session.userId] = (acc[session.userId] || 0) + score;
      }
      return acc;
    }, {} as { [key: string]: number });

    const engagementScores = Object.values(userEngagementScores).sort((a, b) => b - a);
    const userCount = engagementScores.length;
    const highThreshold = engagementScores[Math.floor(userCount * 0.2)] || 0;
    const lowThreshold = engagementScores[Math.floor(userCount * 0.8)] || 0;

    const userEngagement = {
      highlyEngaged: engagementScores.filter(score => score >= highThreshold).length,
      moderatelyEngaged: engagementScores.filter(score => score < highThreshold && score > lowThreshold).length,
      lowlyEngaged: engagementScores.filter(score => score <= lowThreshold).length
    };

    return {
      totalUsers,
      activeUsers,
      newUsers,
      returningUsers,
      averageSessionDuration,
      averageSessionsPerUser,
      userEngagement
    };
  }

  private formatEventData(event: TrackingEvent): TrackingEvent {
    return {
      ...event,
      timestamp: event.timestamp && typeof event.timestamp === 'object' && 'toMillis' in event.timestamp
        ? event.timestamp.toMillis() 
        : (event.timestamp || Date.now())
    };
  }

  private formatPageViewData(pageView: PageView): PageView {
    return {
      ...pageView,
      timestamp: pageView.timestamp && typeof pageView.timestamp === 'object' && 'toMillis' in pageView.timestamp
        ? pageView.timestamp.toMillis() 
        : (pageView.timestamp || Date.now())
    };
  }

  private formatSessionData(session: UserSession): UserSession {
    return {
      ...session,
      startTime: session.startTime && typeof session.startTime === 'object' && 'toMillis' in session.startTime
        ? session.startTime.toMillis() 
        : (session.startTime || Date.now()),
      endTime: session.endTime && typeof session.endTime === 'object' && 'toMillis' in session.endTime
        ? session.endTime.toMillis() 
        : session.endTime,
      lastActivityTime: session.lastActivityTime && typeof session.lastActivityTime === 'object' && 'toMillis' in session.lastActivityTime
        ? session.lastActivityTime.toMillis() 
        : (session.lastActivityTime || Date.now())
    };
  }
} 