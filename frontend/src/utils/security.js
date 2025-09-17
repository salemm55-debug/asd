// Security utilities for Wasitak Platform

import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return input.replace(/[&<>"'`=\/]/g, (s) => map[s]);
};

/**
 * Validate and sanitize HTML content
 * @param {string} html - HTML content to validate
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  
  // Create a temporary div element
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {object} Validation result
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!VALIDATION_RULES.EMAIL.test(trimmedEmail)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL };
  }
  
  // Additional security checks
  if (trimmedEmail.length > 254) {
    return { isValid: false, error: 'البريد الإلكتروني طويل جداً' };
  }
  
  if (trimmedEmail.includes('..') || trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    return { isValid: false, error: 'البريد الإلكتروني غير صحيح' };
  }
  
  return { isValid: true, email: trimmedEmail };
};

/**
 * Validate phone number (Saudi format)
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  
  const cleanedPhone = phone.replace(/\s/g, '');
  
  if (!VALIDATION_RULES.PHONE_SA.test(cleanedPhone)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PHONE };
  }
  
  // Normalize phone number
  let normalizedPhone = cleanedPhone;
  if (normalizedPhone.startsWith('0')) {
    normalizedPhone = '+966' + normalizedPhone.substring(1);
  } else if (normalizedPhone.startsWith('966')) {
    normalizedPhone = '+' + normalizedPhone;
  } else if (!normalizedPhone.startsWith('+966')) {
    normalizedPhone = '+966' + normalizedPhone;
  }
  
  return { isValid: true, phone: normalizedPhone };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'كلمة المرور طويلة جداً' };
  }
  
  if (!VALIDATION_RULES.PASSWORD.test(password)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PASSWORD };
  }
  
  // Check for common passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234567890', 'password1', 'qwerty123', 'dragon', 'master'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    return { isValid: false, error: 'كلمة المرور ضعيفة جداً' };
  }
  
  return { isValid: true };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {object} Validation result
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED };
  }
  
  const trimmedUsername = username.trim();
  
  if (trimmedUsername.length < 3) {
    return { isValid: false, error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' };
  }
  
  if (trimmedUsername.length > 20) {
    return { isValid: false, error: 'اسم المستخدم يجب أن يكون 20 حرف على الأكثر' };
  }
  
  if (!VALIDATION_RULES.USERNAME.test(trimmedUsername)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_USERNAME };
  }
  
  return { isValid: true, username: trimmedUsername };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {object} options - Validation options
 * @returns {object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB
    allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
  } = options;
  
  if (!file || !(file instanceof File)) {
    return { isValid: false, error: 'ملف غير صحيح' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: `الملف كبير جداً. الحد الأقصى ${Math.round(maxSize / 1024 / 1024)} ميجابايت` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'نوع الملف غير مسموح' };
  }
  
  // Check file extension
  const fileName = file.name.toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.pdf', '.doc', '.docx', '.txt'];
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    return { isValid: false, error: 'امتداد الملف غير مسموح' };
  }
  
  return { isValid: true };
};

/**
 * Generate secure random token
 * @param {number} length - Token length
 * @returns {string} Random token
 */
export const generateSecureToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
  } else {
    // Fallback for older browsers
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return result;
};

/**
 * Hash password using Web Crypto API
 * @param {string} password - Password to hash
 * @returns {Promise<string>} Hashed password
 */
export const hashPassword = async (password) => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('خطأ في تشفير كلمة المرور');
  }
};

/**
 * Verify password against hash
 * @param {string} password - Password to verify
 * @param {string} hash - Hash to compare against
 * @returns {Promise<boolean>} True if password matches
 */
export const verifyPassword = async (password, hash) => {
  try {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
};

/**
 * Check if string contains malicious content
 * @param {string} input - Input to check
 * @returns {boolean} True if malicious content detected
 */
export const containsMaliciousContent = (input) => {
  if (typeof input !== 'string') return false;
  
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
    /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi,
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
    /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*<\/input>/gi,
    /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi,
    /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi,
    /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi,
    /<option\b[^<]*(?:(?!<\/option>)<[^<]*)*<\/option>/gi,
    /<optgroup\b[^<]*(?:(?!<\/optgroup>)<[^<]*)*<\/optgroup>/gi,
    /<fieldset\b[^<]*(?:(?!<\/fieldset>)<[^<]*)*<\/fieldset>/gi,
    /<legend\b[^<]*(?:(?!<\/legend>)<[^<]*)*<\/legend>/gi,
    /<label\b[^<]*(?:(?!<\/label>)<[^<]*)*<\/label>/gi,
    /<output\b[^<]*(?:(?!<\/output>)<[^<]*)*<\/output>/gi,
    /<progress\b[^<]*(?:(?!<\/progress>)<[^<]*)*<\/progress>/gi,
    /<meter\b[^<]*(?:(?!<\/meter>)<[^<]*)*<\/meter>/gi,
    /<details\b[^<]*(?:(?!<\/details>)<[^<]*)*<\/details>/gi,
    /<summary\b[^<]*(?:(?!<\/summary>)<[^<]*)*<\/summary>/gi,
    /<dialog\b[^<]*(?:(?!<\/dialog>)<[^<]*)*<\/dialog>/gi,
    /<menu\b[^<]*(?:(?!<\/menu>)<[^<]*)*<\/menu>/gi,
    /<menuitem\b[^<]*(?:(?!<\/menuitem>)<[^<]*)*<\/menuitem>/gi,
    /<command\b[^<]*(?:(?!<\/command>)<[^<]*)*<\/command>/gi,
    /<keygen\b[^<]*(?:(?!<\/keygen>)<[^<]*)*<\/keygen>/gi,
    /<source\b[^<]*(?:(?!<\/source>)<[^<]*)*<\/source>/gi,
    /<track\b[^<]*(?:(?!<\/track>)<[^<]*)*<\/track>/gi,
    /<video\b[^<]*(?:(?!<\/video>)<[^<]*)*<\/video>/gi,
    /<audio\b[^<]*(?:(?!<\/audio>)<[^<]*)*<\/audio>/gi,
    /<canvas\b[^<]*(?:(?!<\/canvas>)<[^<]*)*<\/canvas>/gi,
    /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi,
    /<math\b[^<]*(?:(?!<\/math>)<[^<]*)*<\/math>/gi,
    /<table\b[^<]*(?:(?!<\/table>)<[^<]*)*<\/table>/gi,
    /<caption\b[^<]*(?:(?!<\/caption>)<[^<]*)*<\/caption>/gi,
    /<col\b[^<]*(?:(?!<\/col>)<[^<]*)*<\/col>/gi,
    /<colgroup\b[^<]*(?:(?!<\/colgroup>)<[^<]*)*<\/colgroup>/gi,
    /<tbody\b[^<]*(?:(?!<\/tbody>)<[^<]*)*<\/tbody>/gi,
    /<thead\b[^<]*(?:(?!<\/thead>)<[^<]*)*<\/thead>/gi,
    /<tfoot\b[^<]*(?:(?!<\/tfoot>)<[^<]*)*<\/tfoot>/gi,
    /<tr\b[^<]*(?:(?!<\/tr>)<[^<]*)*<\/tr>/gi,
    /<td\b[^<]*(?:(?!<\/td>)<[^<]*)*<\/td>/gi,
    /<th\b[^<]*(?:(?!<\/th>)<[^<]*)*<\/th>/gi,
    /<ul\b[^<]*(?:(?!<\/ul>)<[^<]*)*<\/ul>/gi,
    /<ol\b[^<]*(?:(?!<\/ol>)<[^<]*)*<\/ol>/gi,
    /<li\b[^<]*(?:(?!<\/li>)<[^<]*)*<\/li>/gi,
    /<dl\b[^<]*(?:(?!<\/dl>)<[^<]*)*<\/dl>/gi,
    /<dt\b[^<]*(?:(?!<\/dt>)<[^<]*)*<\/dt>/gi,
    /<dd\b[^<]*(?:(?!<\/dd>)<[^<]*)*<\/dd>/gi,
    /<div\b[^<]*(?:(?!<\/div>)<[^<]*)*<\/div>/gi,
    /<span\b[^<]*(?:(?!<\/span>)<[^<]*)*<\/span>/gi,
    /<p\b[^<]*(?:(?!<\/p>)<[^<]*)*<\/p>/gi,
    /<h[1-6]\b[^<]*(?:(?!<\/h[1-6]>)<[^<]*)*<\/h[1-6]>/gi,
    /<a\b[^<]*(?:(?!<\/a>)<[^<]*)*<\/a>/gi,
    /<img\b[^<]*(?:(?!<\/img>)<[^<]*)*>/gi,
    /<br\b[^<]*(?:(?!<\/br>)<[^<]*)*>/gi,
    /<hr\b[^<]*(?:(?!<\/hr>)<[^<]*)*>/gi,
    /<wbr\b[^<]*(?:(?!<\/wbr>)<[^<]*)*>/gi,
    /<area\b[^<]*(?:(?!<\/area>)<[^<]*)*>/gi,
    /<base\b[^<]*(?:(?!<\/base>)<[^<]*)*>/gi,
    /<col\b[^<]*(?:(?!<\/col>)<[^<]*)*>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*>/gi,
    /<hr\b[^<]*(?:(?!<\/hr>)<[^<]*)*>/gi,
    /<img\b[^<]*(?:(?!<\/img>)<[^<]*)*>/gi,
    /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*>/gi,
    /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*>/gi,
    /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*>/gi,
    /<param\b[^<]*(?:(?!<\/param>)<[^<]*)*>/gi,
    /<source\b[^<]*(?:(?!<\/source>)<[^<]*)*>/gi,
    /<track\b[^<]*(?:(?!<\/track>)<[^<]*)*>/gi,
    /<wbr\b[^<]*(?:(?!<\/wbr>)<[^<]*)*>/gi
  ];
  
  return maliciousPatterns.some(pattern => pattern.test(input));
};

/**
 * Rate limiting implementation
 * @param {string} key - Rate limit key
 * @param {number} limit - Request limit
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} True if within rate limit
 */
export const checkRateLimit = (key, limit, windowMs) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Get existing requests from localStorage
  const requests = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
  
  // Filter requests within the time window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  // Check if limit exceeded
  if (validRequests.length >= limit) {
    return false;
  }
  
  // Add current request
  validRequests.push(now);
  
  // Save back to localStorage
  localStorage.setItem(`rate_limit_${key}`, JSON.stringify(validRequests));
  
  return true;
};

/**
 * Content Security Policy helper
 * @param {string} content - Content to check
 * @returns {boolean} True if content is safe
 */
export const isContentSafe = (content) => {
  if (typeof content !== 'string') return true;
  
  // Check for script tags
  if (/<script/i.test(content)) return false;
  
  // Check for javascript: protocol
  if (/javascript:/i.test(content)) return false;
  
  // Check for event handlers
  if (/on\w+\s*=/i.test(content)) return false;
  
  // Check for iframe tags
  if (/<iframe/i.test(content)) return false;
  
  // Check for object tags
  if (/<object/i.test(content)) return false;
  
  // Check for embed tags
  if (/<embed/i.test(content)) return false;
  
  return true;
};

/**
 * Validate URL for security
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is safe
 */
export const isUrlSafe = (url) => {
  if (typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /ftp:/i
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(url))) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Generate CSRF token
 * @returns {string} CSRF token
 */
export const generateCSRFToken = () => {
  return generateSecureToken(32);
};

/**
 * Validate CSRF token
 * @param {string} token - Token to validate
 * @param {string} expectedToken - Expected token
 * @returns {boolean} True if token is valid
 */
export const validateCSRFToken = (token, expectedToken) => {
  if (!token || !expectedToken) return false;
  return token === expectedToken;
};

/**
 * Escape HTML entities
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  if (typeof text !== 'string') return text;
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  
  return text.replace(/[&<>"'\/]/g, (s) => map[s]);
};

/**
 * Unescape HTML entities
 * @param {string} text - Text to unescape
 * @returns {string} Unescaped text
 */
export const unescapeHtml = (text) => {
  if (typeof text !== 'string') return text;
  
  const map = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/'
  };
  
  return text.replace(/&(amp|lt|gt|quot|#39|#x2F);/g, (match) => map[match]);
};
