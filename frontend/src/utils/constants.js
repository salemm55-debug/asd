// Constants for Wasitak Platform

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  ALLOWED_EXTENSIONS: [
    '.jpg', '.jpeg', '.png', '.gif', '.webp',
    '.mp4', '.webm',
    '.pdf',
    '.doc', '.docx',
    '.txt'
  ]
};

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_MESSAGES_PER_MINUTE: 10,
  TYPING_TIMEOUT: 1000,
  MESSAGE_RETENTION_DAYS: 30,
  AUTO_SCROLL_THRESHOLD: 100
};

// Rate Limiting
export const RATE_LIMITS = {
  MESSAGES: {
    WINDOW: 60000, // 1 minute
    MAX: 10
  },
  API: {
    WINDOW: 60000, // 1 minute
    MAX: 100
  },
  UPLOAD: {
    WINDOW: 300000, // 5 minutes
    MAX: 5
  }
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800
};

// Breakpoints
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
  LARGE_DESKTOP: 1440
};

// Colors
export const COLORS = {
  PRIMARY: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },
  SECONDARY: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75'
  },
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  WARNING: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

// Gradients
export const GRADIENTS = {
  PRIMARY: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  SECONDARY: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  SUCCESS: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  WARNING: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  ERROR: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  DARK: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  LIGHT: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
};

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080
};

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'wasitak_theme',
  USER: 'wasitak_user',
  NICKNAME: 'wasitak_nickname',
  USER_ROLE: 'wasitak_user_role',
  ADMIN_TOKEN: 'wasitak_admin_token',
  ADMIN_DATA: 'wasitak_admin_data',
  CHAT_MESSAGES: 'wasitak_chat_messages',
  SETTINGS: 'wasitak_settings',
  PREFERENCES: 'wasitak_preferences'
};

// Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  FILE: 'file',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  SYSTEM: 'system'
};

// User Roles
export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  BROKER: 'broker',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// Ticket Status
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

// Ticket Priority
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Ticket Category
export const TICKET_CATEGORY = {
  TECHNICAL: 'technical',
  BILLING: 'billing',
  GENERAL: 'general',
  COMPLAINT: 'complaint',
  SUGGESTION: 'suggestion'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Currency Codes
export const CURRENCY_CODES = {
  SAR: 'ريال سعودي',
  USD: 'دولار أمريكي',
  EUR: 'يورو',
  GBP: 'جنيه إسترليني',
  AED: 'درهم إماراتي',
  KWD: 'دينار كويتي',
  QAR: 'ريال قطري',
  MAD: 'درهم مغربي',
  JOD: 'دينار أردني',
  TRY: 'ليرة تركية',
  EGP: 'جنيه مصري',
  BTC: 'بيتكوين',
  ETH: 'إيثيريوم'
};

// Language Codes
export const LANGUAGE_CODES = {
  AR: 'ar-SA',
  EN: 'en-US'
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
  FULL: 'full'
};

// Time Formats
export const TIME_FORMATS = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_SA: /^(\+966|966|0)?[5-9][0-9]{8}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  URL: /^https?:\/\/.+/,
  IP: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'هذا الحقل مطلوب',
  INVALID_EMAIL: 'البريد الإلكتروني غير صحيح',
  INVALID_PHONE: 'رقم الهاتف غير صحيح',
  INVALID_PASSWORD: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وتشمل حروف كبيرة وصغيرة وأرقام ورموز',
  INVALID_USERNAME: 'اسم المستخدم يجب أن يكون بين 3-20 حرف ويحتوي على أحرف وأرقام وشرطة سفلية فقط',
  PASSWORD_MISMATCH: 'كلمة المرور غير متطابقة',
  FILE_TOO_LARGE: 'الملف كبير جداً',
  FILE_TYPE_NOT_ALLOWED: 'نوع الملف غير مسموح',
  NETWORK_ERROR: 'خطأ في الشبكة',
  SERVER_ERROR: 'خطأ في الخادم',
  UNAUTHORIZED: 'غير مصرح لك بالوصول',
  FORBIDDEN: 'ممنوع الوصول',
  NOT_FOUND: 'غير موجود',
  RATE_LIMITED: 'تم تجاوز الحد الأقصى للطلبات',
  VALIDATION_ERROR: 'خطأ في التحقق من البيانات'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'تم الحفظ بنجاح',
  UPDATED: 'تم التحديث بنجاح',
  DELETED: 'تم الحذف بنجاح',
  SENT: 'تم الإرسال بنجاح',
  UPLOADED: 'تم الرفع بنجاح',
  LOGGED_IN: 'تم تسجيل الدخول بنجاح',
  LOGGED_OUT: 'تم تسجيل الخروج بنجاح',
  REGISTERED: 'تم التسجيل بنجاح',
  PASSWORD_CHANGED: 'تم تغيير كلمة المرور بنجاح',
  PROFILE_UPDATED: 'تم تحديث الملف الشخصي بنجاح'
};

// Loading States
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
    DELETE: '/api/user/delete'
  },
  TICKETS: {
    LIST: '/api/tickets',
    CREATE: '/api/tickets',
    UPDATE: '/api/tickets/:id',
    DELETE: '/api/tickets/:id',
    CHAT: '/api/tickets/:id/chat'
  },
  BROKERS: {
    LIST: '/api/brokers',
    CREATE: '/api/brokers',
    UPDATE: '/api/brokers/:id',
    DELETE: '/api/brokers/:id',
    REQUEST: '/api/brokers/request'
  },
  ADMIN: {
    STATS: '/api/admin/stats',
    TICKETS: '/api/admin/tickets',
    USERS: '/api/admin/users',
    BROKERS: '/api/admin/brokers'
  },
  UPLOAD: '/api/upload',
  NOTIFICATIONS: '/api/notifications',
  MEDIATION: {
    LIST: '/api/mediation-requests',
    CREATE: '/api/mediation-requests',
    GET: '/api/mediation-requests/:id',
    JOIN: '/api/mediation-requests/:id/join',
    USERS: '/api/mediation-requests/:id/users',
    CHAT: '/api/mediation-requests/:id/chat'
  }
};

// Socket Events
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_TICKET: 'join-ticket',
  LEAVE_TICKET: 'leave-ticket',
  SEND_MESSAGE: 'send-message',
  NEW_MESSAGE: 'new-message',
  TYPING: 'typing',
  USER_TYPING: 'user-typing',
  MESSAGE_READ: 'message-read',
  ERROR: 'error'
};

// Feature Flags
export const FEATURE_FLAGS = {
  CHAT_ENABLED: true,
  FILE_UPLOAD_ENABLED: true,
  VOICE_MESSAGES_ENABLED: false,
  VIDEO_CALLS_ENABLED: false,
  DARK_MODE_ENABLED: true,
  NOTIFICATIONS_ENABLED: true,
  ANALYTICS_ENABLED: true,
  DEBUG_MODE: process.env.NODE_ENV === 'development'
};
