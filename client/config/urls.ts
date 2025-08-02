// Centralized URL Configuration
// This file centralizes all backend URLs for easy deployment

import { API_BASE_URL } from "./api";

// Backend URL - will be replaced during deployment
export const BACKEND_URL = API_BASE_URL;

// Utility function to build full URLs
export const buildUrl = (endpoint: string): string => {
  return `${BACKEND_URL}${endpoint}`;
};

// Utility function to build file URLs
export const buildFileUrl = (filePath: string): string => {
  if (!filePath) return "";
  if (filePath.startsWith("http")) return filePath;
  return `${BACKEND_URL}${filePath}`;
};

// Common URL patterns
export const URLS = {
  // API endpoints
  API: {
    AUTH: {
      LOGIN: buildUrl("/api/auth/login"),
      REGISTER: buildUrl("/api/auth/register"),
      CHANGE_PASSWORD: buildUrl("/api/auth/change-password"),
    },
    USERS: {
      LIST: buildUrl("/api/users"),
      PROFILE: buildUrl("/api/users/profile"),
      DETAIL: (id: string) => buildUrl(`/api/users/${id}`),
      DELETE: (id: string) => buildUrl(`/api/users/${id}`),
    },
    COURSES: {
      LIST: buildUrl("/api/courses"),
      MY_COURSES: buildUrl("/api/courses/my"),
      ENROLL: (courseId: string) =>
        buildUrl(`/api/enrollments/enroll/${courseId}`),
    },
    ENROLLMENTS: {
      MY_COURSES: buildUrl("/api/enrollments/my-courses"),
    },
    LESSONS: {
      UPLOAD: buildUrl("/api/lessons/upload"),
      COURSE_LESSONS: (courseId: string) =>
        buildUrl(`/api/lessons/course/${courseId}`),
      DELETE: (lessonId: string) => buildUrl(`/api/lessons/${lessonId}`),
    },
    QUIZZES: {
      CREATE: buildUrl("/api/quizzes"),
    },
    ANALYTICS: {
      PROGRESS: (courseId: string) =>
        buildUrl(`/api/analytics/progress/${courseId}`),
      HOURS: buildUrl("/api/analytics/hours"),
    },
    NOTIFICATIONS: {
      LIST: buildUrl("/api/notifications"),
      CREATE: buildUrl("/api/notifications"),
      DELETE: (id: string) => buildUrl(`/api/notifications/${id}`),
    },
    AFFILIATIONS: {
      LIST: buildUrl("/api/affiliations"),
      CREATE: buildUrl("/api/affiliations"),
      UPDATE: (id: string) => buildUrl(`/api/affiliations/${id}`),
      DELETE: (id: string) => buildUrl(`/api/affiliations/${id}`),
    },
    FRANCHISE: {
      LIST: buildUrl("/api/franchise"),
      CREATE: buildUrl("/api/franchise"),
    },
    CONTACT: {
      SEND: buildUrl("/api/contact"),
    },
  },

  // File URLs
  FILES: {
    LOGO: (filename: string) => buildFileUrl(`/logo/${filename}`),
    THUMBNAIL: (path: string) => buildFileUrl(path),
    UPLOAD: (path: string) => buildFileUrl(path),
  },
};

// Environment-specific configurations
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Log current configuration (only in development)
if (isDevelopment) {
  console.log("🔧 URL Configuration:", {
    BACKEND_URL,
    isDevelopment,
    isProduction,
  });
}
