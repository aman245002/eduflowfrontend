// Environment Configuration
export const ENV = {
  // Development
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,

  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || "",
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || "Global LMS",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  ENABLE_NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== "false",
  ENABLE_CERTIFICATES: import.meta.env.VITE_ENABLE_CERTIFICATES !== "false",

  // File Upload
  MAX_FILE_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || "10485760"), // 10MB
  ALLOWED_FILE_TYPES: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(",") || [
    "image/jpeg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
    "application/pdf",
  ],

  // Authentication
  JWT_STORAGE_KEY: import.meta.env.VITE_JWT_STORAGE_KEY || "token",
  USER_STORAGE_KEY: import.meta.env.VITE_USER_STORAGE_KEY || "user",

  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE || "10"),
  MAX_PAGE_SIZE: parseInt(import.meta.env.VITE_MAX_PAGE_SIZE || "100"),

  // UI Configuration
  THEME: import.meta.env.VITE_THEME || "light",
  LANGUAGE: import.meta.env.VITE_LANGUAGE || "en",

  // External Services
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,

  // Development Tools
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === "true",
  ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API === "true",
} as const;

// Environment Validation
export const validateEnvironment = () => {
  const requiredVars = ["VITE_API_URL"];

  const missingVars = requiredVars.filter(
    (varName) => !import.meta.env[varName],
  );

  if (missingVars.length > 0) {
    console.warn("Missing environment variables:", missingVars.join(", "));
  }
};

// Environment Helpers
export const isProduction = () => ENV.IS_PROD;
export const isDevelopment = () => ENV.IS_DEV;
export const isTest = () => import.meta.env.MODE === "test";

// Feature Flag Helpers
export const isFeatureEnabled = (feature: keyof typeof ENV) => {
  return ENV[feature] === true;
};

// Configuration Helpers
export const getApiUrl = (endpoint: string) => {
  return `${ENV.API_URL}${endpoint}`;
};

export const getStorageKey = (key: string) => {
  return `${ENV.APP_NAME}_${key}`;
};

// Type Definitions
export type Environment = typeof ENV;
export type FeatureFlag = keyof typeof ENV;

// Default Export
export default ENV;
