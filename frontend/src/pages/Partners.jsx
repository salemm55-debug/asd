import { motion } from 'framer-motion'
import { FaHandshake, FaBuilding, FaCreditCard, FaShoppingCart, FaShieldAlt, FaGlobe, FaCertificate, FaUsers, FaCheckCircle, FaStar, FaTrophy, FaAward } from 'react-icons/fa'

export default function Partners() {
  return (
    <div className="partners-container">
      <motion.section 
        className="partners-section" 
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <div className="partners-header">
          <div className="header-icon">
            <FaHandshake className="main-icon" />
            <div className="icon-glow"></div>
          </div>
          <h1>شركاؤنا الموثوقون</h1>
          <p className="partners-subtitle">نفتخر بشراكاتنا الاستراتيجية التي تعزز ثقة المستخدمين وتطور الخدمات</p>
        </div>

        <div className="partners-content">
          <motion.div 
            className="partners-category"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.2}}
          >
            <div className="category-header">
              <FaBuilding className="category-icon" />
              <h2>الجهات الحكومية</h2>
            </div>
            <div className="partners-grid">
              <motion.div 
                className="partner-card government"
                whileHover={{scale:1.05, y:-5}}
                transition={{duration:0.3}}
              >
                <div className="partner-logo">
                  <FaCertificate className="logo-icon" />
                </div>
                <h3>وزارة التجارة</h3>
                <p>تكامل وثقة مع الجهات الرسمية</p>
                <div className="partner-features">
                  <span className="feature-tag">رسمي</span>
                  <span className="feature-tag">معتمد</span>
                </div>
                <div className="partner-stats">
                  <div className="stat">
                    <FaCheckCircle className="stat-icon" />
                    <span>معتمد رسمياً</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="partner-card government"
                whileHover={{scale:1.05, y:-5}}
                transition={{duration:0.3}}
              >
                <div className="partner-logo">
                  <FaShieldAlt className="logo-icon" />
                </div>
                <h3>هيئة حماية المستهلك</h3>
                <p>حماية حقوق المستهلكين</p>
                <div className="partner-features">
                  <span className="feature-tag">حماية</span>
                  <span className="feature-tag">حقوق</span>
                </div>
                <div className="partner-stats">
                  <div className="stat">
                    <FaCheckCircle className="stat-icon" />
                    <span>حماية المستهلك</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="partners-category"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.4}}
          >
            <div className="category-header">
              <FaCreditCard className="category-icon" />
              <h2>البنوك وخدمات الدفع</h2>
            </div>
            <div className="partners-grid">
              <motion.div 
                className="partner-card banking"
                whileHover={{scale:1.05, y:-5}}
                transition={{duration:0.3}}
              >
                <div className="partner-logo">
                  <FaCreditCard className="logo-icon" />
                </div>
                <h3>البنوك المحلية</h3>
                <p>مدفوعات آمنة ومضمونة</p>
                <div className="partner-features">
                  <span className="feature-tag">آمن</span>
                  <span className="feature-tag">سريع</span>
                </div>
                <div className="partner-stats">
                  <div className="stat">
                    <FaStar className="stat-icon" />
                    <span>تقييم 4.9/5</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="partner-card banking"
                whileHover={{scale:1.05, y:-5}}
                transition={{duration:0.3}}
              >
                <div className="partner-logo">
                  <FaGlobe className="logo-icon" />
                </div>
                <h3>خدمات الدفع الرقمي</h3>
                <p>حلول دفع متطورة</p>
                <div className="partner-features">
                  <span className="feature-tag">رقمي</span>
                  <span className="feature-tag">متطور</span>
                </div>
                <div className="partner-stats">
                  <div className="stat">
                    <FaTrophy className="stat-icon" />
                    <span>الأفضل في المنطقة</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="partners-category"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.6}}
          >
            <div className="category-header">
              <FaShoppingCart className="category-icon" />
              <h2>منصات التجارة الإلكترونية</h2>
            </div>
            <div className="partners-grid">
              <motion.div 
                className="partner-card ecommerce"
                whileHover={{scale:1.05, y:-5}}
                transition={{duration:0.3}}
              >
                <div className="partner-logo">
                  <FaShoppingCart className="logo-icon" />
                </div>
                <h3>منصات التسوق</h3>
                <p>شبكة أوسع من التجار</p>
                <div className="partner-features">
                  <span className="feature-tag">واسع</span>
                  <span className="feature-tag">متنوع</span>
                </div>
                <div className="partner-stats">
                  <div className="stat">
                    <FaUsers className="stat-icon" />
                    <span>10,000+ تاجر</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="partner-card ecommerce"
                whileHover={{scale:1.05, y:-5}}
                transition={{duration:0.3}}
              >
                <div className="partner-logo">
                  <FaGlobe className="logo-icon" />
                </div>
                <h3>الأسواق الإلكترونية</h3>
                <p>تكامل مع أكبر الأسواق</p>
                <div className="partner-features">
                  <span className="feature-tag">تكامل</span>
                  <span className="feature-tag">كبير</span>
                </div>
                <div className="partner-stats">
                  <div className="stat">
                    <FaAward className="stat-icon" />
                    <span>شريك معتمد</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="partners-category"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.8}}
          >
            <div className="category-header">
              <FaShieldAlt className="category-icon" />
              <h2>شركاء الأمان والتكنولوجيا</h2>
            </div>
            <div className="partners-grid">
              <motion.div 
                className="partner-card security"
                whileHover={{scale:1.05, y:-5}}
                transition={{duration:0.3}}
              >
                <div className="partner-logo">
                  <FaShieldAlt className="logo-icon" />
                </div>
                <h3>شركات الأمان السيبراني</h3>
                <p>حماية متقدمة للبيانات</p>
                <div className="partner-features">
                  <span className="feature-tag">أمان</span>
                  <span className="feature-tag">حماية</span>
                </div>
                <div className="partner-stats">
                  <div className="stat">
                    <FaCheckCircle className="stat-icon" />
                    <span>ISO 27001</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="partner-card security"
                whileHover={{scale:1.05, y:-5}}
                transition={{duration:0.3}}
              >
                <div className="partner-logo">
                  <FaGlobe className="logo-icon" />
                </div>
                <h3>مزودي الخدمات السحابية</h3>
                <p>بنية تحتية موثوقة</p>
                <div className="partner-features">
                  <span className="feature-tag">سحابي</span>
                  <span className="feature-tag">موثوق</span>
                </div>
                <div className="partner-stats">
                  <div className="stat">
                    <FaTrophy className="stat-icon" />
                    <span>99.9% توفر</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="partners-stats"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:1.0}}
        >
          <div className="stats-header">
            <h2>إحصائيات الشراكة</h2>
            <p>أرقام تعكس قوة شراكاتنا</p>
          </div>
          <div className="stats-grid">
            <motion.div 
              className="stat-card"
              initial={{opacity:0, scale:0.8}} 
              animate={{opacity:1, scale:1}} 
              transition={{duration:0.5, delay:1.2}}
            >
              <FaHandshake className="stat-icon" />
              <div className="stat-number">50+</div>
              <div className="stat-label">شريك استراتيجي</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{opacity:0, scale:0.8}} 
              animate={{opacity:1, scale:1}} 
              transition={{duration:0.5, delay:1.3}}
            >
              <FaUsers className="stat-icon" />
              <div className="stat-number">1M+</div>
              <div className="stat-label">مستخدم نشط</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{opacity:0, scale:0.8}} 
              animate={{opacity:1, scale:1}} 
              transition={{duration:0.5, delay:1.4}}
            >
              <FaStar className="stat-icon" />
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">تقييم الشركاء</div>
            </motion.div>
            <motion.div 
              className="stat-card"
              initial={{opacity:0, scale:0.8}} 
              animate={{opacity:1, scale:1}} 
              transition={{duration:0.5, delay:1.5}}
            >
              <FaGlobe className="stat-icon" />
              <div className="stat-number">15+</div>
              <div className="stat-label">دولة</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="partners-footer"
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          transition={{duration:0.8, delay:1.6}}
        >
          <div className="footer-content">
            <div className="partnership-info">
              <h3>هل تريد أن تصبح شريكاً معنا؟</h3>
              <p>نرحب بالشراكات الاستراتيجية التي تعزز خدماتنا وتطور تجربة المستخدمين</p>
              <motion.button 
                className="partnership-btn modern"
                whileHover={{scale: 1.05, y: -2}}
                whileTap={{scale: 0.95}}
                transition={{type: "spring", stiffness: 300, damping: 20}}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <FaHandshake style={{fontSize: '1.2rem'}} />
                <span>انضم كشريك</span>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s'
                }} className="btn-shine"></div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}


