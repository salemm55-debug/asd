const Database = require('better-sqlite3');
const path = require('path');

// إنشاء قاعدة البيانات
const db = new Database(path.join(__dirname, 'wasitak.db'));

// تفعيل المفاتيح الخارجية
db.pragma('foreign_keys = ON');

// إنشاء الجداول
const initDatabase = () => {
  try {
    // جدول الوسطاء
    db.exec(`
      CREATE TABLE IF NOT EXISTS brokers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        location TEXT NOT NULL,
        category TEXT NOT NULL,
        experience TEXT NOT NULL,
        specialties TEXT NOT NULL, -- JSON array
        description TEXT NOT NULL,
        languages TEXT NOT NULL, -- JSON array
        working_hours TEXT NOT NULL,
        response_time TEXT NOT NULL,
        rating REAL DEFAULT 0,
        reviews_count INTEGER DEFAULT 0,
        completed_deals INTEGER DEFAULT 0,
        verified BOOLEAN DEFAULT 0,
        premium BOOLEAN DEFAULT 0,
        status TEXT DEFAULT 'active', -- active, busy, inactive
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

  // جدول طلبات الوسيط
  db.exec(`
    CREATE TABLE IF NOT EXISTS broker_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      broker_id INTEGER,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      location TEXT NOT NULL,
      contact_info TEXT NOT NULL,
      requirements TEXT,
      user_role TEXT NOT NULL, -- buyer, seller
      deadline DATE,
      status TEXT DEFAULT 'pending', -- pending, assigned, in_progress, completed, cancelled
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (broker_id) REFERENCES brokers (id)
    )
  `);

  // إضافة عمود user_role إذا لم يكن موجوداً (للجداول الموجودة)
  try {
    db.exec(`ALTER TABLE broker_requests ADD COLUMN user_role TEXT DEFAULT 'buyer'`);
  } catch (error) {
    // العمود موجود بالفعل، تجاهل الخطأ
  }

  // جدول طلبات الوساطة
  db.exec(`
    CREATE TABLE IF NOT EXISTS mediation_requests (
      id TEXT PRIMARY KEY,
      buyer_id TEXT NOT NULL,
      seller_id TEXT,
      broker_id TEXT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL,
      location TEXT,
      status TEXT DEFAULT 'pending', -- pending, active, completed, cancelled
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )
  `);

  // جدول المحادثات في الوساطة
  db.exec(`
    CREATE TABLE IF NOT EXISTS mediation_chats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_role TEXT NOT NULL, -- buyer, seller, broker
      message TEXT NOT NULL,
      message_type TEXT DEFAULT 'text',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES mediation_requests (id)
    )
  `);

  // جدول المستخدمين
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // جدول المستخدمين النشطين (للمنع من تسجيل نفس الاسم)
  db.exec(`
    CREATE TABLE IF NOT EXISTS active_users (
      nickname TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول نظام التعويض
  db.exec(`
    CREATE TABLE IF NOT EXISTS compensations (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      ticket_id TEXT,
      amount REAL NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'pending', -- pending, approved, rejected, paid
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      approved_at DATETIME,
      paid_at DATETIME,
      admin_notes TEXT
    )
  `);

  // جدول التقييمات
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      broker_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      request_id INTEGER,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (broker_id) REFERENCES brokers (id),
      FOREIGN KEY (request_id) REFERENCES broker_requests (id)
    )
  `);

  // جدول الحسابات والسلع
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      broker_request_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('account', 'product')),
      name TEXT NOT NULL,
      description TEXT,
      value REAL,
      quantity INTEGER DEFAULT 1,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (broker_request_id) REFERENCES broker_requests (id)
    )
  `);

  // جدول الأدمن
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      permissions TEXT DEFAULT '[]', -- JSON array
      is_active BOOLEAN DEFAULT 1,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول المستخدمين النشطين في الوساطة
  db.exec(`
    CREATE TABLE IF NOT EXISTS mediation_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'broker')),
      request_id TEXT,
      is_online BOOLEAN DEFAULT 1,
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (request_id) REFERENCES mediation_requests (id)
    )
  `);

  // جدول إشعارات الشات
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      ticket_id INTEGER NOT NULL,
      message_id INTEGER NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES tickets (id),
      FOREIGN KEY (message_id) REFERENCES chat_messages (id)
    )
  `);

  // جدول الإحصائيات الذكية
  db.exec(`
    CREATE TABLE IF NOT EXISTS smart_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_name TEXT NOT NULL,
      metric_value REAL NOT NULL,
      metric_type TEXT NOT NULL CHECK (metric_type IN ('rating', 'performance', 'trend')),
      broker_id INTEGER,
      period_start DATE,
      period_end DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (broker_id) REFERENCES brokers (id)
    )
  `);

  // جدول تتبع التحليلات العامة
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT,
      properties TEXT,
      session_id TEXT,
      user_id TEXT,
      path TEXT,
      url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول إعدادات المستخدم
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_settings (
      user_id TEXT PRIMARY KEY,
      settings TEXT NOT NULL DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // جدول بيانات الجلسة
  db.exec(`
    CREATE TABLE IF NOT EXISTS session_data (
      user_id TEXT PRIMARY KEY,
      data TEXT NOT NULL DEFAULT '{}',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // جدول رتب المستخدمين
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_ranks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      rank_name TEXT NOT NULL,
      rank_level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

    console.log('تم إنشاء قاعدة البيانات بنجاح');
  } catch (error) {
    console.error('خطأ في إنشاء قاعدة البيانات:', error);
    throw error;
  }
};

// إدراج بيانات تجريبية
const seedDatabase = () => {
  try {
    // إدراج وسطاء تجريبيين
    const insertBroker = db.prepare(`
      INSERT OR IGNORE INTO brokers (
        name, title, email, phone, location, category, experience, 
        specialties, description, languages, working_hours, response_time,
        rating, reviews_count, completed_deals, verified, premium, avatar_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

  const brokers = [
    [
      'أحمد محمد العتيبي',
      'وسيط عقارات متخصص',
      'ahmed@wasitak.com',
      '+966501234567',
      'الرياض',
      'real-estate',
      '8 سنوات',
      JSON.stringify(['عقارات', 'شقق', 'فلل', 'أراضي']),
      'خبير في العقارات السكنية والتجارية مع خبرة واسعة في السوق السعودي',
      JSON.stringify(['العربية', 'الإنجليزية']),
      '8:00 ص - 10:00 م',
      'أقل من ساعة',
      4.9, 127, 245, 1, 1,
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    ],
    [
      'فاطمة علي السعيد',
      'وسيط مركبات',
      'fatima@wasitak.com',
      '+966502345678',
      'جدة',
      'vehicles',
      '5 سنوات',
      JSON.stringify(['سيارات', 'دراجات نارية', 'شاحنات']),
      'متخصصة في بيع وشراء المركبات الجديدة والمستعملة',
      JSON.stringify(['العربية']),
      '9:00 ص - 8:00 م',
      'أقل من 30 دقيقة',
      4.8, 89, 156, 1, 0,
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    ],
    [
      'محمد عبدالله القحطاني',
      'وسيط إلكترونيات',
      'mohammed@wasitak.com',
      '+966503456789',
      'الدمام',
      'electronics',
      '6 سنوات',
      JSON.stringify(['هواتف', 'لابتوب', 'أجهزة منزلية']),
      'خبير في الإلكترونيات والتقنية مع معرفة عميقة بالأسواق',
      JSON.stringify(['العربية', 'الإنجليزية', 'الأردية']),
      '10:00 ص - 9:00 م',
      'أقل من ساعة',
      4.7, 203, 312, 1, 1,
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    ]
  ];

  brokers.forEach(broker => insertBroker.run(...broker));

  // إدراج أدمن تجريبي
  const insertAdmin = db.prepare(`
    INSERT OR IGNORE INTO admins (
      username, password_hash, email, full_name, role, permissions
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  // كلمات مرور قوية ومشفرة
  const adminPasswordHash = '$2b$12$btKoD5ICoOlwaXgM17g2neO2h.sQHZ/.B9iSA.eUyu8.dgECRL/BS'; // Wasitak2025!
  const superAdminPasswordHash = '$2b$12$btKoD5ICoOlwaXgM17g2neO2h.sQHZ/.B9iSA.eUyu8.dgECRL/BS'; // Wasitak2025!
  
  insertAdmin.run(
    'admin',
    adminPasswordHash,
    'admin@wasitak.com',
    'مدير النظام',
    'admin',
    JSON.stringify(['dashboard', 'tickets', 'brokers'])
  );

  insertAdmin.run(
    'superadmin',
    superAdminPasswordHash,
    'superadmin@wasitak.com',
    'مدير النظام الرئيسي',
    'super_admin',
    JSON.stringify(['all'])
  );

    console.log('تم إدراج البيانات التجريبية بنجاح');
  } catch (error) {
    console.error('خطأ في إدراج البيانات التجريبية:', error);
    throw error;
  }
};

// تهيئة قاعدة البيانات
try {
  initDatabase();
  seedDatabase();
  console.log('تم تهيئة قاعدة البيانات بنجاح');
} catch (error) {
  console.error('خطأ في تهيئة قاعدة البيانات:', error);
  process.exit(1);
}

// دوال إدارة المستخدمين النشطين
const addActiveUser = (nickname, userId) => {
  try {
    if (!nickname || !userId) {
      throw new Error('اسم المستخدم ومعرف المستخدم مطلوبان');
    }
    
    const stmt = db.prepare('INSERT OR REPLACE INTO active_users (nickname, user_id) VALUES (?, ?)');
    return stmt.run(nickname, userId);
  } catch (error) {
    console.error('خطأ في إضافة مستخدم نشط:', error);
    throw error;
  }
};

const removeActiveUser = (nickname) => {
  try {
    if (!nickname) {
      throw new Error('اسم المستخدم مطلوب');
    }
    
    const stmt = db.prepare('DELETE FROM active_users WHERE nickname = ?');
    return stmt.run(nickname);
  } catch (error) {
    console.error('خطأ في إزالة مستخدم نشط:', error);
    throw error;
  }
};

const isUserActive = (nickname) => {
  try {
    if (!nickname) {
      throw new Error('اسم المستخدم مطلوب');
    }
    
    const stmt = db.prepare('SELECT * FROM active_users WHERE nickname = ?');
    return stmt.get(nickname);
  } catch (error) {
    console.error('خطأ في التحقق من المستخدم النشط:', error);
    return null;
  }
};

const updateUserActivity = (nickname) => {
  try {
    if (!nickname) {
      throw new Error('اسم المستخدم مطلوب');
    }
    
    const stmt = db.prepare('UPDATE active_users SET last_activity = CURRENT_TIMESTAMP WHERE nickname = ?');
    return stmt.run(nickname);
  } catch (error) {
    console.error('خطأ في تحديث نشاط المستخدم:', error);
    throw error;
  }
};

const cleanupInactiveUsers = () => {
  try {
    // إزالة المستخدمين غير النشطين لأكثر من 24 ساعة
    const stmt = db.prepare('DELETE FROM active_users WHERE last_activity < datetime("now", "-24 hours")');
    const result = stmt.run();
    console.log(`تم تنظيف ${result.changes} مستخدم غير نشط`);
    return result;
  } catch (error) {
    console.error('خطأ في تنظيف المستخدمين غير النشطين:', error);
    throw error;
  }
};

// تشغيل تنظيف المستخدمين غير النشطين كل ساعة
setInterval(cleanupInactiveUsers, 60 * 60 * 1000);

// دالة توليد معرفات التذاكر النصية
const generateTicketId = () => {
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // التحقق من عدم وجود طلب وساطة بنفس المعرف
    const existingRequest = db.prepare('SELECT id FROM mediation_requests WHERE id = ?').get(result);
    if (existingRequest) {
      // إذا كان المعرف موجود، توليد معرف جديد
      return generateTicketId();
    }
    
    return result;
  } catch (error) {
    console.error('خطأ في توليد معرف الطلب:', error);
    throw error;
  }
};

// دوال إدارة رسائل الوساطة
const addMediationChatMessage = (requestId, senderId, senderName, senderRole, message, messageType = 'text') => {
  try {
    const stmt = db.prepare(`
      INSERT INTO mediation_chats (request_id, sender_id, sender_name, sender_role, message, message_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(requestId, senderId, senderName, senderRole, message, messageType);
    
    // تحديث آخر نشاط للطلب
    const updateRequest = db.prepare(`
      UPDATE mediation_requests SET updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    updateRequest.run(requestId);
    
    return result.lastInsertRowid;
  } catch (error) {
    console.error('خطأ في إضافة رسالة الوساطة:', error);
    throw error;
  }
};

const getMediationChatMessages = (requestId, { limit = 1000, offset = 0 } = {}) => {
  try {
    if (!requestId) {
      throw new Error('معرف الطلب مطلوب');
    }
    
    const stmt = db.prepare(`
      SELECT * FROM mediation_chats 
      WHERE request_id = ? 
      ORDER BY created_at ASC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(requestId, limit, offset);
  } catch (error) {
    console.error('خطأ في جلب رسائل الوساطة:', error);
    throw error;
  }
};

// دوال إدارة طلبات الوساطة
const createMediationRequest = (buyerId, title, description, category, price, location) => {
  try {
    const requestId = generateTicketId();
    const stmt = db.prepare(`
      INSERT INTO mediation_requests (id, buyer_id, title, description, category, price, location)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(requestId, buyerId, title, description, category, price, location);
    return requestId;
  } catch (error) {
    console.error('خطأ في إنشاء طلب الوساطة:', error);
    throw error;
  }
};

const joinMediationRequest = (requestId, userId, userName, role) => {
  try {
    if (!['buyer', 'seller', 'broker'].includes(role)) {
      throw new Error('الدور يجب أن يكون buyer أو seller أو broker');
    }
    
    // التحقق من وجود الطلب
    const request = db.prepare('SELECT id FROM mediation_requests WHERE id = ?').get(requestId);
    if (!request) {
      throw new Error('طلب الوساطة غير موجود');
    }
    
    // التحقق من عدم تكرار الدور
    const existingUser = db.prepare(`
      SELECT role FROM mediation_users 
      WHERE request_id = ? AND role = ?
    `).get(requestId, role);
    
    if (existingUser) {
      throw new Error(`دور ${role} مشغول بالفعل`);
    }
    
    // إضافة المستخدم للطلب
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO mediation_users (id, name, role, request_id, is_online)
      VALUES (?, ?, ?, ?, 1)
    `);
    stmt.run(userId, userName, role, requestId);
    
    // تحديث الطلب حسب الدور
    if (role === 'seller') {
      const updateRequest = db.prepare(`
        UPDATE mediation_requests SET seller_id = ?, status = 'active' WHERE id = ?
      `);
      updateRequest.run(userId, requestId);
    } else if (role === 'broker') {
      const updateRequest = db.prepare(`
        UPDATE mediation_requests SET broker_id = ? WHERE id = ?
      `);
      updateRequest.run(userId, requestId);
    }
    
    return true;
  } catch (error) {
    console.error('خطأ في الانضمام لطلب الوساطة:', error);
    throw error;
  }
};

const getMediationRequest = (requestId) => {
  try {
    const stmt = db.prepare(`
      SELECT mr.*, 
             mu_buyer.name as buyer_name,
             mu_seller.name as seller_name,
             mu_broker.name as broker_name
      FROM mediation_requests mr
      LEFT JOIN mediation_users mu_buyer ON mr.buyer_id = mu_buyer.id AND mu_buyer.role = 'buyer'
      LEFT JOIN mediation_users mu_seller ON mr.seller_id = mu_seller.id AND mu_seller.role = 'seller'
      LEFT JOIN mediation_users mu_broker ON mr.broker_id = mu_broker.id AND mu_broker.role = 'broker'
      WHERE mr.id = ?
    `);
    return stmt.get(requestId);
  } catch (error) {
    console.error('خطأ في جلب طلب الوساطة:', error);
    throw error;
  }
};

const getMediationUsers = (requestId) => {
  try {
    const stmt = db.prepare(`
      SELECT * FROM mediation_users 
      WHERE request_id = ? AND is_online = 1
      ORDER BY created_at ASC
    `);
    return stmt.all(requestId);
  } catch (error) {
    console.error('خطأ في جلب مستخدمي الوساطة:', error);
    throw error;
  }
};

module.exports = {
  db,
  addActiveUser,
  removeActiveUser,
  isUserActive,
  updateUserActivity,
  cleanupInactiveUsers,
  generateTicketId,
  addMediationChatMessage,
  getMediationChatMessages,
  createMediationRequest,
  joinMediationRequest,
  getMediationRequest,
  getMediationUsers
};
