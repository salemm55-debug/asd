const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { 
  db, addActiveUser, removeActiveUser, isUserActive, updateUserActivity, generateTicketId,
  addMediationChatMessage, getMediationChatMessages, createMediationRequest, 
  joinMediationRequest, getMediationRequest, getMediationUsers
} = require('./database');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || '84311e590d4692ca767c0db9da51952f';

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(compression());
app.use(hpp());
app.use(express.json());
app.use(morgan('tiny'));

// Basic rate limit
const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 300 })
app.use(limiter)

// SQL Injection Protection Middleware
const sqlInjectionProtection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(\b(OR|AND)\s+['"]\s*=\s*['"])/gi,
    /(\b(OR|AND)\s+['"]\s*LIKE\s*['"])/gi,
    /(\bUNION\s+SELECT)/gi,
    /(\bDROP\s+TABLE)/gi,
    /(\bINSERT\s+INTO)/gi,
    /(\bDELETE\s+FROM)/gi,
    /(\bUPDATE\s+SET)/gi,
    /(\bEXEC\s*\()/gi,
    /(\bSCRIPT\s*>)/gi,
    /(\b--\s*)/gi,
    /(\b\/\*.*\*\/)/gi,
    /(\bWAITFOR\s+DELAY)/gi,
    /(\bBENCHMARK\s*\()/gi
  ];

  const checkValue = (value) => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    return false;
  };

  const checkObject = (obj) => {
    for (const key in obj) {
      if (checkValue(obj[key])) {
        return true;
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (checkObject(obj[key])) {
          return true;
        }
      }
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    return res.status(400).json({ 
      error: 'طلب غير صالح - تم رفضه لأسباب أمنية',
      code: 'SQL_INJECTION_DETECTED'
    });
  }

  next();
};

// Input Validation Middleware
const validateInput = (req, res, next) => {
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return validator.escape(str.trim());
  };

  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeString(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);

  next();
};

app.use(sqlInjectionProtection);

// Input validation and sanitization middleware
const validateAndSanitizeInput = (req, res, next) => {
  // Sanitize string inputs
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return validator.escape(str.trim());
  };

  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    } else if (obj && typeof obj === 'object') {
      const sanitized = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    } else if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

app.use(validateAndSanitizeInput);

// نظام التحقق من صحة طلبات الوسيط
const validateBrokerRequest = (req, res, next) => {
  if (req.method !== 'POST') return next();
  
  const b = req.body || {};
  const errors = [];
  
  // التحقق من الحقول المطلوبة
  if (!b.user_id) errors.push('معرف المستخدم مطلوب');
  if (!b.title) errors.push('العنوان مطلوب');
  if (!b.description) errors.push('الوصف مطلوب');
  if (!b.category) errors.push('التصنيف مطلوب');
  if (!b.contact_info) errors.push('معلومات الاتصال مطلوبة');
  
  // التحقق من أطوال النصوص
  if (b.title && (b.title.trim().length < 3 || b.title.length > 200)) {
    errors.push('العنوان يجب أن يكون بين 3-200 حرف');
  }
  
  if (b.description && (b.description.trim().length < 10 || b.description.length > 2000)) {
    errors.push('الوصف يجب أن يكون بين 10-2000 حرف');
  }
  
  if (b.location && b.location.length > 200) {
    errors.push('الموقع بحد أقصى 200 حرف');
  }
  
  if (b.requirements && b.requirements.length > 1000) {
    errors.push('المتطلبات بحد أقصى 1000 حرف');
  }
  
  // التحقق من السعر
  if (b.price !== undefined && b.price !== null) {
    const priceNum = Number(b.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      errors.push('السعر يجب أن يكون رقم صحيح أكبر من صفر');
    }
  }
  
  // التحقق من رقم الهاتف
  if (b.contact_info) {
    const rawPhone = validator.unescape(b.contact_info.toString());
    const phoneRegex = /^(\+966|0)?[5-9][0-9]{8}$/;
    if (!phoneRegex.test(rawPhone.replace(/\s/g, ''))) {
      errors.push('يرجى إدخال رقم هاتف سعودي صحيح');
    }
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ 
      error: 'بيانات غير صالحة', 
      details: errors 
    });
  }
  
  next();
};

// تطبيق التحقق على طلبات الوسيط
app.use('/api/broker-requests', validateBrokerRequest);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'رمز الوصول مطلوب' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'رمز الوصول غير صالح' });
    }
    req.user = user;
    next();
  });
};

// Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'رمز الوصول مطلوب' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'رمز الوصول غير صالح' });
    }
    
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      return res.status(403).json({ error: 'صلاحيات غير كافية' });
    }
    
    req.user = user;
    next();
  });
};

// Session Authentication Middleware
const authenticateSession = async (req, res, next) => {
  try {
    const { user_id, session_id } = req.body;
    
    if (!user_id) {
      return res.status(401).json({ error: 'معرف المستخدم مطلوب' });
    }

    // التحقق من وجود الجلسة
    const session = db.prepare(`
      SELECT data FROM session_data WHERE user_id = ?
    `).get(user_id);
    
    if (!session) {
      return res.status(401).json({ 
        error: 'الجلسة غير موجودة',
        code: 'SESSION_NOT_FOUND'
      });
    }
    
    const sessionData = JSON.parse(session.data);
    
    // التحقق من معرف الجلسة إذا تم توفيره
    if (session_id && sessionData.sessionId !== session_id) {
      return res.status(403).json({ 
        error: 'معرف الجلسة غير صحيح',
        code: 'INVALID_SESSION_ID'
      });
    }
    
    // التحقق من انتهاء صلاحية الجلسة
    const lastActivity = new Date(sessionData.lastActivity);
    const now = new Date();
    const daysDiff = (now - lastActivity) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      // حذف الجلسة المنتهية الصلاحية
      db.prepare('DELETE FROM session_data WHERE user_id = ?').run(user_id);
      removeActiveUser(sessionData.nickname);
      return res.status(410).json({ 
        error: 'انتهت صلاحية الجلسة',
        code: 'SESSION_EXPIRED'
      });
    }
    
    // تحديث وقت آخر نشاط
    sessionData.lastActivity = new Date().toISOString();
    db.prepare(`
      UPDATE session_data 
      SET data = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ?
    `).run(JSON.stringify(sessionData), user_id);
    
    // إضافة بيانات الجلسة للطلب
    req.session = sessionData;
    req.user = {
      id: sessionData.userId,
      nickname: sessionData.nickname,
      role: sessionData.userRole
    };
    
    next();
  } catch (error) {
    console.error('خطأ في التحقق من الجلسة:', error);
    res.status(500).json({ error: 'خطأ في التحقق من الجلسة' });
  }
};

const clientBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
const publicPath = path.join(__dirname, '..', 'frontend', 'public');

app.use('/assets', express.static(path.join(clientBuildPath, 'assets'), { maxAge: '7d', immutable: true }));
app.use(express.static(publicPath, { maxAge: '1d' }));
app.use(express.static(clientBuildPath, { maxAge: '1d' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'wasitak', year: 2025 });
});

// Analytics endpoint
app.post('/api/analytics', (req, res) => {
  try {
    const { type, name, properties, sessionId, userId, path: reqPath, url, timestamp } = req.body || {};
    const insertAnalytics = db.prepare(`
      INSERT INTO analytics_events (type, name, properties, session_id, user_id, path, url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insertAnalytics.run(
      type || 'custom_event',
      name || null,
      JSON.stringify(properties || {}),
      sessionId || null,
      userId || null,
      reqPath || null,
      url || null
    );
    res.json({ success: true });
  } catch (error) {
    console.error('خطأ في حفظ التحليلات:', error);
    res.status(500).json({ error: 'خطأ في حفظ التحليلات' });
  }
});

// API لإدارة المستخدمين النشطين مع نظام الجلسات
app.post('/api/users/login', async (req, res) => {
  try {
    const { nickname, user_role, ticket_id } = req.body;
    
    if (!nickname || nickname.length < 3) {
      return res.status(400).json({ error: 'اسم المستخدم غير صالح' });
    }

    // التحقق من أن الاسم غير مستخدم حالياً
    const activeUser = isUserActive(nickname);
    if (activeUser) {
      return res.status(409).json({ 
        error: 'هذا الاسم مستخدم حالياً من قبل مستخدم آخر',
        code: 'NICKNAME_IN_USE'
      });
    }

    // إنشاء معرف مستخدم فريد
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // إنشاء جلسة جديدة
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const sessionData = {
      sessionId,
      userId,
      nickname,
      userRole: user_role || null,
      ticketId: ticket_id || null,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true
    };

    // إنشاء المستخدم في جدول users أولاً
    try {
      const insertUser = db.prepare(`
        INSERT OR REPLACE INTO users (id, nickname, last_login)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);
      insertUser.run(userId, nickname);
    } catch (userError) {
      console.error('خطأ في إنشاء المستخدم:', userError);
      throw new Error('فشل في إنشاء المستخدم');
    }
    
    // حفظ الجلسة في قاعدة البيانات
    try {
      const insertSession = db.prepare(`
        INSERT OR REPLACE INTO session_data (user_id, data, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);
      insertSession.run(userId, JSON.stringify(sessionData));
    } catch (sessionError) {
      console.error('خطأ في إنشاء الجلسة:', sessionError);
      throw new Error('فشل في إنشاء الجلسة');
    }
    
    // إضافة المستخدم للمستخدمين النشطين
    addActiveUser(nickname, userId);

    res.json({ 
      success: true, 
      userId,
      nickname,
      sessionId,
      sessionData,
      message: 'تم تسجيل الدخول بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تسجيل الدخول:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

app.post('/api/users/logout', (req, res) => {
  try {
    const { user_id, nickname } = req.body;
    
    if (!user_id && !nickname) {
      return res.status(400).json({ error: 'معرف المستخدم أو الاسم مطلوب' });
    }

    // إذا تم توفير معرف المستخدم، حذف الجلسة
    if (user_id) {
      // جلب بيانات الجلسة قبل الحذف
      const session = db.prepare(`
        SELECT data FROM session_data WHERE user_id = ?
      `).get(user_id);
      
      if (session) {
        const sessionData = JSON.parse(session.data);
        removeActiveUser(sessionData.nickname);
      }
      
      // حذف الجلسة
      db.prepare('DELETE FROM session_data WHERE user_id = ?').run(user_id);
    }
    
    // إذا تم توفير الاسم فقط، حذف من المستخدمين النشطين
    if (nickname) {
      removeActiveUser(nickname);
    }
    
    res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

app.get('/api/users/check/:nickname', (req, res) => {
  try {
    const { nickname } = req.params;
    const activeUser = isUserActive(nickname);
    
    res.json({ 
      isActive: !!activeUser,
      user: activeUser || null
    });
  } catch (error) {
    console.error('خطأ في التحقق من المستخدم:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// نظام التعويض
app.post('/api/compensations', (req, res) => {
  try {
    const { user_id, ticket_id, amount, reason } = req.body;
    const compensationId = generateTicketId();

    const insertCompensation = db.prepare(`
      INSERT INTO compensations (id, user_id, ticket_id, amount, reason)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertCompensation.run(compensationId, user_id, ticket_id, amount, reason);
    res.json({ id: compensationId, message: 'تم تقديم طلب التعويض بنجاح' });
  } catch (error) {
    console.error('خطأ في إنشاء طلب التعويض:', error);
    res.status(500).json({ error: 'خطأ في إنشاء طلب التعويض' });
  }
});

app.get('/api/compensations/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    const compensations = db.prepare(`
      SELECT * FROM compensations WHERE user_id = ? ORDER BY created_at DESC
    `).all(user_id);
    
    res.json(compensations);
  } catch (error) {
    console.error('خطأ في جلب طلبات التعويض:', error);
    res.status(500).json({ error: 'خطأ في جلب طلبات التعويض' });
  }
});

app.put('/api/compensations/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const updateCompensation = db.prepare(`
      UPDATE compensations 
      SET status = ?, admin_notes = ?, approved_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateCompensation.run(status, admin_notes, id);
    res.json({ message: 'تم تحديث حالة التعويض بنجاح' });
  } catch (error) {
    console.error('خطأ في تحديث حالة التعويض:', error);
    res.status(500).json({ error: 'خطأ في تحديث حالة التعويض' });
  }
});

// API Routes

// الوسطاء
app.get('/api/brokers', (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = 'SELECT * FROM brokers WHERE status = "active"';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else if (sort === 'experience') {
      query += ' ORDER BY CAST(SUBSTR(experience, 1, 2) AS INTEGER) DESC';
    } else if (sort === 'deals') {
      query += ' ORDER BY completed_deals DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const brokers = db.prepare(query).all(...params);
    
    // تحويل JSON strings إلى objects
    const formattedBrokers = brokers.map(broker => ({
      ...broker,
      specialties: JSON.parse(broker.specialties),
      languages: JSON.parse(broker.languages)
    }));

    res.json(formattedBrokers);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الوسطاء' });
  }
});

app.get('/api/brokers/:id', (req, res) => {
  try {
    const broker = db.prepare('SELECT * FROM brokers WHERE id = ?').get(req.params.id);
    if (!broker) {
      return res.status(404).json({ error: 'الوسيط غير موجود' });
    }

    const formattedBroker = {
      ...broker,
      specialties: JSON.parse(broker.specialties),
      languages: JSON.parse(broker.languages)
    };

    res.json(formattedBroker);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب بيانات الوسيط' });
  }
});

// طلبات الوسيط
app.get('/api/broker-requests', (req, res) => {
  try {
    const { user_id, status } = req.query;
    let query = 'SELECT * FROM broker_requests';
    const params = [];

    if (user_id) {
      query += ' WHERE user_id = ?';
      params.push(user_id);
    }

    if (status) {
      query += user_id ? ' AND status = ?' : ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const requests = db.prepare(query).all(...params);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب طلبات الوسيط' });
  }
});

app.post('/api/broker-requests', (req, res) => {
  try {
    const {
      user_id, title, description, category, price, location,
      contact_info, requirements, user_role, deadline
    } = req.body;

    const insertRequest = db.prepare(`
      INSERT INTO broker_requests (
        user_id, title, description, category, price, location,
        contact_info, requirements, user_role, deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insertRequest.run(
      user_id, title, description, category, price, location,
      contact_info, requirements, user_role || 'buyer', deadline
    );

    // إنشاء رقم تذكرة فريد
    const ticketNumber = `BR${String(result.lastInsertRowid).padStart(6, '0')}`;
    
    res.json({ 
      id: result.lastInsertRowid,
      ticket_number: ticketNumber,
      message: 'تم إنشاء طلب الوسيط بنجاح',
      redirect_url: `/ticket?id=${ticketNumber}`
    });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إنشاء طلب الوسيط' });
  }
});

app.put('/api/broker-requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, description, category, price, location,
      contact_info, requirements, user_role, deadline, status
    } = req.body;

    const updateRequest = db.prepare(`
      UPDATE broker_requests SET
        title = ?, description = ?, category = ?, price = ?,
        location = ?, contact_info = ?, requirements = ?,
        user_role = ?, deadline = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateRequest.run(
      title, description, category, price, location,
      contact_info, requirements, user_role, deadline, status, id
    );

    res.json({ message: 'تم تحديث الطلب بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تحديث طلب الوسيط' });
  }
});

app.delete('/api/broker-requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM broker_requests WHERE id = ?').run(id);
    res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في حذف طلب الوسيط' });
  }
});

// API endpoint لجلب تفاصيل التذكرة باستخدام رقم التذكرة
app.get('/api/broker-requests/ticket/:ticketNumber', (req, res) => {
  try {
    const { ticketNumber } = req.params;
    
    // التحقق من صيغة رقم التذكرة
    if (!ticketNumber.startsWith('BR') || ticketNumber.length !== 8) {
      return res.status(400).json({ 
        error: 'رقم التذكرة غير صحيح',
        code: 'INVALID_TICKET_FORMAT'
      });
    }
    
    // استخراج الرقم من BR000001
    const ticketId = parseInt(ticketNumber.substring(2));
    
    if (isNaN(ticketId) || ticketId <= 0) {
      return res.status(400).json({ 
        error: 'رقم التذكرة غير صحيح',
        code: 'INVALID_TICKET_ID'
      });
    }

    // جلب تفاصيل الطلب مع معلومات الوسيط إذا كان مُعين
    const query = `
      SELECT 
        br.*,
        b.name as broker_name,
        b.title as broker_title,
        b.phone as broker_phone,
        b.email as broker_email,
        b.rating as broker_rating,
        b.reviews_count as broker_reviews_count,
        b.response_time as broker_response_time,
        b.avatar_url as broker_avatar_url
      FROM broker_requests br
      LEFT JOIN brokers b ON br.broker_id = b.id
      WHERE br.id = ?
    `;
    
    const ticket = db.prepare(query).get(ticketId);
    
    if (!ticket) {
      return res.status(404).json({ 
        error: 'التذكرة غير موجودة',
        code: 'TICKET_NOT_FOUND'
      });
    }

    // ترجمة حالة الطلب إلى العربية
    const statusMap = {
      'pending': 'في الانتظار',
      'assigned': 'تم التعيين',
      'in_progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'cancelled': 'ملغى'
    };

    // ترجمة التصنيف إلى العربية
    const categoryMap = {
      'real-estate': 'عقارات',
      'vehicles': 'مركبات',
      'electronics': 'إلكترونيات',
      'furniture': 'أثاث',
      'services': 'خدمات',
      'other': 'أخرى'
    };

    // تنسيق الاستجابة
    const response = {
      id: ticket.id,
      ticketNumber: `BR${String(ticket.id).padStart(6, '0')}`,
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      categoryText: categoryMap[ticket.category] || ticket.category,
      price: ticket.price,
      location: ticket.location,
      contactInfo: ticket.contact_info,
      requirements: ticket.requirements,
      userRole: ticket.user_role,
      deadline: ticket.deadline,
      status: ticket.status,
      statusText: statusMap[ticket.status] || ticket.status,
      createdAt: ticket.created_at,
      updatedAt: ticket.updated_at,
      broker: ticket.broker_id ? {
        id: ticket.broker_id,
        name: ticket.broker_name,
        title: ticket.broker_title,
        phone: ticket.broker_phone,
        email: ticket.broker_email,
        rating: ticket.broker_rating,
        reviewsCount: ticket.broker_reviews_count,
        responseTime: ticket.broker_response_time,
        avatarUrl: ticket.broker_avatar_url
      } : null
    };

    res.json(response);
  } catch (error) {
    console.error('خطأ في جلب تفاصيل التذكرة:', error);
    res.status(500).json({ error: 'خطأ في جلب تفاصيل التذكرة' });
  }
});

// طلبات الوساطة
app.get('/api/mediation-requests', (req, res) => {
  try {
    const { user_id, status } = req.query;
    let query = `
      SELECT mr.*, 
             mu_buyer.name as buyer_name,
             mu_seller.name as seller_name,
             mu_broker.name as broker_name
      FROM mediation_requests mr
      LEFT JOIN mediation_users mu_buyer ON mr.buyer_id = mu_buyer.id AND mu_buyer.role = 'buyer'
      LEFT JOIN mediation_users mu_seller ON mr.seller_id = mu_seller.id AND mu_seller.role = 'seller'
      LEFT JOIN mediation_users mu_broker ON mr.broker_id = mu_broker.id AND mu_broker.role = 'broker'
    `;
    const params = [];

    if (user_id) {
      query += ' WHERE (mr.buyer_id = ? OR mr.seller_id = ? OR mr.broker_id = ?)';
      params.push(user_id, user_id, user_id);
    }

    if (status) {
      query += user_id ? ' AND mr.status = ?' : ' WHERE mr.status = ?';
      params.push(status);
    }

    query += ' ORDER BY mr.created_at DESC';

    const requests = db.prepare(query).all(...params);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب طلبات الوساطة' });
  }
});

app.post('/api/mediation-requests', (req, res) => {
  try {
    const { buyer_id, title, description, category, price, location } = req.body;

    // التحقق من البيانات المطلوبة
    if (!buyer_id || !title || !description || !category) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // التحقق من صحة البيانات
    if (title.length > 200) {
      return res.status(400).json({ error: 'عنوان الطلب طويل جداً (الحد الأقصى 200 حرف)' });
    }
    
    if (description.length > 2000) {
      return res.status(400).json({ error: 'وصف الطلب طويل جداً (الحد الأقصى 2000 حرف)' });
    }

    const requestId = createMediationRequest(buyer_id, title, description, category, price, location);
    res.json({ 
      id: requestId, 
      message: 'تم إنشاء طلب الوساطة بنجاح',
      redirectUrl: `/owqerioeqwirjoweiorioqwerioqwerijower?request=${requestId}`
    });
  } catch (error) {
    console.error('خطأ في إنشاء طلب الوساطة:', error);
    res.status(500).json({ error: 'خطأ في إنشاء طلب الوساطة' });
  }
});

app.get('/api/mediation-requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const request = getMediationRequest(id);
    
    if (!request) {
      return res.status(404).json({ error: 'طلب الوساطة غير موجود' });
    }
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب طلب الوساطة' });
  }
});

app.post('/api/mediation-requests/:id/join', (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, user_name, role } = req.body;

    // التحقق من البيانات المطلوبة
    if (!user_id || !user_name || !role) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // التحقق من صحة الدور
    if (!['buyer', 'seller', 'broker'].includes(role)) {
      return res.status(400).json({ error: 'الدور يجب أن يكون buyer أو seller أو broker' });
    }

    joinMediationRequest(id, user_id, user_name, role);
    res.json({ message: 'تم الانضمام للطلب بنجاح' });
  } catch (error) {
    console.error('خطأ في الانضمام للطلب:', error);
    res.status(500).json({ error: error.message || 'خطأ في الانضمام للطلب' });
  }
});

app.get('/api/mediation-requests/:id/users', (req, res) => {
  try {
    const { id } = req.params;
    const users = getMediationUsers(id);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب مستخدمي الطلب' });
  }
});

// المستخدمين
app.post('/api/users', (req, res) => {
  try {
    const { id, nickname, email, phone } = req.body;

    const insertUser = db.prepare(`
      INSERT OR REPLACE INTO users (id, nickname, email, phone, last_login)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    insertUser.run(id, nickname, email, phone);
    res.json({ message: 'تم حفظ بيانات المستخدم بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في حفظ بيانات المستخدم' });
  }
});

// API لحفظ إعدادات المستخدم
app.post('/api/user-settings', (req, res) => {
  try {
    const { user_id, settings } = req.body;

    const insertSettings = db.prepare(`
      INSERT OR REPLACE INTO user_settings (user_id, settings, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);

    insertSettings.run(user_id, JSON.stringify(settings));
    res.json({ message: 'تم حفظ الإعدادات بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في حفظ الإعدادات' });
  }
});

app.get('/api/user-settings/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    const settings = db.prepare(`
      SELECT settings FROM user_settings WHERE user_id = ?
    `).get(user_id);
    
    res.json(settings ? JSON.parse(settings.settings) : {});
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الإعدادات' });
  }
});

// نظام الجلسات المتقدم
// إنشاء جلسة جديدة
app.post('/api/sessions/create', (req, res) => {
  try {
    const { user_id, nickname, user_role, ticket_id } = req.body;
    
    if (!user_id || !nickname) {
      return res.status(400).json({ error: 'معرف المستخدم والاسم مطلوبان' });
    }

    // إنشاء معرف جلسة فريد
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // حفظ بيانات الجلسة
    const sessionData = {
      sessionId,
      userId: user_id,
      nickname,
      userRole: user_role || null,
      ticketId: ticket_id || null,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true
    };

    // إنشاء المستخدم في جدول users أولاً
    try {
      const insertUser = db.prepare(`
        INSERT OR REPLACE INTO users (id, nickname, last_login)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);
      insertUser.run(user_id, nickname);
    } catch (userError) {
      console.error('خطأ في إنشاء المستخدم:', userError);
      throw new Error('فشل في إنشاء المستخدم');
    }
    
    // حفظ الجلسة في قاعدة البيانات
    try {
      const insertSession = db.prepare(`
        INSERT OR REPLACE INTO session_data (user_id, data, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `);
      insertSession.run(user_id, JSON.stringify(sessionData));
    } catch (sessionError) {
      console.error('خطأ في إنشاء الجلسة:', sessionError);
      throw new Error('فشل في إنشاء الجلسة');
    }
    
    // إضافة المستخدم للمستخدمين النشطين
    addActiveUser(nickname, user_id);
    
    res.json({ 
      success: true,
      sessionId,
      sessionData,
      message: 'تم إنشاء الجلسة بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إنشاء الجلسة:', error);
    res.status(500).json({ error: 'خطأ في إنشاء الجلسة' });
  }
});

// تحديث الجلسة
app.put('/api/sessions/update', (req, res) => {
  try {
    const { user_id, session_data } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'معرف المستخدم مطلوب' });
    }

    // تحديث وقت آخر نشاط
    const updatedSessionData = {
      ...session_data,
      lastActivity: new Date().toISOString()
    };

    const updateSession = db.prepare(`
      UPDATE session_data 
      SET data = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ?
    `);

    const result = updateSession.run(JSON.stringify(updatedSessionData), user_id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'الجلسة غير موجودة' });
    }
    
    res.json({ 
      success: true,
      message: 'تم تحديث الجلسة بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تحديث الجلسة:', error);
    res.status(500).json({ error: 'خطأ في تحديث الجلسة' });
  }
});

// جلب بيانات الجلسة
app.get('/api/sessions/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    const session = db.prepare(`
      SELECT data FROM session_data WHERE user_id = ?
    `).get(user_id);
    
    if (!session) {
      return res.status(404).json({ error: 'الجلسة غير موجودة' });
    }
    
    const sessionData = JSON.parse(session.data);
    
    // التحقق من انتهاء صلاحية الجلسة (7 أيام)
    const lastActivity = new Date(sessionData.lastActivity);
    const now = new Date();
    const daysDiff = (now - lastActivity) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      // حذف الجلسة المنتهية الصلاحية
      db.prepare('DELETE FROM session_data WHERE user_id = ?').run(user_id);
      removeActiveUser(sessionData.nickname);
      return res.status(410).json({ error: 'انتهت صلاحية الجلسة' });
    }
    
    res.json({ 
      success: true,
      sessionData 
    });
  } catch (error) {
    console.error('خطأ في جلب الجلسة:', error);
    res.status(500).json({ error: 'خطأ في جلب الجلسة' });
  }
});

// التحقق من صحة الجلسة
app.post('/api/sessions/validate', (req, res) => {
  try {
    const { user_id, session_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({ error: 'معرف المستخدم مطلوب' });
    }

    const session = db.prepare(`
      SELECT data FROM session_data WHERE user_id = ?
    `).get(user_id);
    
    if (!session) {
      return res.status(404).json({ 
        valid: false,
        error: 'الجلسة غير موجودة' 
      });
    }
    
    const sessionData = JSON.parse(session.data);
    
    // التحقق من معرف الجلسة إذا تم توفيره
    if (session_id && sessionData.sessionId !== session_id) {
      return res.status(403).json({ 
        valid: false,
        error: 'معرف الجلسة غير صحيح' 
      });
    }
    
    // التحقق من انتهاء صلاحية الجلسة
    const lastActivity = new Date(sessionData.lastActivity);
    const now = new Date();
    const daysDiff = (now - lastActivity) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      // حذف الجلسة المنتهية الصلاحية
      db.prepare('DELETE FROM session_data WHERE user_id = ?').run(user_id);
      removeActiveUser(sessionData.nickname);
      return res.status(410).json({ 
        valid: false,
        error: 'انتهت صلاحية الجلسة' 
      });
    }
    
    // تحديث وقت آخر نشاط
    sessionData.lastActivity = new Date().toISOString();
    db.prepare(`
      UPDATE session_data 
      SET data = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ?
    `).run(JSON.stringify(sessionData), user_id);
    
    res.json({ 
      valid: true,
      sessionData 
    });
  } catch (error) {
    console.error('خطأ في التحقق من الجلسة:', error);
    res.status(500).json({ error: 'خطأ في التحقق من الجلسة' });
  }
});

// إنهاء الجلسة
app.delete('/api/sessions/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    
    // جلب بيانات الجلسة قبل الحذف
    const session = db.prepare(`
      SELECT data FROM session_data WHERE user_id = ?
    `).get(user_id);
    
    if (session) {
      const sessionData = JSON.parse(session.data);
      removeActiveUser(sessionData.nickname);
    }
    
    // حذف الجلسة
    const deleteSession = db.prepare('DELETE FROM session_data WHERE user_id = ?');
    const result = deleteSession.run(user_id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'الجلسة غير موجودة' });
    }
    
    res.json({ 
      success: true,
      message: 'تم إنهاء الجلسة بنجاح' 
    });
  } catch (error) {
    console.error('خطأ في إنهاء الجلسة:', error);
    res.status(500).json({ error: 'خطأ في إنهاء الجلسة' });
  }
});

// API لحفظ بيانات الجلسة (للتوافق مع الكود القديم)
app.post('/api/session-data', (req, res) => {
  try {
    const { user_id, session_data } = req.body;

    const insertSession = db.prepare(`
      INSERT OR REPLACE INTO session_data (user_id, data, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `);

    insertSession.run(user_id, JSON.stringify(session_data));
    res.json({ message: 'تم حفظ بيانات الجلسة بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في حفظ بيانات الجلسة' });
  }
});

app.get('/api/session-data/:user_id', (req, res) => {
  try {
    const { user_id } = req.params;
    const session = db.prepare(`
      SELECT data FROM session_data WHERE user_id = ?
    `).get(user_id);
    
    res.json(session ? JSON.parse(session.data) : {});
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب بيانات الجلسة' });
  }
});

// التقييمات
app.post('/api/reviews', (req, res) => {
  try {
    const { broker_id, user_id, request_id, rating, comment } = req.body;

    const insertReview = db.prepare(`
      INSERT INTO reviews (broker_id, user_id, request_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertReview.run(broker_id, user_id, request_id, rating, comment);

    // تحديث تقييم الوسيط
    const updateBrokerRating = db.prepare(`
      UPDATE brokers SET
        rating = (SELECT AVG(rating) FROM reviews WHERE broker_id = ?),
        reviews_count = (SELECT COUNT(*) FROM reviews WHERE broker_id = ?)
      WHERE id = ?
    `);

    updateBrokerRating.run(broker_id, broker_id, broker_id);

    res.json({ message: 'تم إضافة التقييم بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إضافة التقييم' });
  }
});

// Admin APIs
// تسجيل دخول الأدمن
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = db.prepare('SELECT * FROM admins WHERE username = ? AND is_active = 1').get(username);
    
    if (!admin) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    // تحديث آخر تسجيل دخول
    db.prepare('UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(admin.id);

    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role,
        permissions: JSON.parse(admin.permissions)
      },
      JWT_SECRET,
      { expiresIn: '7d' } // Extended to 7 days for better persistence
    );

    res.json({ 
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
        permissions: JSON.parse(admin.permissions)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تسجيل الدخول' });
  }
});

// تجديد رمز الأدمن
app.post('/api/admin/refresh', authenticateAdmin, (req, res) => {
  try {
    const admin = req.user;
    
    // Generate new token with same data
    const newToken = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role,
        permissions: admin.permissions
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token: newToken,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تجديد الرمز' });
  }
});

// إحصائيات الأدمن
app.get('/api/admin/stats', (req, res) => {
  try {
    const stats = {
      totalBrokers: db.prepare('SELECT COUNT(*) as count FROM brokers').get().count,
      activeBrokers: db.prepare('SELECT COUNT(*) as count FROM brokers WHERE status = "active"').get().count,
      totalRequests: db.prepare('SELECT COUNT(*) as count FROM broker_requests').get().count,
      pendingRequests: db.prepare('SELECT COUNT(*) as count FROM broker_requests WHERE status = "pending"').get().count,
      totalTickets: db.prepare('SELECT COUNT(*) as count FROM tickets').get().count,
      openTickets: db.prepare('SELECT COUNT(*) as count FROM tickets WHERE status = "open"').get().count,
      totalUsers: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      totalReviews: db.prepare('SELECT COUNT(*) as count FROM reviews').get().count,
      averageRating: db.prepare('SELECT AVG(rating) as avg FROM reviews').get().avg || 0,
      // إحصائيات إضافية للشات
      totalChatMessages: db.prepare('SELECT COUNT(*) as count FROM chat_messages').get().count,
      activeChatTickets: db.prepare('SELECT COUNT(DISTINCT ticket_id) as count FROM chat_messages WHERE created_at > datetime("now", "-24 hours")').get().count
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الإحصائيات' });
  }
});

// جميع التذاكر للأدمن
app.get('/api/admin/tickets', (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = 'SELECT * FROM tickets';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    
    // إزالة LIMIT و OFFSET للعرض الكامل
    const tickets = db.prepare(query).all(...params);
    res.json(tickets);
  } catch (error) {
    console.error('خطأ في جلب التذاكر:', error);
    res.status(500).json({ error: 'خطأ في جلب التذاكر' });
  }
});

// جميع طلبات الوسيط للأدمن
app.get('/api/admin/broker-requests', (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = 'SELECT * FROM broker_requests';
    const params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const requests = db.prepare(query).all(...params);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب طلبات الوسيط' });
  }
});

// تحديث حالة طلب الوسيط
app.put('/api/admin/broker-requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_to, admin_notes } = req.body;

    const updateRequest = db.prepare(`
      UPDATE broker_requests SET 
        status = ?, 
        assigned_to = ?,
        admin_notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateRequest.run(status, assigned_to, admin_notes, id);
    res.json({ message: 'تم تحديث طلب الوسيط بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تحديث طلب الوسيط' });
  }
});

// تحديث حالة التذكرة
app.put('/api/admin/tickets/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, assigned_to } = req.body;

    const updateTicket = db.prepare(`
      UPDATE tickets SET 
        status = ?, 
        assigned_to = ?,
        updated_at = CURRENT_TIMESTAMP,
        resolved_at = CASE WHEN status = 'resolved' OR status = 'closed' THEN CURRENT_TIMESTAMP ELSE resolved_at END
      WHERE id = ?
    `);

    updateTicket.run(status, assigned_to, id);
    res.json({ message: 'تم تحديث التذكرة بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تحديث التذكرة' });
  }
});

// الموافقة على التذكرة
app.post('/api/admin/tickets/:id/approve', (req, res) => {
  try {
    const { id } = req.params;

    const updateTicket = db.prepare(`
      UPDATE tickets 
      SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    const result = updateTicket.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'التذكرة غير موجودة' });
    }

    res.json({ message: 'تم الموافقة على التذكرة بنجاح' });
  } catch (error) {
    console.error('خطأ في الموافقة على التذكرة:', error);
    res.status(500).json({ error: 'خطأ في الموافقة على التذكرة' });
  }
});

// رفض التذكرة
app.post('/api/admin/tickets/:id/reject', (req, res) => {
  try {
    const { id } = req.params;

    const updateTicket = db.prepare(`
      UPDATE tickets 
      SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    const result = updateTicket.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'التذكرة غير موجودة' });
    }

    res.json({ message: 'تم رفض التذكرة بنجاح' });
  } catch (error) {
    console.error('خطأ في رفض التذكرة:', error);
    res.status(500).json({ error: 'خطأ في رفض التذكرة' });
  }
});

// حذف التذكرة
app.delete('/api/admin/tickets/:id', (req, res) => {
  try {
    const { id } = req.params;

    const deleteTicket = db.prepare('DELETE FROM tickets WHERE id = ?');
    const result = deleteTicket.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'التذكرة غير موجودة' });
    }

    res.json({ message: 'تم حذف التذكرة بنجاح' });
  } catch (error) {
    console.error('خطأ في حذف التذكرة:', error);
    res.status(500).json({ error: 'خطأ في حذف التذكرة' });
  }
});

// الحسابات والسلع
app.get('/api/broker-requests/:id/accounts-products', (req, res) => {
  try {
    const { id } = req.params;
    const accountsProducts = db.prepare(`
      SELECT * FROM accounts_products 
      WHERE broker_request_id = ? 
      ORDER BY created_at DESC
    `).all(id);

    res.json(accountsProducts);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الحسابات والسلع' });
  }
});

app.post('/api/broker-requests/:id/accounts-products', (req, res) => {
  try {
    const { id } = req.params;
    const { type, name, description, value, quantity } = req.body;

    const insertAccountProduct = db.prepare(`
      INSERT INTO accounts_products (broker_request_id, type, name, description, value, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertAccountProduct.run(id, type, name, description, value, quantity || 1);
    res.json({ id: result.lastInsertRowid, message: 'تم إضافة العنصر بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إضافة العنصر' });
  }
});

app.put('/api/accounts-products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, value, quantity, status } = req.body;

    const updateAccountProduct = db.prepare(`
      UPDATE accounts_products SET 
        name = ?, description = ?, value = ?, quantity = ?, status = ?
      WHERE id = ?
    `);

    updateAccountProduct.run(name, description, value, quantity, status, id);
    res.json({ message: 'تم تحديث العنصر بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في تحديث العنصر' });
  }
});

app.delete('/api/accounts-products/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM accounts_products WHERE id = ?').run(id);
    res.json({ message: 'تم حذف العنصر بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في حذف العنصر' });
  }
});

// محادثات الوساطة
app.get('/api/mediation-requests/:id/chat', (req, res) => {
  try {
    const { id } = req.params;
    const messages = getMediationChatMessages(id, { limit: 5000, offset: 0 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الرسائل' });
  }
});

// إرسال رسالة في طلب الوساطة
app.post('/api/mediation-requests/:id/chat', (req, res) => {
  try {
    const { id } = req.params;
    const { sender_id, sender_name, sender_role, message, message_type = 'text' } = req.body;

    // التحقق من البيانات المطلوبة
    if (!sender_id || !sender_name || !sender_role || !message) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    // التحقق من وجود الطلب
    const request = db.prepare('SELECT id FROM mediation_requests WHERE id = ?').get(id);
    if (!request) {
      return res.status(404).json({ error: 'طلب الوساطة غير موجود' });
    }

    // إضافة الرسالة إلى قاعدة البيانات
    const messageId = addMediationChatMessage(id, sender_id, sender_name, sender_role, message, message_type);
    
    res.json({ 
      success: true, 
      message_id: messageId,
      message: 'تم حفظ الرسالة بنجاح' 
    });
  } catch (error) {
    console.error('خطأ في حفظ الرسالة:', error);
    res.status(500).json({ error: 'خطأ في حفظ الرسالة' });
  }
});

// معدل إرسال الرسائل لكل مستخدم في الدقيقة (ذاكرة مؤقتة داخلية)
const messageRateLimiter = new Map(); // key: sender_id, value: { count, windowStartMs }
const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX_MESSAGES = 10;

// تم دمج هذا الـ endpoint مع الـ endpoint السابق لتجنب التكرار

// الإحصائيات الذكية
app.get('/api/brokers/:id/analytics', (req, res) => {
  try {
    const { id } = req.params;
    const analytics = db.prepare(`
      SELECT * FROM smart_analytics 
      WHERE broker_id = ? 
      ORDER BY created_at DESC
    `).all(id);

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في جلب الإحصائيات' });
  }
});

app.post('/api/brokers/:id/analytics', (req, res) => {
  try {
    const { id } = req.params;
    const { metric_name, metric_value, metric_type, period_start, period_end } = req.body;

    const insertAnalytics = db.prepare(`
      INSERT INTO smart_analytics (broker_id, metric_name, metric_value, metric_type, period_start, period_end)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = insertAnalytics.run(id, metric_name, metric_value, metric_type, period_start, period_end);
    res.json({ id: result.lastInsertRowid, message: 'تم إضافة الإحصائية بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'خطأ في إضافة الإحصائية' });
  }
});

// Socket.IO for real-time mediation chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Track mediation users per request in-memory
  if (!io.mediationUsers) {
    io.mediationUsers = new Map();
  }

  // Join mediation request room
  socket.on('join-mediation', (payload) => {
    try {
      const data = typeof payload === 'string' ? { requestId: payload } : (payload || {});
      const { requestId, userId = null, userName = null, role = null } = data;
      if (!requestId) return;

      socket.join(`mediation-${requestId}`);
      console.log(`User ${socket.id} joined mediation request ${requestId}`);

      // Ensure request exists before proceeding
      const request = db.prepare('SELECT id FROM mediation_requests WHERE id = ?').get(requestId);
      if (!request) {
        socket.emit('role-error', { code: 'request_not_found', message: 'طلب الوساطة غير موجود' });
        return;
      }

      // Get current users from database
      const users = getMediationUsers(requestId);

      // Handle role joining if provided
      if (role && userId && userName) {
        try {
          joinMediationRequest(requestId, userId, userName, role);
          
          // Update users list
          const updatedUsers = getMediationUsers(requestId);
          io.mediationUsers.set(requestId, updatedUsers);
          io.to(`mediation-${requestId}`).emit('users-updated', updatedUsers);
          
          // Send success message
          socket.emit('join-success', { 
            message: `تم الانضمام كـ ${role === 'buyer' ? 'مشتري' : role === 'seller' ? 'بائع' : 'وسيط'}` 
          });
        } catch (error) {
          socket.emit('role-error', { 
            code: 'join_failed', 
            message: error.message || 'فشل في الانضمام للطلب' 
          });
          return;
        }
      } else {
        // If no role provided, just send current users
        socket.emit('users-updated', users);
      }
    } catch (e) {
      console.error('join-mediation error', e);
    }
  });

  // Leave mediation request room
  socket.on('leave-mediation', (requestId) => {
    socket.leave(`mediation-${requestId}`);
    console.log(`User ${socket.id} left mediation request ${requestId}`);
  });

  // Provide users on demand
  socket.on('get-users', (requestId) => {
    const users = getMediationUsers(requestId);
    io.mediationUsers.set(requestId, users);
    socket.emit('users-updated', users);
  });

  // Send message - في طلب الوساطة
  socket.on('send-mediation-message', async (data) => {
    try {
      const { requestId, senderId, senderName, senderRole, message, messageType = 'text' } = data;
      if (!requestId) {
        socket.emit('error', { message: 'معرف الطلب مطلوب' });
        return;
      }

      const messageId = addMediationChatMessage(requestId, senderId, senderName, senderRole, message, messageType);
      const savedMessage = db.prepare(`SELECT * FROM mediation_chats WHERE id = ?`).get(messageId);
      io.to(`mediation-${requestId}`).emit('new-message', savedMessage);
      
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      socket.emit('error', { message: 'خطأ في إرسال الرسالة' });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(`mediation-${data.requestId}`).emit('user-typing', {
      userId: data.userId,
      userName: data.userName,
      isTyping: data.isTyping
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Clear expired requests periodically
  setInterval(() => {
    try {
      const expiredRequests = db.prepare(`
        SELECT id FROM mediation_requests 
        WHERE created_at < datetime('now', '-7 days') AND status = 'pending'
      `).all();
      
      expiredRequests.forEach(request => {
        // Update status to cancelled
        db.prepare('UPDATE mediation_requests SET status = "cancelled" WHERE id = ?').run(request.id);
        io.mediationUsers.delete(request.id);
      });
    } catch (error) {
      console.error('Error clearing expired requests:', error);
    }
  }, 60 * 60 * 1000); // Run every hour
});

// Catch-all for SPA routes: use a terminal middleware instead of a path pattern
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


