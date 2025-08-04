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

  // Check if we're in production and should use S3
  const isProduction = import.meta.env.PROD;
  const s3BucketName = import.meta.env.VITE_S3_BUCKET_NAME;
  const s3Region = import.meta.env.VITE_S3_REGION || "ap-south-1";

  if (isProduction && s3BucketName) {
    // Use S3 URL in production
    return `https://${s3BucketName}.s3.${s3Region}.amazonaws.com${filePath}`;
  } else {
    // Use local URL in development
    return `${BACKEND_URL}${filePath}`;
  }
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
      UPLOAD_AVATAR: buildUrl("/api/users/upload-avatar"),
      DETAIL: (id: string) => buildUrl(`/api/users/${id}`),
      UPDATE: (id: string) => buildUrl(`/api/users/${id}`),
      DELETE: (id: string) => buildUrl(`/api/users/${id}`),
    },
    COURSES: {
      LIST: buildUrl("/api/courses"),
      MY_COURSES: buildUrl("/api/courses/my"),
      CREATE: buildUrl("/api/courses"),
      UPDATE: (id: string) => buildUrl(`/api/courses/${id}`),
      DELETE: (id: string) => buildUrl(`/api/courses/${id}`),
      DETAIL: (id: string) => buildUrl(`/api/courses/${id}`),
      ENROLL: (courseId: string) =>
        buildUrl(`/api/enrollments/enroll/${courseId}`),
    },
    ENROLLMENTS: {
      MY_COURSES: buildUrl("/api/enrollments/my-courses"),
      ENROLL: (courseId: string) =>
        buildUrl(`/api/enrollments/enroll/${courseId}`),
      STATUS: (courseId: string) =>
        buildUrl(`/api/enrollments/status/${courseId}`),
      PROGRESS: (courseId: string) =>
        buildUrl(`/api/enrollments/progress/${courseId}`),
      COMPLETE_LESSON: buildUrl("/api/enrollments/complete"),
    },
    QUIZ_ATTEMPTS: {
      LATEST: (lessonId: string) =>
        buildUrl(`/api/quiz-attempts/${lessonId}/latest`),
      CREATE: buildUrl("/api/quiz-attempts"),
      SUBMIT: (attemptId: string) =>
        buildUrl(`/api/quiz-attempts/${attemptId}/submit`),
    },
    PROGRESS: {
      LESSON: (lessonId: string) =>
        buildUrl(`/api/progress/lesson/${lessonId}`),
      MARK_DONE: buildUrl("/api/progress/mark-done"),
      COURSE: (courseId: string) =>
        buildUrl(`/api/progress/course/${courseId}`),
    },
    LESSONS: {
      LIST: buildUrl("/api/lessons"),
      UPLOAD: buildUrl("/api/lessons/upload"),
      COURSE_LESSONS: (courseId: string) =>
        buildUrl(`/api/lessons/course/${courseId}`),
      CREATE: buildUrl("/api/lessons"),
      UPDATE: (id: string) => buildUrl(`/api/lessons/${id}`),
      DELETE: (lessonId: string) => buildUrl(`/api/lessons/${lessonId}`),
      DETAIL: (id: string) => buildUrl(`/api/lessons/${id}`),
      NEXT: (lessonId: string) => buildUrl(`/api/lessons/${lessonId}/next`),
      PREV: (lessonId: string) => buildUrl(`/api/lessons/${lessonId}/prev`),
    },
    QUIZZES: {
      LIST: buildUrl("/api/quizzes"),
      CREATE: buildUrl("/api/quizzes"),
      UPDATE: (id: string) => buildUrl(`/api/quizzes/${id}`),
      DELETE: (id: string) => buildUrl(`/api/quizzes/${id}`),
      DETAIL: (id: string) => buildUrl(`/api/quizzes/${id}`),
      COURSE_QUIZZES: (courseId: string) =>
        buildUrl(`/api/quizzes/course/${courseId}`),
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
      DETAIL: (id: string) => buildUrl(`/api/affiliations/${id}`),
    },
    FRANCHISE: {
      LIST: buildUrl("/api/franchise"),
      CREATE: buildUrl("/api/franchise"),
      UPDATE: (id: string) => buildUrl(`/api/franchise/${id}`),
      DELETE: (id: string) => buildUrl(`/api/franchise/${id}`),
      DETAIL: (id: string) => buildUrl(`/api/franchise/${id}`),
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
