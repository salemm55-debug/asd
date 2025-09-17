import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FaTicketAlt, FaArrowLeft, FaHome, FaExclamationTriangle, 
  FaComments, FaUsers, FaRocket, FaShieldAlt,
  FaQuestionCircle, FaCog, FaGlobe, FaSearch
} from 'react-icons/fa'

export default function TicketNotFound() {
  return (
    <div className="ticket-not-found-container">
      <motion.div 
        className="ticket-not-found-content"
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
          <div className="error-icon ticket-icon">
            <FaTicketAlt />
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
          <h1>التذكرة غير موجودة</h1>
          <h2>لا يمكن العثور على هذه التذكرة</h2>
          <p>عذراً، التذكرة التي تحاول الوصول إليها غير موجودة أو تم حذفها.</p>
        </motion.div>

        <motion.div 
          className="error-actions"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.6}}
        >
          <Link to="/admin" className="action-btn primary">
            <FaTicketAlt />
            إنشاء تذكرة جديدة
          </Link>
          <Link to="/" className="action-btn secondary">
            <FaHome />
            العودة للرئيسية
          </Link>
        </motion.div>

        <motion.div 
          className="helpful-links"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.8}}
        >
          <h3>خيارات أخرى:</h3>
          <div className="links-grid">
            <Link to="/admin" className="help-link">
              <FaCog />
              <span>لوحة التحكم</span>
            </Link>
            <Link to="/chat" className="help-link">
              <FaComments />
              <span>الشات المباشر</span>
            </Link>
            <Link to="/brokers" className="help-link">
              <FaUsers />
              <span>الوسطاء</span>
            </Link>
            <Link to="/features" className="help-link">
              <FaShieldAlt />
              <span>الميزات</span>
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="error-footer"
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          transition={{duration:0.6, delay:1.0}}
        >
          <p>إذا كنت تحتاج مساعدة، يرجى <Link to="/contact">التواصل معنا</Link></p>
        </motion.div>
      </motion.div>
    </div>
  )
}
