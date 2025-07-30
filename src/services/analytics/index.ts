import { BaseServiceConfig } from '../shared/BaseService';
import { AnalyticsQueryService } from './analyticsQueries';
import { AnalyticsMutationService } from './analyticsMutations';
import { EventCategory, EventAction } from './types';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private queryService: AnalyticsQueryService;
  private mutationService: AnalyticsMutationService;
  private currentSessionId: string | null = null;

  private constructor(config: BaseServiceConfig) {
    this.queryService = new AnalyticsQueryService(config);
    this.mutationService = new AnalyticsMutationService(config);
    this.initializeMethods();
    this.initializeSession();
  }

  private async initializeSession(): Promise<void> {
    const session = await this.createSession();
    if (session.success) {
      this.currentSessionId = session.data.id;
    }
  }

  private initializeMethods(): void {
    // Query Methods
    this.getEvent = this.queryService.getEvent.bind(this.queryService);
    this.getPageView = this.queryService.getPageView.bind(this.queryService);
    this.getUserSession = this.queryService.getUserSession.bind(this.queryService);
    this.getAnalyticsReport = this.queryService.getAnalyticsReport.bind(this.queryService);

    // Mutation Methods
    this.trackEvent = this.mutationService.trackEvent.bind(this.mutationService);
    this.trackPageView = this.mutationService.trackPageView.bind(this.mutationService);
    this.updatePageViewDuration = this.mutationService.updatePageViewDuration.bind(this.mutationService);
    this.createSession = this.mutationService.createSession.bind(this.mutationService);
    this.updateSession = this.mutationService.updateSession.bind(this.mutationService);
    this.endSession = this.mutationService.endSession.bind(this.mutationService);

    // Custom Analytics Methods
    this.trackButtonClick = this.trackButtonClick.bind(this);
    this.trackSectionView = this.trackSectionView.bind(this);
  }

  public static initialize(config: BaseServiceConfig): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService(config);
    }
    return AnalyticsService.instance;
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      throw new Error('AnalyticsService must be initialized before use');
    }
    return AnalyticsService.instance;
  }

  // Query Methods
  public getEvent!: typeof AnalyticsQueryService.prototype.getEvent;
  public getPageView!: typeof AnalyticsQueryService.prototype.getPageView;
  public getUserSession!: typeof AnalyticsQueryService.prototype.getUserSession;
  public getAnalyticsReport!: typeof AnalyticsQueryService.prototype.getAnalyticsReport;

  // Mutation Methods
  public trackEvent!: typeof AnalyticsMutationService.prototype.trackEvent;
  public trackPageView!: typeof AnalyticsMutationService.prototype.trackPageView;
  public updatePageViewDuration!: typeof AnalyticsMutationService.prototype.updatePageViewDuration;
  public createSession!: typeof AnalyticsMutationService.prototype.createSession;
  public updateSession!: typeof AnalyticsMutationService.prototype.updateSession;
  public endSession!: typeof AnalyticsMutationService.prototype.endSession;

  // Custom Analytics Methods
  public trackButtonClick(buttonName: string, buttonLocation: string, productId?: string, url?: string): void {
    if (!this.currentSessionId) {
      console.warn('No active session found for tracking button click');
      return;
    }

    this.trackEvent({
      category: 'navigation' as EventCategory,
      action: 'click' as EventAction,
      label: buttonName,
      value: 1,
      sessionId: this.currentSessionId,
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      properties: {
        location: buttonLocation,
        productId: productId || null,
        url: url || null
      }
    });
  }

  public trackSectionView(sectionName: string, sectionId: string, path: string): void {
    if (!this.currentSessionId) {
      console.warn('No active session found for tracking section view');
      return;
    }

    this.trackEvent({
      category: 'navigation' as EventCategory,
      action: 'view' as EventAction,
      label: sectionName,
      value: 1,
      sessionId: this.currentSessionId,
      path,
      properties: {
        sectionId,
        path
      }
    });
  }
}

// Export types
export * from './types'; 