// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    ME: "/api/auth/me",
    PROFILE: "/api/auth/profile",
    CHANGE_PASSWORD: "/api/auth/change-password",
  },

  // Courses
  COURSES: {
    LIST: "/api/courses",
    DETAIL: (id: string) => `/api/courses/${id}`,
    MY_COURSES: "/api/courses/my",
    CREATE: "/api/courses",
    UPDATE: (id: string) => `/api/courses/${id}`,
    DELETE: (id: string) => `/api/courses/${id}`,
  },

  // Lessons
  LESSONS: {
    LIST: "/api/lessons",
    DETAIL: (id: string) => `/api/lessons/${id}`,
    COURSE_LESSONS: (courseId: string) => `/api/lessons/course/${courseId}`,
    CREATE: "/api/lessons",
    UPDATE: (id: string) => `/api/lessons/${id}`,
    DELETE: (id: string) => `/api/lessons/${id}`,
  },

  // Quizzes
  QUIZZES: {
    LIST: "/api/quizzes",
    DETAIL: (id: string) => `/api/quizzes/${id}`,
    COURSE_QUIZZES: (courseId: string) => `/api/quizzes/course/${courseId}`,
    CREATE: "/api/quizzes",
    UPDATE: (id: string) => `/api/quizzes/${id}`,
    DELETE: (id: string) => `/api/quizzes/${id}`,
  },

  // Enrollments
  ENROLLMENTS: {
    ENROLL: (courseId: string) => `/api/enrollments/enroll/${courseId}`,
    MY_COURSES: "/api/enrollments/my-courses",
    STATUS: (courseId: string) => `/api/enrollments/status/${courseId}`,
    PROGRESS: (courseId: string) => `/api/enrollments/progress/${courseId}`,
    COMPLETE_LESSON: "/api/enrollments/complete",
  },

  // Users
  USERS: {
    LIST: "/api/users",
    DETAIL: (id: string) => `/api/users/${id}`,
    UPDATE: (id: string) => `/api/users/${id}`,
    DELETE: (id: string) => `/api/users/${id}`,
  },

  // Certificates
  CERTIFICATES: {
    LIST: "/api/certificates",
    DETAIL: (id: string) => `/api/certificates/${id}`,
    USER_CERTIFICATES: (userId: string) => `/api/certificates/user/${userId}`,
    GENERATE: "/api/certificates/generate",
    DOWNLOAD: (id: string) => `/api/certificates/${id}/download`,
  },

  // Analytics
  ANALYTICS: {
    PROGRESS: (courseId: string) => `/api/analytics/progress/${courseId}`,
    HOURS: "/api/analytics/hours",
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/api/notifications",
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: "/api/notifications/mark-all-read",
  },

  // Affiliations
  AFFILIATIONS: {
    LIST: "/api/affiliations",
    DETAIL: (id: string) => `/api/affiliations/${id}`,
    CREATE: "/api/affiliations",
    UPDATE: (id: string) => `/api/affiliations/${id}`,
    DELETE: (id: string) => `/api/affiliations/${id}`,
  },

  // Franchise
  FRANCHISE: {
    LIST: "/api/franchise",
    DETAIL: (id: string) => `/api/franchise/${id}`,
    CREATE: "/api/franchise",
    UPDATE: (id: string) => `/api/franchise/${id}`,
    DELETE: (id: string) => `/api/franchise/${id}`,
  },

  // Contact
  CONTACT: {
    SEND: "/api/contact",
  },

  // Health
  HEALTH: "/health",
};

// API Request Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Request Headers
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
