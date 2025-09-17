import { motion } from 'framer-motion'
import { FaQuestionCircle, FaChevronDown, FaShieldAlt, FaClock, FaMoneyBillWave, FaUsers, FaHandshake, FaHeadset, FaLock, FaCheckCircle } from 'react-icons/fa'

export default function FAQ() {
  const qa = [
    {
      question: 'كيف أفتح صفقة؟',
      answer: 'من صفحة كيف نعمل اضغط فتح صفقة واتبع الخطوات. يمكنك أيضاً استخدام صفحة طلب وسيط لإنشاء صفقة جديدة.',
      icon: FaHandshake,
      category: 'general'
    },
    {
      question: 'هل الأموال آمنة؟',
      answer: 'نستخدم إيداع وسيط وتحويل بعد تأكيد الطرفين. جميع المعاملات محمية بنظام أمان متقدم ومراقبة 24/7.',
      icon: FaShieldAlt,
      category: 'security'
    },
    {
      question: 'ما هي رسوم الخدمة؟',
      answer: 'تظهر بوضوح قبل تأكيد الصفقة. الرسوم تتراوح بين 1-3% حسب نوع الصفقة وتشمل جميع الخدمات.',
      icon: FaMoneyBillWave,
      category: 'pricing'
    },
    {
      question: 'كم من الوقت يستغرق إتمام الصفقة؟',
      answer: 'معظم الصفقات تتم خلال 24-48 ساعة. الصفقات المعقدة قد تستغرق أسبوع واحد كحد أقصى.',
      icon: FaClock,
      category: 'timing'
    },
    {
      question: 'كيف أتأكد من مصداقية الوسيط؟',
      answer: 'جميع الوسطاء معتمدون ومتحققون. يمكنك مراجعة تقييماتهم وعدد الصفقات المكتملة قبل التعامل.',
      icon: FaUsers,
      category: 'brokers'
    },
    {
      question: 'هل يمكنني إلغاء الصفقة؟',
      answer: 'نعم، يمكنك إلغاء الصفقة خلال 24 ساعة من إنشائها. بعد ذلك يتم تطبيق سياسة الإلغاء حسب نوع الصفقة.',
      icon: FaCheckCircle,
      category: 'cancellation'
    },
    {
      question: 'كيف أتواصل مع الدعم الفني؟',
      answer: 'يمكنك التواصل معنا عبر الشات المباشر أو إرسال تذكرة دعم. فريقنا متاح 24/7 لمساعدتك.',
      icon: FaHeadset,
      category: 'support'
    },
    {
      question: 'هل بياناتي الشخصية محمية؟',
      answer: 'نعم، نستخدم أحدث تقنيات التشفير لحماية بياناتك. لا نشارك معلوماتك مع أطراف ثالثة.',
      icon: FaLock,
      category: 'privacy'
    },
    {
      question: 'ما هي أنواع الصفقات المدعومة؟',
      answer: 'ندعم جميع أنواع الصفقات: العقارات، المركبات، الإلكترونيات، المجوهرات، والخدمات العامة.',
      icon: FaHandshake,
      category: 'types'
    },
    {
      question: 'كيف أسترد أموالي في حالة المشاكل؟',
      answer: 'لدينا نظام ضمان شامل. في حالة أي مشكلة، نضمن استرداد أموالك خلال 7 أيام عمل.',
      icon: FaShieldAlt,
      category: 'refund'
    },
    {
      question: 'هل يمكنني استخدام المنصة من خارج السعودية؟',
      answer: 'نعم، المنصة متاحة عالمياً. لكن بعض الخدمات قد تختلف حسب البلد.',
      icon: FaUsers,
      category: 'international'
    },
    {
      question: 'كيف أتأكد من وصول المال للبائع؟',
      answer: 'نرسل إشعارات فورية عند كل خطوة. يمكنك تتبع حالة الدفع في لوحة التحكم.',
      icon: FaCheckCircle,
      category: 'tracking'
    }
  ]

  const categories = [
    { id: 'all', name: 'جميع الأسئلة', icon: FaQuestionCircle },
    { id: 'general', name: 'عام', icon: FaHandshake },
    { id: 'security', name: 'الأمان', icon: FaShieldAlt },
    { id: 'pricing', name: 'الأسعار', icon: FaMoneyBillWave },
    { id: 'support', name: 'الدعم', icon: FaHeadset }
  ]

  return (
    <div className="faq-container">
      <motion.section 
        className="faq-hero"
        initial={{opacity:0, y:30}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.8}}
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="hero-content">
          <h1 style={{color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>الأسئلة الشائعة</h1>
          <p style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem'}}>إجابات على أكثر الأسئلة شيوعاً حول منصة وسيطك</p>
        </div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}></div>
      </motion.section>

      <motion.section 
        className="faq-content"
        initial={{opacity:0, y:30}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.8, delay:0.2}}
      >
        <div className="faq-grid">
          {qa.map((item, index) => (
            <motion.details 
              key={index}
              className="faq-item"
              initial={{opacity:0, y:20}}
              animate={{opacity:1, y:0}}
              transition={{duration:0.5, delay:index * 0.1}}
              whileHover={{scale:1.02}}
            >
              <summary className="faq-question">
                <div className="question-icon">
                  <item.icon />
                </div>
                <span>{item.question}</span>
                <FaChevronDown className="chevron" />
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </motion.details>
          ))}
        </div>
      </motion.section>
    </div>
  )
}


