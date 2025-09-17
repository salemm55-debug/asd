// Utility functions for Wasitak Platform

/**
 * Format currency values with proper localization
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'SAR')
 * @param {string} locale - Locale string (default: 'ar-SA')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'SAR', locale = 'ar-SA') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${amount} ${currency}`;
  }
};

/**
 * Format numbers with proper localization
 * @param {number} number - The number to format
 * @param {string} locale - Locale string (default: 'ar-SA')
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, locale = 'ar-SA') => {
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
};

/**
 * Format date with proper localization
 * @param {Date|string} date - The date to format
 * @param {string} locale - Locale string (default: 'ar-SA')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'ar-SA', options = {}) => {
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(new Date(date));
  } catch (error) {
    console.error('Error formatting date:', error);
    return new Date(date).toLocaleDateString();
  }
};

/**
 * Format time with proper localization
 * @param {Date|string} date - The date to format
 * @param {string} locale - Locale string (default: 'ar-SA')
 * @returns {string} Formatted time string
 */
export const formatTime = (date, locale = 'ar-SA') => {
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(date));
  } catch (error) {
    console.error('Error formatting time:', error);
    return new Date(date).toLocaleTimeString();
  }
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Saudi format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone number
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+966|966|0)?[5-9][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitize HTML content
 * @param {string} html - HTML string to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Check if device is touch enabled
 * @returns {boolean} True if touch enabled
 */
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get device type
 * @returns {string} Device type (mobile, tablet, desktop)
 */
export const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

/**
 * Local storage helpers with error handling
 */
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

/**
 * API request helper with error handling
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API response
 */
export const apiRequest = async (url, options = {}) => {
  try {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API request error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate random color
 * @returns {string} Random hex color
 */
export const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Generate gradient colors
 * @param {string} color1 - First color
 * @param {string} color2 - Second color
 * @param {string} direction - Gradient direction (default: '135deg')
 * @returns {string} CSS gradient
 */
export const generateGradient = (color1, color2, direction = '135deg') => {
  return `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;
};

/**
 * Calculate reading time for text
 * @param {string} text - Text to calculate reading time for
 * @param {number} wordsPerMinute - Reading speed (default: 200)
 * @returns {number} Reading time in minutes
 */
export const calculateReadingTime = (text, wordsPerMinute = 200) => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Smooth scroll to element
 * @param {string|Element} target - Target element or selector
 * @param {number} offset - Offset from top (default: 0)
 */
export const smoothScrollTo = (target, offset = 0) => {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (element) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
};

/**
 * Get query parameters from URL
 * @param {string} url - URL to parse (default: current URL)
 * @returns {object} Query parameters object
 */
export const getQueryParams = (url = window.location.href) => {
  const params = new URLSearchParams(new URL(url).search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

/**
 * Set query parameters in URL
 * @param {object} params - Parameters to set
 * @param {boolean} replace - Replace current history entry (default: true)
 */
export const setQueryParams = (params, replace = true) => {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  
  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
};
