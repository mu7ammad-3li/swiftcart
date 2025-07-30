// src/components/Analytics/RouteChangeTracker.tsx
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import AnalyticsService from "../../services/analyticsService";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const RouteChangeTracker: React.FC = () => {
  const location = useLocation();
  const lastTrackedPath = useRef<string>("");

  useEffect(() => {
    try {
      const pagePath = location.pathname + location.search;
      
      // Prevent duplicate tracking of the same path
      if (lastTrackedPath.current === pagePath) {
        return;
      }
      
      const pageTitle = document.title || pagePath;
      const pageData = {
        page_path: pagePath,
        page_title: pageTitle,
        page_location: window.location.href,
        page_hostname: window.location.hostname,
        page_referrer: document.referrer || "",
        page_language: document.documentElement.lang,
      };

      // Track pageview in AnalyticsService (handles Meta Pixel, TikTok, Firebase)
      AnalyticsService.trackPageView(pagePath, pageTitle);

      // Enhanced GTM DataLayer push with more context
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "pageview",
        ...pageData,
        timestamp: new Date().toISOString(),
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
      });

      // Log tracking success
      console.log("[Analytics] Page view tracked successfully:", {
        path: pagePath,
        title: pageTitle,
      });

      // Update last tracked path
      lastTrackedPath.current = pagePath;
    } catch (error) {
      // Log any tracking errors
      console.error("[Analytics] Error tracking page view:", error);
      
      // Push error event to GTM for monitoring
      window.dataLayer?.push({
        event: "analytics_error",
        error_message: error instanceof Error ? error.message : "Unknown error",
        error_location: "RouteChangeTracker",
      });
    }
  }, [location]);

  return null;
};

export default RouteChangeTracker;