import { ServiceResponse } from '../shared/types';

export interface PageViewEvent {
  path: string;
  title: string;
  timestamp: number;
}

export interface ButtonClickEvent {
  buttonId: string;
  section: string;
  productId?: string;
  timestamp: number;
}

export interface SectionViewEvent {
  sectionName: string;
  sectionId: string;
  path: string;
  timestamp: number;
}

export interface UserInteractionEvent {
  eventType: string;
  elementId: string;
  value?: string | number;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export type EventCategory = 
  | 'product'
  | 'cart'
  | 'order'
  | 'user'
  | 'blog'
  | 'search'
  | 'navigation';

export type EventAction =
  | 'view'
  | 'click'
  | 'add'
  | 'remove'
  | 'update'
  | 'submit'
  | 'success'
  | 'error'
  | 'start'
  | 'complete'
  | 'cancel';

export interface EventProperties {
  [key: string]: string | number | boolean | null;
}

export interface TrackingEvent {
  id: string;
  category: EventCategory;
  action: EventAction;
  label?: string;
  value?: number;
  properties?: EventProperties;
  userId?: string;
  sessionId: string;
  timestamp: number;
  path: string;
  referrer?: string;
}

export interface PageView {
  id: string;
  path: string;
  title: string;
  userId?: string;
  sessionId: string;
  timestamp: number;
  duration?: number;
  referrer?: string;
  deviceType: string;
  browser: string;
  os: string;
  screenResolution?: string;
  language: string;
  isFirstVisit: boolean;
  isNewSession: boolean;
}

export interface UserSession {
  id: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  lastActivityTime: number;
  pageViews: number;
  events: number;
  duration?: number;
  isActive: boolean;
  deviceType: string;
  browser: string;
  os: string;
  entryPage: string;
  exitPage?: string;
  referrer?: string;
}

export interface AnalyticsTimeframe {
  startDate: number;
  endDate: number;
}

export interface PageViewStats {
  totalViews: number;
  uniqueVisitors: number;
  averageTimeOnPage: number;
  bounceRate: number;
  topPages: Array<{
    path: string;
    views: number;
    averageTime: number;
  }>;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  trafficSources: Array<{
    source: string;
    visits: number;
  }>;
}

export interface EventStats {
  totalEvents: number;
  uniqueUsers: number;
  categoryBreakdown: {
    [key in EventCategory]?: number;
  };
  topEvents: Array<{
    category: EventCategory;
    action: EventAction;
    count: number;
  }>;
  conversionRates: {
    addToCart: number;
    checkout: number;
    purchase: number;
  };
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  returningUsers: number;
  averageSessionDuration: number;
  averageSessionsPerUser: number;
  userEngagement: {
    highlyEngaged: number;
    moderatelyEngaged: number;
    lowlyEngaged: number;
  };
}

export interface AnalyticsReport {
  timeframe: AnalyticsTimeframe;
  pageViews: PageViewStats;
  events: EventStats;
  users: UserStats;
}

export type TrackingEventResponse = ServiceResponse<TrackingEvent>;
export type PageViewResponse = ServiceResponse<PageView>;
export type UserSessionResponse = ServiceResponse<UserSession>;
export type AnalyticsReportResponse = ServiceResponse<AnalyticsReport>; 