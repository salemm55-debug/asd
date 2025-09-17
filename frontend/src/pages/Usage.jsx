import { motion } from 'framer-motion'
import { FaShieldAlt, FaHandshake, FaGavel, FaFileContract, FaUserCheck, FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

export default function Usage() {
  return (
    <div className="usage-container">
      <motion.section 
        className="usage-section" 
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
        aria-labelledby="usage-title"
      >
        <div className="usage-header">
          <div className="header-icon">
            <FaFileContract className="main-icon" />
            <div className="icon-glow"></div>
          </div>
          <h1 id="usage-title">اتفاقية الاستخدام</h1>
          <p className="usage-subtitle">الشروط والأحكام التي تحكم استخدام منصة وسيطك</p>
        </div>

        <div className="usage-content" style={{direction: 'rtl', textAlign: 'right'}}>
          <motion.div 
            className="usage-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.2}}
          >
            <div className="card-header">
              <FaShieldAlt className="card-icon" />
              <h2>الالتزامات الأساسية</h2>
            </div>
            <div className="card-content">
              <ol className="usage-list">
                <li>
                  <FaCheckCircle className="list-icon" />
                  <div className="list-content">
                    <strong>الموافقة على الشروط:</strong> باستخدامك المنصة فأنت توافق على جميع الشروط والأحكام وسياسة الخصوصية المعلنة.
                  </div>
                </li>
                <li>
                  <FaCheckCircle className="list-icon" />
                  <div className="list-content">
                    <strong>الشفافية في التعاملات:</strong> جميع التعاملات تتم بشفافية كاملة عبر قنوات الدفع المعتمدة والموثوقة.
                  </div>
                </li>
                <li>
                  <FaCheckCircle className="list-icon" />
                  <div className="list-content">
                    <strong>التوثيق والحفظ:</strong> يلتزم الوسيط بتوثيق الصفقة بشكل كامل وحفظ حقوق جميع الأطراف المعنية.
                  </div>
                </li>
                <li>
                  <FaCheckCircle className="list-icon" />
                  <div className="list-content">
                    <strong>حل النزاعات:</strong> أي نزاع أو خلاف يخضع لاختصاص المحاكم المختصة وفقاً للقوانين المعمول بها.
                  </div>
                </li>
              </ol>
            </div>
          </motion.div>

          <motion.div 
            className="usage-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.4}}
          >
            <div className="card-header">
              <FaHandshake className="card-icon" />
              <h2>مسؤوليات المستخدمين</h2>
            </div>
            <div className="card-content">
              <ul className="responsibilities-list">
                <li>
                  <FaUserCheck className="list-icon" />
                  <span>توفير معلومات صحيحة ودقيقة عند التسجيل</span>
                </li>
                <li>
                  <FaUserCheck className="list-icon" />
                  <span>الالتزام بالقوانين والأنظمة المعمول بها</span>
                </li>
                <li>
                  <FaUserCheck className="list-icon" />
                  <span>عدم استخدام المنصة لأغراض غير قانونية</span>
                </li>
                <li>
                  <FaUserCheck className="list-icon" />
                  <span>حماية بيانات الحساب وكلمة المرور</span>
                </li>
                <li>
                  <FaUserCheck className="list-icon" />
                  <span>الإبلاغ عن أي نشاط مشبوه أو مخالف</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            className="usage-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.6}}
          >
            <div className="card-header">
              <FaLock className="card-icon" />
              <h2>الحماية والأمان</h2>
            </div>
            <div className="card-content">
              <div className="security-features">
                <div className="security-item">
                  <FaShieldAlt className="security-icon" />
                  <h3>تشفير البيانات</h3>
                  <p>جميع البيانات محمية بتقنيات التشفير المتقدمة</p>
                </div>
                <div className="security-item">
                  <FaCheckCircle className="security-icon" />
                  <h3>التحقق من الهوية</h3>
                  <p>نظام متقدم للتحقق من هوية المستخدمين</p>
                </div>
                <div className="security-item">
                  <FaExclamationTriangle className="security-icon" />
                  <h3>مراقبة النشاط</h3>
                  <p>مراقبة مستمرة للأنشطة المشبوهة</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="usage-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.8}}
          >
            <div className="card-header">
              <FaGavel className="card-icon" />
              <h2>الالتزامات القانونية</h2>
            </div>
            <div className="card-content">
              <div className="legal-info">
                <p>تخضع هذه الاتفاقية للقوانين المعمول بها في الدولة. في حالة وجود أي نزاع، سيتم حله وفقاً للقوانين المحلية.</p>
                <div className="legal-highlights">
                  <div className="highlight-item">
                    <strong>الاختصاص القضائي:</strong> المحاكم المحلية
                  </div>
                  <div className="highlight-item">
                    <strong>القانون المطبق:</strong> القوانين المحلية المعمول بها
                  </div>
                  <div className="highlight-item">
                    <strong>لغة الاتفاقية:</strong> العربية
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="usage-footer"
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          transition={{duration:0.8, delay:1.0}}
        >
          <div className="footer-content">
            <p><strong>آخر تحديث:</strong> يناير 2025</p>
            <p>للاستفسارات حول هذه الاتفاقية، يرجى التواصل مع فريق الدعم</p>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}


