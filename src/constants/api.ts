// API Configuration
export const API_CONFIG = {
  // Base URL - Change this to your Flask server URL
  BASE_URL: __DEV__ 
    ? 'http://10.0.2.2:5000/api'  // Android emulator
    : 'http://localhost:5000/api', // iOS simulator
  
  // Production URL (replace with your actual domain)
  PRODUCTION_URL: 'https://your-memory-lane-api.com/api',
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_TOKEN: '/auth/verify-token',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHECK_USERNAME: '/auth/check-username',
    CHECK_EMAIL: '/auth/check-email',
  },
  
  // Users
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    UPLOAD_AVATAR: '/users/avatar',
    GET_USER: (userId: string) => `/users/${userId}`,
    GET_USER_MEMORIES: (userId: string) => `/users/${userId}/memories`,
  },
  
  // Memories
  MEMORIES: {
    CREATE: '/memories',
    GET_MEMORY: (memoryId: string) => `/memories/${memoryId}`,
    UPDATE_MEMORY: (memoryId: string) => `/memories/${memoryId}`,
    DELETE_MEMORY: (memoryId: string) => `/memories/${memoryId}`,
    NEARBY: '/memories/nearby',
    FEED: '/memories/feed',
    SEARCH: '/memories/search',
    DISCOVER: '/memories/discover',
    ADD_TAGS: (memoryId: string) => `/memories/${memoryId}/add-tags`,
    GET_USER_MEMORIES: (userId: string) => `/memories/user/${userId}`,
  },
  
  // Interactions
  INTERACTIONS: {
    LIKE: (memoryId: string) => `/interactions/${memoryId}/like`,
    UNLIKE: (memoryId: string) => `/interactions/${memoryId}/unlike`,
    COMMENT: (memoryId: string) => `/interactions/${memoryId}/comment`,
    GET_COMMENTS: (memoryId: string) => `/interactions/${memoryId}/comments`,
    REPORT: (memoryId: string) => `/interactions/${memoryId}/report`,
  },
  
  // Geospatial
  GEOSPATIAL: {
    NEARBY_MEMORIES: '/geospatial/nearby-memories',
    MEMORIES_IN_AREA: '/geospatial/memories-in-area',
    POPULAR_LOCATIONS: '/geospatial/popular-locations',
    USER_LOCATION_HISTORY: '/geospatial/location-history',
  },
  
  // Uploads
  UPLOADS: {
    UPLOAD_MEDIA: '/uploads/media',
    UPLOAD_AVATAR: '/uploads/avatar',
    DELETE_MEDIA: (mediaId: string) => `/uploads/media/${mediaId}`,
  },
  
  // Health check
  HEALTH: '/health',
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// Content Types
export const CONTENT_TYPES = {
  PHOTO: 'photo',
  AUDIO: 'audio',
  VIDEO: 'video',
  TEXT: 'text',
};

// Privacy Levels
export const PRIVACY_LEVELS = {
  PUBLIC: 'public',
  FRIENDS: 'friends',
  PRIVATE: 'private',
};

// Memory Categories
export const MEMORY_CATEGORIES = [
  'Travel',
  'Food',
  'Music',
  'Art',
  'Nature',
  'Family',
  'Friends',
  'Work',
  'Education',
  'Sports',
  'Entertainment',
  'Technology',
  'Health',
  'Spiritual',
  'Other',
];

// Memory Moods
export const MEMORY_MOODS = [
  'Happy',
  'Sad',
  'Excited',
  'Peaceful',
  'Nostalgic',
  'Inspired',
  'Grateful',
  'Surprised',
  'Amused',
  'Reflective',
  'Energetic',
  'Calm',
  'Adventurous',
  'Romantic',
  'Proud',
];

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MEMORY_CREATED: 'Memory created successfully!',
  MEMORY_UPDATED: 'Memory updated successfully!',
  MEMORY_DELETED: 'Memory deleted successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
}; 