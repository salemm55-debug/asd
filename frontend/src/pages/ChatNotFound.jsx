import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FaComments, FaArrowLeft, FaHome, FaExclamationTriangle, 
  FaTicketAlt, FaUsers, FaRocket, FaShieldAlt,
  FaQuestionCircle, FaCog, FaGlobe, FaSearch
} from 'react-icons/fa'

export default function ChatNotFound() {
  return (
    <div className="chat-not-found-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Cairo, sans-serif'
    }}>
      <motion.div 
        className="chat-not-found-content"
        initial={{opacity:0, y:50}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div 
          className="error-animation"
          initial={{scale:0.8}} 
          animate={{scale:1}} 
          transition={{duration:0.6, delay:0.2}}
          style={{
            marginBottom: '40px',
            position: 'relative'
          }}
        >
          <div className="error-icon chat-icon" style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            color: 'white',
            fontSize: '48px',
            boxShadow: '0 10px 30px rgba(18, 140, 126, 0.3)',
            position: 'relative',
            zIndex: 2
          }}>
            <FaComments />
          </div>
          <div className="error-particles" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '200px',
            height: '200px',
            pointerEvents: 'none'
          }}>
            {[1, 2, 3, 4, 5].map(i => (
              <motion.div 
                key={i}
                className={`particle particle-${i}`}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.8, 0.3],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  width: '20px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
                  borderRadius: '50%',
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: 0.3
                }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="error-text"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.4}}
          style={{marginBottom: '40px'}}
        >
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#1a202c',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>الشات غير متاح</h1>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '16px'
          }}>لا يمكن العثور على هذه المحادثة</h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            lineHeight: '1.6',
            maxWidth: '400px',
            margin: '0 auto'
          }}>عذراً، المحادثة التي تحاول الوصول إليها غير موجودة أو انتهت صلاحيتها.</p>
        </motion.div>

        <motion.div 
          className="error-actions"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.6}}
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}
        >
          <Link to="/chat" className="action-btn primary" style={{
            background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '50px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(18, 140, 126, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 15px 40px rgba(18, 140, 126, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 10px 30px rgba(18, 140, 126, 0.3)'
          }}
          >
            <FaComments />
            بدء محادثة جديدة
          </Link>
          <Link to="/" className="action-btn secondary" style={{
            background: 'transparent',
            color: '#6b7280',
            padding: '16px 32px',
            borderRadius: '50px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            border: '2px solid #e5e7eb',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f9fafb'
            e.target.style.borderColor = '#d1d5db'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent'
            e.target.style.borderColor = '#e5e7eb'
          }}
          >
            <FaHome />
            العودة للرئيسية
          </Link>
        </motion.div>

        <motion.div 
          className="helpful-links"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.8}}
          style={{marginBottom: '30px'}}
        >
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '20px'
          }}>خيارات أخرى:</h3>
          <div className="links-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            {[
              { to: '/brokers', icon: FaUsers, text: 'تصفح الوسطاء' },
              { to: '/admin', icon: FaCog, text: 'لوحة التحكم' },
              { to: '/features', icon: FaShieldAlt, text: 'الميزات' },
              { to: '/broker-request', icon: FaRocket, text: 'طلب وسيط' }
            ].map((link, index) => (
              <Link key={index} to={link.to} className="help-link" style={{
                background: '#f8fafc',
                padding: '16px 12px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#374151',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f1f5f9'
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f8fafc'
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = 'none'
              }}
              >
                <link.icon style={{fontSize: '20px', color: '#128c7e'}} />
                <span>{link.text}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="error-footer"
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          transition={{duration:0.6, delay:1.0}}
          style={{
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb'
          }}
        >
          <p style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            margin: 0
          }}>
            إذا كنت تحتاج مساعدة، يرجى{' '}
            <Link to="/contact" style={{
              color: '#128c7e',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              التواصل معنا
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
