// src/lib/firebase.ts

// --- Core Firebase Imports ---
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// --- Analytics Imports ---
import {
  getAnalytics,
  Analytics,
  logEvent as firebaseLogEvent, // Use this for all event logging
  setUserId as firebaseSetUserId,
  setUserProperties as firebaseSetUserProperties,
  isSupported as isAnalyticsSupported,
  // Deprecated 'setCurrentScreen' is removed
} from "firebase/analytics";

// --- App Check Imports ---
import {
  initializeAppCheck,
  ReCaptchaV3Provider, // Using reCAPTCHA v3 provider
  // Or for reCAPTCHA Enterprise: ReCaptchaEnterpriseProvider,
  AppCheck,
} from "firebase/app-check";

// --- Configuration from Environment Variables ---
// Ensures sensitive keys are not hardcoded. Requires VITE_ prefix for Vite projects.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID, // GA4 Measurement ID
};

const recaptchaV3SiteKey = import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY;

// --- Module Variables ---
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;
let appCheck: AppCheck | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;
let appInitializationError: Error | null = null;

// --- Initialization Logic ---

// 1. Validate Essential Configuration
if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.appId ||
  !firebaseConfig.storageBucket
) {
  appInitializationError = new Error(
    "Firebase configuration error: Missing essential environment variables (VITE_API_KEY, VITE_AUTH_DOMAIN, VITE_PROJECT_ID, VITE_APP_ID, VITE_STORAGE_BUCKET). Check your .env file and ensure the Vite dev server is restarted if needed."
  );
  console.error("[Firebase Init Error]", appInitializationError.message);
} else {
  // 2. Initialize Firebase App (Singleton Pattern)
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      console.log("[Firebase] App initialized successfully.");
    } catch (error) {
      appInitializationError =
        error instanceof Error ? error : new Error(String(error));
      console.error(
        "[Firebase Init Error] App initialization failed:",
        appInitializationError
      );
    }
  } else {
    app = getApp();
    // console.log("[Firebase] App already initialized."); // Usually not needed
  }
}

// 3. Initialize Dependent Services (only if app initialization succeeded)
if (app) {
  // Initialize Firestore
  try {
    // Using the default database
    db = getFirestore(app);
    console.log(
      "[Firebase] Firestore initialized successfully."
    );
  } catch (error) {
    console.error(
      "[Firebase Init Error] Firestore initialization failed:",
      error
    );
  }

  // Initialize Auth
  try {
    auth = getAuth(app);
    console.log("[Firebase] Auth initialized successfully.");
  } catch (error) {
    console.error("[Firebase Init Error] Auth initialization failed:", error);
  }

  // Initialize Storage
  try {
    storage = getStorage(app);
    console.log("[Firebase] Storage initialized successfully.");
  } catch (error) {
    console.error("[Firebase Init Error] Storage initialization failed:", error);
  }

  // Initialize App Check (if configured)
  if (recaptchaV3SiteKey) {
    try {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaV3SiteKey),
        isTokenAutoRefreshEnabled: true, // Recommended for web apps
      });
      console.log(
        "[Firebase] App Check initialized successfully with reCAPTCHA v3."
      );
    } catch (error) {
      console.error(
        "[Firebase Init Error] App Check initialization failed:",
        error
      );
    }
  } else {
    console.warn(
      "[Firebase] App Check not initialized: VITE_RECAPTCHA_V3_SITE_KEY is missing. Backend resources may be less protected."
    );
  }

  // Initialize Analytics (asynchronously checks for support)
  isAnalyticsSupported()
    .then((isSupported) => {
      if (isSupported && app && firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
          console.log(
            "[Firebase] Analytics initialized with Measurement ID:",
            firebaseConfig.measurementId
          );
        } catch (error) {
          console.error(
            "[Firebase Init Error] Analytics initialization failed:",
            error
          );
        }
      } else if (isSupported && !firebaseConfig.measurementId) {
        console.warn(
          "[Firebase] Analytics not initialized: VITE_MEASUREMENT_ID is missing."
        );
      } else if (!isSupported) {
        console.warn(
          "[Firebase] Analytics is not supported in this environment."
        );
      }
    })
    .catch((error) => {
      console.error(
        "[Firebase Init Error] Error checking Analytics support:",
        error
      );
    });
} else if (!appInitializationError) {
  // This case should theoretically not happen if validation passes
  // but added for robustness.
  console.error(
    "[Firebase Init Error] Firebase app is null, cannot initialize dependent services."
  );
}

// --- Analytics Helper Functions ---

/**
 * Logs a custom event to Google Analytics.
 * Handles checking if Analytics is initialized.
 * @param eventName - The name of the event to log.
 * @param eventParams - Optional parameters for the event.
 */
export const logAnalyticsEvent = (
analytics: Analytics, eventName: string, eventParams?: { [key: string]: any; }): void => {
  if (analytics) {
    try {
      firebaseLogEvent(analytics, eventName, eventParams);
      // console.log(`[Analytics Event] Logged: ${eventName}`, eventParams || ""); // Optional verbose logging
    } catch (error) {
      console.error(
        `[Analytics Event Error] Failed to log event ${eventName}:`,
        error
      );
    }
  } else {
    // console.warn(`[Analytics Event] Skipped (Not Initialized): ${eventName}`); // Optional warning
  }
};

/**
 * Sets the user ID for Analytics reporting.
 * @param userId - The user's unique ID, or null to clear.
 */
export const setAnalyticsUserId = (userId: string | null): void => {
  if (analytics) {
    try {
      firebaseSetUserId(analytics, userId);
      // console.log(`[Analytics User ID] ${userId ? "Set to: " + userId : "Cleared."}`);
    } catch (error) {
      console.error(`[Analytics User ID Error] Failed to set user ID:`, error);
    }
  } else {
    // console.warn("[Analytics User ID] Skipped (Not Initialized).");
  }
};

/**
 * Sets custom user properties for Analytics.
 * @param properties - An object of key-value pairs for user properties.
 */
export const setAnalyticsUserProperties = (properties: {
  [key: string]: string | undefined;
}): void => {
  if (analytics) {
    try {
      firebaseSetUserProperties(analytics, properties);
      // console.log("[Analytics User Properties] Set:", properties);
    } catch (error) {
      console.error(
        `[Analytics User Properties Error] Failed to set properties:`,
        error
      );
    }
  } else {
    // console.warn("[Analytics User Properties] Skipped (Not Initialized).");
  }
};

// Note: The deprecated setAnalyticsCurrentScreen function has been removed.
// Screen views should be tracked using logAnalyticsEvent('screen_view', { ... })
// typically handled by the AnalyticsService or RouteChangeTracker.

// --- Exports ---
// Export the initialized instances and any initialization errors.
export { app, db, analytics, appCheck, auth, storage, appInitializationError };
