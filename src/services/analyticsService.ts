// src/services/analyticsService.ts

import { analytics, logAnalyticsEvent as firebaseLogEvent } from "../lib/firebase"; // Firebase for GA4
import { Product } from "../data/products";
import { Order, OrderItem } from "../data/order";
import { CartItem } from "../contexts/CartContext";

// Add these type declarations at the top of the file
declare global {
  interface Window {
    fbq?: any; // Using any for now since the Facebook type is complex
    _fbq?: any;
    ttq?: {
      load: (pixelId: string) => void;
      page: () => void;
    };
  }
}

// --- Constants ---
const CURRENCY = "EGP"; // Or your store's currency

// --- Helper to check if a specific pixel/SDK is available ---
const isPixelAvailable = (sdkObjectName: string): boolean => {
  return typeof window !== "undefined" && typeof (window as any)[sdkObjectName] === "function";
};

const isTikTokPixelAvailable = (): boolean => {
  return typeof window !== "undefined" && typeof (window as any).ttq === "object" && (window as any).ttq !== null;
};


/**
 * Safely parses a price string or number into a numeric value.
 */
const parsePrice = (price: string | number | undefined | null): number => {
  if (price === null || price === undefined) return 0;
  const strPrice = String(price);
  const numericString = strPrice.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(numericString);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Extracts relevant data from cart items for analytics events.
 */
const mapCartItemsForAnalytics = (items: (CartItem | OrderItem)[]) => {
  return items.map((item) => ({
    item_id: "product" in item ? item.product.id : item.id,
    item_name: "product" in item ? item.product.name : item.name,
    quantity: item.quantity,
    price:
      "pricePerUnit" in item
        ? item.pricePerUnit
        : "priceAtPurchase" in item
        ? item.priceAtPurchase
        : 0,
  }));
};

// --- Types for platform-specific payloads ---
interface MetaPixelPayload {
  [key: string]: any;
}

interface TikTokPixelPayload {
  [key: string]: any;
}

// --- Helper functions to format payloads for each platform ---
const formatMetaPixelPayload = {
  pageView: () => ({}), // Meta Pixel pageview doesn't need parameters

  sectionView: (data: { sectionName: string; sectionId?: string; pagePath?: string }) => ({
    content_type: "section",
    content_name: data.sectionName,
    content_id: data.sectionId || "N/A",
    content_category: "section",
    page_path: data.pagePath || window.location.pathname
  }),

  viewContent: (product: Product): MetaPixelPayload => ({
    content_type: "product",
    content_ids: [product.id],
    content_name: product.name,
    value: parsePrice(product.onSale ? product.salePrice : product.price),
    currency: CURRENCY
  }),

  addToCart: (product: Product, quantity: number): MetaPixelPayload => ({
    content_type: "product",
    content_ids: [product.id],
    content_name: product.name,
    value: parsePrice(product.onSale ? product.salePrice : product.price) * quantity,
    currency: CURRENCY,
    num_items: quantity
  }),

  initiateCheckout: (items: CartItem[]): MetaPixelPayload => {
    const mappedItems = mapCartItemsForAnalytics(items);
    const totalValue = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQuantity = mappedItems.reduce((sum, item) => sum + item.quantity, 0);
    const contentIds = mappedItems.map((item) => item.item_id);

    return {
      content_ids: contentIds,
      content_type: "product",
      num_items: totalQuantity,
      value: totalValue,
      currency: CURRENCY,
      contents: mappedItems.map(i => ({ id: i.item_id, quantity: i.quantity }))
    };
  },

  purchase: (order: Omit<Order, "id" | "internalNotes">, orderId: string): MetaPixelPayload => {
    const mappedItems = mapCartItemsForAnalytics(order.items);
    const totalQuantity = mappedItems.reduce((sum, item) => sum + item.quantity, 0);
    const contentIds = mappedItems.map((item) => item.item_id);

    return {
      value: order.totalAmount,
      currency: CURRENCY,
      content_ids: contentIds,
      content_type: "product",
      num_items: totalQuantity,
      contents: mappedItems.map(i => ({ id: i.item_id, quantity: i.quantity })),
      order_id: orderId
    };
  }
};

const formatTikTokPixelPayload = {
  pageView: () => ({}), // TikTok pageview doesn't need parameters

  sectionView: (data: { sectionName: string; sectionId?: string; pagePath?: string }) => ({
    content_type: "product_group",
    content_category: "section",
    content_name: data.sectionName,
    content_id: data.sectionId || "N/A",
    page_path: data.pagePath || window.location.pathname
  }),

  viewContent: (product: Product): TikTokPixelPayload => ({
    content_type: "product",
    content_id: product.id,
    content_name: product.name,
    quantity: 1,
    price: parsePrice(product.onSale ? product.salePrice : product.price),
    value: parsePrice(product.onSale ? product.salePrice : product.price),
    currency: CURRENCY
  }),

  addToCart: (product: Product, quantity: number): TikTokPixelPayload => ({
    content_type: "product",
    content_id: product.id,
    content_name: product.name,
    quantity: quantity,
    price: parsePrice(product.onSale ? product.salePrice : product.price),
    value: parsePrice(product.onSale ? product.salePrice : product.price) * quantity,
    currency: CURRENCY
  }),

  initiateCheckout: (items: CartItem[]): TikTokPixelPayload => {
    const mappedItems = mapCartItemsForAnalytics(items);
    const totalValue = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQuantity = mappedItems.reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      contents: mappedItems.map(item => ({
        content_id: item.item_id,
        content_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        content_type: 'product'
      })),
      quantity: totalQuantity,
      value: totalValue,
      currency: CURRENCY
    };
  },

  purchase: (order: Omit<Order, "id" | "internalNotes">, orderId: string): TikTokPixelPayload => {
    const mappedItems = mapCartItemsForAnalytics(order.items);
    const totalQuantity = mappedItems.reduce((sum, item) => sum + item.quantity, 0);

    return {
      contents: mappedItems.map(item => ({
        content_id: item.item_id,
        content_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        content_type: 'product'
      })),
      quantity: totalQuantity,
      value: order.totalAmount,
      currency: CURRENCY,
      order_id: orderId
    };
  }
};

// --- Core Analytics Service ---
const AnalyticsService = {
  // --- Initialization ---
  initializeMetaPixel: async (pixelId: string | undefined): Promise<void> => {
    if (!pixelId) {
      console.warn("[AnalyticsService] Meta Pixel ID not configured. Skipping initialization.");
      return;
    }
    try {
      console.log('[AnalyticsService] Starting Meta Pixel initialization...', { pixelId });
      
      // Initialize fbq queue
      window.fbq = window.fbq || function() {
        (window.fbq as any).callMethod ? 
          (window.fbq as any).callMethod.apply(window.fbq, arguments) : 
          (window.fbq as any).queue.push(arguments)
      };
      if (!window._fbq) window._fbq = window.fbq;
      (window.fbq as any).push = window.fbq;
      (window.fbq as any).loaded = true;
      (window.fbq as any).version = '2.0';
      (window.fbq as any).queue = [];
      
      console.log('[AnalyticsService] fbq queue initialized');
      
      // Load Meta Pixel script
      await loadExternalScript('https://connect.facebook.net/en_US/fbevents.js', 'facebook-jssdk');
      console.log('[AnalyticsService] Meta Pixel script loaded');
      
      // Initialize FB Pixel
      if (typeof window.fbq === 'function') {
        window.fbq('init', pixelId);
        window.fbq('track', 'PageView');
        console.log('[AnalyticsService] Meta Pixel initialized successfully with ID:', pixelId);
      } else {
        throw new Error('fbq function not available after script load');
      }
    } catch (error) {
      console.error('[AnalyticsService] Meta Pixel initialization failed:', error);
      throw error; // Re-throw to handle in the app
    }
  },

  initializeTikTokPixel: async (pixelId: string | undefined): Promise<void> => {
    if (!pixelId) {
      console.warn("[AnalyticsService] TikTok Pixel ID not configured. Skipping initialization.");
      return;
    }
    try {
      console.log('[AnalyticsService] Initializing TikTok Pixel script...');
      await loadExternalScript(
        `https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${pixelId}`,
        'tiktok-pixel'
      );
      
      if (typeof window !== 'undefined' && window.ttq) {
        window.ttq.load(pixelId);
        window.ttq.page();
        console.log(`[AnalyticsService] TikTok Pixel Initialized (ID: ${pixelId}) and initial PageView tracked.`);
      } else {
        console.warn('[AnalyticsService] TikTok Pixel failed to initialize. ttq not available.');
      }
    } catch (error) {
      console.warn('[AnalyticsService] TikTok Pixel initialization failed:', error);
    }
  },

   loadExternalScript(src: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.id = id;
      script.src = src;
      script.async = true;
      script.onerror = () => {
        console.warn(`[AnalyticsService] Failed to load script: ${src}`);
        reject(new Error(`Failed to load script: ${src}`));
      };
      script.onload = () => resolve();
      
      document.head.appendChild(script);
      
      // Set a timeout to resolve anyway after 5 seconds
      setTimeout(() => {
        resolve();
        console.warn(`[AnalyticsService] Script loading timed out: ${src}`);
      }, 5000);
    });
  },

  // --- Standard Event Tracking ---
  trackPageView: (path: string, title: string): void => {
    // Meta Pixel PageView
    if (isPixelAvailable("fbq")) {
      try {
        (window as any).fbq("track", "PageView", formatMetaPixelPayload.pageView());
        console.log(`[AnalyticsService] Meta Pixel PageView tracked for: ${path}`);
      } catch (error) {
        console.error("[AnalyticsService] Error tracking Meta Pixel PageView:", error);
      }
    }

    // TikTok Pixel PageView
    if (isTikTokPixelAvailable()) {
      try {
        (window as any).ttq.page(formatTikTokPixelPayload.pageView());
        console.log(`[AnalyticsService] TikTok Pixel PageView tracked for: ${path}`);
      } catch (error) {
        console.error("[AnalyticsService] Error tracking TikTok Pixel PageView:", error);
      }
    }

    // Firebase Analytics tracking
    if (analytics) {
      firebaseLogEvent(analytics, "page_view", {
        page_location: window.location.href,
        page_path: path,
        page_title: title,
      });
      firebaseLogEvent(analytics, "screen_view", {
        firebase_screen: title,
        firebase_screen_class: path.split('/')[1] || 'home',
      });
    }
  },

  trackViewContent: (product: Product): void => {
    if (!product) return;

    // Meta Pixel ViewContent
    if (isPixelAvailable("fbq")) {
      try {
        (window as any).fbq("track", "ViewContent", formatMetaPixelPayload.viewContent(product));
      } catch (error) {
        console.error("[AnalyticsService] Error tracking Meta Pixel ViewContent:", error);
      }
    }

    // TikTok Pixel ViewContent
    if (isTikTokPixelAvailable()) {
      try {
        (window as any).ttq.track("ViewContent", formatTikTokPixelPayload.viewContent(product));
      } catch (error) {
        console.error("[AnalyticsService] Error tracking TikTok Pixel ViewContent:", error);
      }
    }

    // Firebase Analytics tracking
    if (analytics) {
      const price = parsePrice(product.onSale ? product.salePrice : product.price);
      firebaseLogEvent(analytics, "view_item", {
        currency: CURRENCY,
        value: price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: price,
          currency: CURRENCY,
          item_category: product.slug?.includes("BedGuard") ? "Bed Bug Treatment" : 
                        product.slug?.includes("MultiGuard") ? "Cockroach & Ant Treatment" : 
                        "Pest Control"
        }]
      });
    }
  },

  trackAddToCart: (product: Product, quantity: number): void => {
    if (!product || quantity <= 0) return;
    const price = parsePrice(product.onSale ? product.salePrice : product.price);
    const value = price * quantity;
    const itemParams = {
      item_id: product.id,
      item_name: product.name,
      price: price,
      quantity: quantity,
      currency: CURRENCY,
      item_category: product.slug?.includes("BedGuard") ? "Bed Bug Treatment" : product.slug?.includes("MultiGuard") ? "Cockroach & Ant Treatment" : "Pest Control",
    };

    // Meta Pixel AddToCart
    if (isPixelAvailable("fbq")) {
      (window as any).fbq("track", "AddToCart", {
        content_type: "product",
        content_ids: [product.id],
        content_name: product.name,
        value: value,
        currency: CURRENCY,
        num_items: quantity,
      });
    }
    // Firebase Analytics add_to_cart
    if (analytics) {
      firebaseLogEvent(analytics, "add_to_cart", {
        currency: CURRENCY,
        value: value,
        items: [itemParams],
      });
    }
    // TikTok Pixel AddToCart
     if (isTikTokPixelAvailable()) {
      (window as any).ttq.track("AddToCart", {
        content_type: "product",
        content_id: product.id,
        content_name: product.name,
        quantity: quantity,
        price: price,
        value: value,
        currency: CURRENCY,
      });
    }
  },

  trackInitiateCheckout: (items: CartItem[]): void => {
    if (!items || items.length === 0) return;
    const mappedItems = mapCartItemsForAnalytics(items);
    const totalValue = mappedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQuantity = mappedItems.reduce((sum, item) => sum + item.quantity, 0);
    const contentIds = mappedItems.map((item) => item.item_id);
    const tiktokContents = mappedItems.map(item => ({
        content_id: item.item_id,
        content_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        content_type: 'product', // Required by TikTok
    }));


    // Meta Pixel InitiateCheckout
    if (isPixelAvailable("fbq")) {
      (window as any).fbq("track", "InitiateCheckout", {
        content_ids: contentIds,
        content_type: "product",
        num_items: totalQuantity,
        value: totalValue,
        currency: CURRENCY,
        contents: mappedItems.map(i => ({ id: i.item_id, quantity: i.quantity })),
      });
    }
    // Firebase Analytics begin_checkout
    if (analytics) {
      firebaseLogEvent(analytics, "begin_checkout", {
        currency: CURRENCY,
        value: totalValue,
        items: mappedItems,
      });
    }
    // TikTok Pixel InitiateCheckout
    if (isTikTokPixelAvailable()) {
        (window as any).ttq.track('InitiateCheckout', {
            contents: tiktokContents,
            quantity: totalQuantity,
            value: totalValue,
            currency: CURRENCY,
        });
    }
  },

  trackAddPaymentInfo: (): void => { // Typically called when user proceeds to payment step
    // Meta Pixel AddPaymentInfo
    if (isPixelAvailable("fbq")) {
      (window as any).fbq("track", "AddPaymentInfo");
    }
    // Firebase Analytics add_payment_info
    if (analytics) {
      firebaseLogEvent(analytics, "add_payment_info", {
        payment_type: "Cash on Delivery", // Example, adjust if other methods are available
      });
    }
    // TikTok Pixel AddPaymentInfo
    if (isTikTokPixelAvailable()) {
        (window as any).ttq.track('AddPaymentInfo', {
             // TikTok might not have specific parameters for AddPaymentInfo beyond the event name
        });
    }
  },

  trackPurchase: (order: Omit<Order, "id" | "internalNotes">, orderId: string): void => {
    if (!order || !order.items || order.items.length === 0 || !orderId) return;
    const mappedItems = mapCartItemsForAnalytics(order.items);
    const totalQuantity = mappedItems.reduce((sum, item) => sum + item.quantity, 0);
    const contentIds = mappedItems.map((item) => item.item_id);
     const tiktokContents = mappedItems.map(item => ({
        content_id: item.item_id,
        content_name: item.item_name,
        quantity: item.quantity,
        price: item.price,
        content_type: 'product',
    }));

    // Meta Pixel Purchase
    if (isPixelAvailable("fbq")) {
      (window as any).fbq("track", "Purchase", {
        value: order.totalAmount,
        currency: CURRENCY,
        content_ids: contentIds,
        content_type: "product",
        num_items: totalQuantity,
        contents: mappedItems.map(i => ({ id: i.item_id, quantity: i.quantity })),
        order_id: orderId,
      });
    }
    // Firebase Analytics purchase
    if (analytics) {
      firebaseLogEvent(analytics, "purchase", {
        transaction_id: orderId,
        value: order.totalAmount,
        currency: CURRENCY,
        // shipping: order.shippingCost, // Add if available
        // tax: order.tax, // Add if available
        items: mappedItems,
      });
    }
    // TikTok Pixel CompletePayment
    if (isTikTokPixelAvailable()) {
        (window as any).ttq.track('CompletePayment', {
            contents: tiktokContents,
            quantity: totalQuantity,
            value: order.totalAmount,
            currency: CURRENCY,
            order_id: orderId, // Optional but recommended
        });
    }
  },

  // --- Custom Event Tracking ---
  /**
   * Tracks a generic custom event across configured analytics platforms.
   * @param eventName - The name of the custom event.
   * @param parameters - An object of key-value pairs for event parameters.
   */
  trackCustomEvent: (eventName: string, parameters?: { [key: string]: any }): void => {
    console.log(`[AnalyticsService] Tracking Custom Event: ${eventName}`, parameters);

    // Meta Pixel Custom Event
    if (isPixelAvailable("fbq")) {
      try {
        (window as any).fbq("trackCustom", eventName, parameters);
         console.log(`[AnalyticsService] Meta Pixel Custom Event tracked: ${eventName}`);
      } catch (error) {
        console.error(`[AnalyticsService] Error tracking Meta Pixel Custom Event ${eventName}:`, error);
      }
    }

    // Firebase Analytics (GA4) Custom Event
    if (analytics) {
      try {
        firebaseLogEvent(analytics, eventName, parameters);
        console.log(`[AnalyticsService] GA4 Custom Event tracked: ${eventName}`);
      } catch (error) {
         console.error(`[AnalyticsService] Error tracking GA4 Custom Event ${eventName}:`, error);
      }
    }

    // TikTok Pixel Custom Event
    if (isTikTokPixelAvailable()) {
      try {
        (window as any).ttq.track(eventName, parameters);
        console.log(`[AnalyticsService] TikTok Pixel Custom Event tracked: ${eventName}`);
      } catch (error) {
        console.error(`[AnalyticsService] Error tracking TikTok Pixel Custom Event ${eventName}:`, error);
      }
    }
    
    // Optional: GTM dataLayer push for custom events
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
        try {
            (window as any).dataLayer.push({
                event: eventName, // Use the custom event name for GTM
                ...parameters // Spread parameters into the dataLayer object
            });
            console.log(`[AnalyticsService] GTM dataLayer event pushed: ${eventName}`);
        } catch (error) {
            console.error(`[AnalyticsService] Error pushing to GTM dataLayer for event ${eventName}:`, error);
        }
    }
  },

  /**
   * Tracks when a user views a specific section of a page.
   * @param sectionName - A descriptive name for the section (e.g., "Features", "Testimonials").
   * @param sectionId - The HTML ID of the section element, if available.
   * @param pagePath - The path of the page where the section is viewed.
   */
  trackSectionView: (sectionName: string, sectionId?: string, pagePath?: string): void => {
    const data = { sectionName, sectionId, pagePath };

    // Meta Pixel section view tracking
    if (isPixelAvailable("fbq")) {
      try {
        // Track as ViewContent event for better compatibility
        (window as any).fbq("track", "ViewContent", formatMetaPixelPayload.sectionView(data));
        console.log(`[AnalyticsService] Meta Pixel Section View tracked: ${sectionName}`);
      } catch (error) {
        console.error("[AnalyticsService] Error tracking Meta Pixel Section View:", error);
      }
    }

    // TikTok Pixel section view tracking
    if (isTikTokPixelAvailable()) {
      try {
        (window as any).ttq.track("ViewContent", formatTikTokPixelPayload.sectionView(data));
        console.log(`[AnalyticsService] TikTok Pixel Section View tracked: ${sectionName}`);
      } catch (error) {
        console.error("[AnalyticsService] Error tracking TikTok Pixel Section View:", error);
      }
    }

    // Firebase Analytics tracking
    if (analytics) {
      firebaseLogEvent(analytics, "section_view", {
        section_name: sectionName,
        section_id: sectionId || "N/A",
        page_path: pagePath || window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Tracks a button click.
   * @param buttonName - A descriptive name for the button (e.g., "Buy Now - Hero", "Show More Details").
   * @param buttonLocation - The section or component where the button is located (e.g., "Hero Section", "Product Card").
   * @param productId - Optional product ID if the button click is related to a specific product.
   * @param url - Optional URL if the button click leads to a navigation.
   */
  trackButtonClick: (buttonName: string, buttonLocation: string, productId?: string, url?: string): void => {
    const params: { [key: string]: any } = {
      button_name: buttonName,
      button_location: buttonLocation,
    };
    if (productId) params.item_id = productId; // GA4 standard param for item id
    if (url) params.link_url = url; // GA4 standard param for outbound links

    AnalyticsService.trackCustomEvent("button_click", params);
  },
};

// Move loadExternalScript outside the AnalyticsService object
const loadExternalScript = (src: string, id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onerror = () => {
      console.warn(`[AnalyticsService] Failed to load script: ${src}`);
      reject(new Error(`Failed to load script: ${src}`));
    };
    script.onload = () => resolve();
    
    document.head.appendChild(script);
    
    // Set a timeout to resolve anyway after 5 seconds
    setTimeout(() => {
      resolve();
      console.warn(`[AnalyticsService] Script loading timed out: ${src}`);
    }, 5000);
  });
};

export default AnalyticsService;
