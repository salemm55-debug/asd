import { motion } from 'framer-motion'
import { FaShieldAlt, FaLock, FaEye, FaUserShield, FaServer, FaKey, FaCheckCircle, FaExclamationTriangle, FaGlobe, FaDatabase, FaCog, FaCertificate, FaFingerprint, FaMobile } from 'react-icons/fa'

export default function Security() {
  return (
    <div className="security-container">
      <motion.section 
        className="security-section" 
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <div className="security-header">
          <div className="header-icon">
            <FaShieldAlt className="main-icon" />
            <div className="icon-glow"></div>
          </div>
          <h1>الأمان والحماية</h1>
          <p className="security-subtitle">نظام أمان متقدم لحماية بياناتك وصفقاتك</p>
        </div>

        <div className="security-content">
          <motion.div 
            className="security-card primary"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.2}}
          >
            <div className="card-header">
              <FaLock className="card-icon" />
              <h2>تشفير البيانات</h2>
            </div>
            <div className="card-content">
              <div className="security-features">
                <div className="feature-item">
                  <FaKey className="feature-icon" />
                  <div className="feature-content">
                    <h3>تشفير TLS/SSL</h3>
                    <p>جميع البيانات محمية بطبقات تشفير TLS 1.3 المتقدمة أثناء النقل</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaDatabase className="feature-icon" />
                  <div className="feature-content">
                    <h3>تشفير AES-256</h3>
                    <p>تشفير البيانات المخزنة بتقنية AES-256 المعيار العسكري</p>
                  </div>
                </div>
                <div className="feature-item">
                  <FaFingerprint className="feature-icon" />
                  <div className="feature-content">
                    <h3>تشفير البصمة</h3>
                    <p>حماية إضافية باستخدام التشفير البيومتري المتقدم</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="security-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.4}}
          >
            <div className="card-header">
              <FaUserShield className="card-icon" />
              <h2>التحقق من الهوية</h2>
            </div>
            <div className="card-content">
              <div className="verification-methods">
                <div className="method-item">
                  <FaMobile className="method-icon" />
                  <h3>التحقق بالهاتف</h3>
                  <p>رسائل SMS للتحقق من رقم الهاتف</p>
                </div>
                <div className="method-item">
                  <FaCertificate className="method-icon" />
                  <h3>التحقق بالوثائق</h3>
                  <p>رفع الوثائق الرسمية للتحقق من الهوية</p>
                </div>
                <div className="method-item">
                  <FaFingerprint className="method-icon" />
                  <h3>التحقق البيومتري</h3>
                  <p>استخدام البصمة أو التعرف على الوجه</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="security-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.6}}
          >
            <div className="card-header">
              <FaServer className="card-icon" />
              <h2>أمان الخوادم</h2>
            </div>
            <div className="card-content">
              <div className="server-security">
                <div className="security-item">
                  <FaCheckCircle className="security-icon" />
                  <div className="security-text">
                    <strong>خوادم محمية:</strong> جميع الخوادم محمية بجدران حماية متقدمة وأنظمة مراقبة مستمرة
                  </div>
                </div>
                <div className="security-item">
                  <FaCheckCircle className="security-icon" />
                  <div className="security-text">
                    <strong>نسخ احتياطية:</strong> نسخ احتياطية يومية في مواقع جغرافية متعددة
                  </div>
                </div>
                <div className="security-item">
                  <FaCheckCircle className="security-icon" />
                  <div className="security-text">
                    <strong>مراقبة 24/7:</strong> مراقبة مستمرة للأنظمة على مدار الساعة
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="security-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.8}}
          >
            <div className="card-header">
              <FaEye className="card-icon" />
              <h2>المراجعة والتدقيق</h2>
            </div>
            <div className="card-content">
              <div className="audit-process">
                <div className="audit-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>التدقيق الداخلي</h3>
                    <p>مراجعة دورية شاملة لجميع الأنظمة والأمان</p>
                  </div>
                </div>
                <div className="audit-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>التدقيق الخارجي</h3>
                    <p>استعانة بشركات متخصصة في الأمن السيبراني</p>
                  </div>
                </div>
                <div className="audit-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>التحديث المستمر</h3>
                    <p>تحديث الأنظمة والبرمجيات باستمرار</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="security-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:1.0}}
          >
            <div className="card-header">
              <FaGlobe className="card-icon" />
              <h2>الامتثال والمعايير</h2>
            </div>
            <div className="card-content">
              <div className="compliance-standards">
                <div className="standard-item">
                  <FaCertificate className="standard-icon" />
                  <h3>ISO 27001</h3>
                  <p>معيار إدارة أمن المعلومات الدولي</p>
                </div>
                <div className="standard-item">
                  <FaCertificate className="standard-icon" />
                  <h3>PCI DSS</h3>
                  <p>معيار أمان بيانات بطاقات الدفع</p>
                </div>
                <div className="standard-item">
                  <FaCertificate className="standard-icon" />
                  <h3>GDPR</h3>
                  <p>اللائحة العامة لحماية البيانات</p>
                </div>
                <div className="standard-item">
                  <FaCertificate className="standard-icon" />
                  <h3>SOC 2</h3>
                  <p>معيار ضوابط الخدمة والثقة</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="security-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:1.2}}
          >
            <div className="card-header">
              <FaCog className="card-icon" />
              <h2>أفضل الممارسات</h2>
            </div>
            <div className="card-content">
              <div className="best-practices">
                <div className="practice-item">
                  <FaCheckCircle className="practice-icon" />
                  <div className="practice-content">
                    <h3>التحقق الثنائي</h3>
                    <p>تفعيل المصادقة الثنائية لجميع الحسابات</p>
                  </div>
                </div>
                <div className="practice-item">
                  <FaCheckCircle className="practice-icon" />
                  <div className="practice-content">
                    <h3>كلمات مرور قوية</h3>
                    <p>فرض استخدام كلمات مرور معقدة وآمنة</p>
                  </div>
                </div>
                <div className="practice-item">
                  <FaCheckCircle className="practice-icon" />
                  <div className="practice-content">
                    <h3>تسجيل النشاط</h3>
                    <p>تسجيل جميع الأنشطة والعمليات للمراجعة</p>
                  </div>
                </div>
                <div className="practice-item">
                  <FaCheckCircle className="practice-icon" />
                  <div className="practice-content">
                    <h3>التدريب المستمر</h3>
                    <p>تدريب الفريق على أحدث تقنيات الأمان</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="security-footer"
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          transition={{duration:0.8, delay:1.4}}
        >
          <div className="footer-content">
            <div className="security-badges">
              <span className="badge">آمن 100%</span>
              <span className="badge">محمي</span>
              <span className="badge">معتمد</span>
              <span className="badge">مشفر</span>
            </div>
            <div className="footer-info">
              <p><strong>آخر تحديث أمني:</strong> يناير 2025</p>
              <p>للاستفسارات الأمنية، يرجى التواصل مع فريق الأمان</p>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}


