import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FaHome, FaArrowLeft, FaSearch, FaExclamationTriangle, 
  FaQuestionCircle, FaRocket, FaShieldAlt, FaUsers,
  FaComments, FaTicketAlt, FaCog, FaGlobe
} from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="not-found-container">
      <motion.div 
        className="not-found-content"
        initial={{opacity:0, y:50}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <motion.div 
          className="error-animation"
          initial={{scale:0.8}} 
          animate={{scale:1}} 
          transition={{duration:0.6, delay:0.2}}
        >
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          <div className="error-particles">
            <div className="particle particle-1"></div>
            <div className="particle particle-2"></div>
            <div className="particle particle-3"></div>
            <div className="particle particle-4"></div>
            <div className="particle particle-5"></div>
          </div>
        </motion.div>

        <motion.div 
          className="error-text"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.4}}
        >
          <h1>404</h1>
          <h2>الصفحة غير موجودة</h2>
          <p>عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.</p>
        </motion.div>

        <motion.div 
          className="error-actions"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.6}}
        >
          <Link to="/" className="action-btn primary">
            <FaHome />
            العودة للرئيسية
          </Link>
          <button 
            className="action-btn secondary"
            onClick={() => window.history.back()}
          >
            <FaArrowLeft />
            العودة للخلف
          </button>
        </motion.div>

        <motion.div 
          className="helpful-links"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.8}}
        >
          <h3>ربما تبحث عن:</h3>
          <div className="links-grid">
            <Link to="/" className="help-link">
              <FaHome />
              <span>الصفحة الرئيسية</span>
            </Link>
            <Link to="/brokers" className="help-link">
              <FaUsers />
              <span>الوسطاء</span>
            </Link>
            <Link to="/chat" className="help-link">
              <FaComments />
              <span>الشات</span>
            </Link>
            <Link to="/features" className="help-link">
              <FaShieldAlt />
              <span>الميزات</span>
            </Link>
            <Link to="/broker-request" className="help-link">
              <FaRocket />
              <span>طلب وسيط</span>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="error-footer"
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          transition={{duration:0.6, delay:1.0}}
        >
          <p>إذا كنت تعتقد أن هذا خطأ، يرجى <Link to="/contact">التواصل معنا</Link></p>
        </motion.div>
      </motion.div>
    </div>
  )
}
