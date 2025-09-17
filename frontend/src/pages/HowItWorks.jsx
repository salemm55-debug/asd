import { motion } from 'framer-motion'
import { 
  FaUser, FaHandshake, FaShieldAlt, FaCheckCircle, FaMoneyBillWave, 
  FaRocket, FaComments, FaClock, FaStar, FaTrophy
} from 'react-icons/fa'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "اختيار الدور",
      description: "اختر دورك في الصفقة - مشتري أو بائع",
      icon: FaUser,
      color: "#10b981"
    },
    {
      number: 2,
      title: "إنشاء الطلب",
      description: "املأ تفاصيل الصفقة واختر الوسيط المناسب",
      icon: FaHandshake,
      color: "#3b82f6"
    },
    {
      number: 3,
      title: "إيداع آمن",
      description: "يتم إيداع المبلغ لدى الوسيط حتى تسليم المنتج/الخدمة",
      icon: FaShieldAlt,
      color: "#f59e0b"
    },
    {
      number: 4,
      title: "التواصل المباشر",
      description: "تواصل مباشر مع الوسيط عبر الشات المتقدم",
      icon: FaComments,
      color: "#8b5cf6"
    },
    {
      number: 5,
      title: "التسليم والتأكيد",
      description: "بعد التأكيد من الطرفين يتم تحويل المبلغ للبائع",
      icon: FaCheckCircle,
      color: "#ef4444"
    },
    {
      number: 6,
      title: "التقييم والمتابعة",
      description: "قيم تجربتك واترك تعليقاً لمساعدة الآخرين",
      icon: FaStar,
      color: "#06b6d4"
    }
  ]

  return (
    <motion.section 
      className="section how-it-works-section"
      initial={{opacity:0, y:50}} 
      animate={{opacity:1, y:0}} 
      transition={{duration:0.8}}
      style={{
        background: "linear-gradient(180deg, rgba(231,245,239,0.35) 0%, rgba(255,255,255,0.8) 50%, rgba(231,245,239,0.35) 100%)",
        padding: '80px 20px'
      }}
    >
      <div className="section-header" style={{textAlign: 'center', marginBottom: '60px'}}>
        <motion.h1 
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.2}}
          style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          كيف يعمل النظام؟
        </motion.h1>
        <motion.p 
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.6, delay:0.4}}
          style={{
            fontSize: '1.2rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          خطوات بسيطة لطلب وسيط والحصول على أفضل خدمة
        </motion.p>
      </div>
      
      <div className="steps-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {steps.map((step, idx) => (
          <motion.div 
            key={step.number}
            className="step-card"
            initial={{opacity:0, y:30}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.6 + idx*0.1}}
            whileHover={{scale:1.05, y:-5}}
            style={{
              background: 'white',
              padding: '40px 24px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="step-number" style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: `0 4px 15px ${step.color}40`
            }}>
              {step.number}
            </div>
            
            <motion.div 
              className="step-icon"
              whileHover={{rotate: 10, scale: 1.1}}
              transition={{duration: 0.3}}
              style={{
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                color: 'white',
                fontSize: '32px',
                boxShadow: `0 8px 25px ${step.color}30`
              }}
            >
              <step.icon />
            </motion.div>
            
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '16px'
            }}>
              {step.title}
            </h3>
            
            <p style={{
              color: '#64748b',
              lineHeight: '1.6',
              fontSize: '1rem'
            }}>
              {step.description}
            </p>
            
            <div className="step-glow" style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: `radial-gradient(circle, ${step.color}10, transparent 70%)`,
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}></div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="cta-section"
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.6, delay:1.2}}
        style={{
          textAlign: 'center',
          marginTop: '60px',
          padding: '40px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '20px',
          border: '1px solid #e2e8f0'
        }}
      >
        <h3 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '16px'
        }}>
          جاهز للبدء؟
        </h3>
        <p style={{
          fontSize: '1.1rem',
          color: '#64748b',
          marginBottom: '32px'
        }}>
          ابدأ رحلتك مع وسيطك الآن واستمتع بأفضل تجربة وساطة
        </p>
        <motion.button 
          whileHover={{scale:1.05, y:-2}}
          whileTap={{scale:0.95}}
          style={{
            background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
            border: 'none',
            borderRadius: '50px',
            padding: '16px 40px',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(18, 140, 126, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: '0 auto',
            transition: 'all 0.3s ease'
          }}
        >
          <FaRocket />
          <span>ابدأ الآن</span>
        </motion.button>
      </motion.div>
    </motion.section>
  )
}


