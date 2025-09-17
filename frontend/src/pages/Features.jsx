import { motion } from 'framer-motion'
import { FaShieldAlt, FaHeadset, FaChartLine, FaLanguage, FaRocket, FaGem, FaCrown, FaTrophy, FaMedal, FaAward, FaGlobe, FaFire, FaBolt, FaMagic, FaHeart, FaStar, FaUsers, FaHandshake, FaComments, FaCheck } from 'react-icons/fa'

export default function Features() {
  const features = [
    {
      icon: FaShieldAlt,
      title: 'وساطة آمنة ومضمونة',
      description: 'حفظ المبلغ في حساب ضمان حتى إتمام التسليم والتأكيد مع حماية كاملة للطرفين',
      benefits: ['حماية مالية كاملة', 'ضمان استرداد الأموال', 'تشفير البيانات', 'مراجعة أمنية مستمرة'],
      color: '#10b981',
      premium: true
    },
    {
      icon: FaHeadset,
      title: 'دعم فني متقدم',
      description: 'فريق مساندة على مدار الساعة عبر قنوات متعددة مع استجابة فورية',
      benefits: ['دعم 24/7', 'استجابة فورية', 'قنوات متعددة', 'خبراء متخصصون'],
      color: '#3b82f6',
      premium: true
    },
    {
      icon: FaChartLine,
      title: 'تقارير ولوحات ذكية',
      description: 'لوحات متابعة متقدمة، فواتير تلقائية، وإشعارات لحظية لكل صفقة',
      benefits: ['لوحات تفاعلية', 'تقارير مفصلة', 'إشعارات فورية', 'تحليلات ذكية'],
      color: '#f59e0b',
      premium: true
    },
    {
      icon: FaRocket,
      title: 'سرعة فائقة',
      description: 'معالجة سريعة للصفقات مع تقنيات متقدمة لضمان أفضل أداء',
      benefits: ['معالجة فورية', 'تقنيات متقدمة', 'أداء محسن', 'استجابة سريعة'],
      color: '#ef4444',
      premium: true
    },
    {
      icon: FaGem,
      title: 'جودة عالية',
      description: 'معايير جودة عالمية مع ضمان رضا العملاء بنسبة 100%',
      benefits: ['معايير عالمية', 'جودة مضمونة', 'رضا العملاء', 'ضمان الجودة'],
      color: '#06b6d4',
      premium: true
    }
  ]

  const stats = [
    { icon: FaUsers, number: '10,000+', label: 'عميل راضي', color: '#10b981' },
    { icon: FaHandshake, number: '50,000+', label: 'صفقة مكتملة', color: '#3b82f6' },
    { icon: FaStar, number: '4.9/5', label: 'تقييم العملاء', color: '#f59e0b' },
    { icon: FaGlobe, number: '15+', label: 'دولة', color: '#8b5cf6' }
  ]

  return (
    <div className="features-container">
      {/* Header Section */}
      <motion.section 
        className="features-header"
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <FaStar className="main-icon" />
              <div className="icon-glow"></div>
            </div>
            <h1>ميزات وسيطك المتقدمة</h1>
            <p>اكتشف القوة الحقيقية لمنصة الوساطة الأكثر تطوراً في المنطقة</p>
          </div>
        </div>
      </motion.section>


      {/* Features Grid */}
      <motion.section 
        className="features-grid-section"
        initial={{opacity:0}} 
        whileInView={{opacity:1}} 
        viewport={{once:true}}
        transition={{duration:0.8}}
      >
        <div className="section-header">
          <h2>ميزات متقدمة</h2>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              className={`feature-card ${feature.premium ? 'premium' : ''}`}
              initial={{opacity:0, y:30}} 
              whileInView={{opacity:1, y:0}} 
              viewport={{once:true}}
              transition={{duration:0.6, delay:index * 0.1}}
              whileHover={{scale:1.02, y:-5}}
            >
              <div className="feature-header">
                <div className="feature-icon-wrapper" style={{backgroundColor: feature.color + '20'}}>
                  <feature.icon className="feature-icon" style={{color: feature.color}} />
                </div>
                {feature.premium && (
                  <div className="premium-badge">
                    <FaCrown className="premium-icon" />
                    مميز
                  </div>
                )}
              </div>
              
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                
                <div className="feature-benefits">
                  <h4>المميزات:</h4>
                  <ul>
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <FaCheck className="check-icon" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="features-cta"
        initial={{opacity:0}} 
        whileInView={{opacity:1}} 
        viewport={{once:true}}
        transition={{duration:0.8}}
      >
        <div className="cta-content">
          <div className="cta-icon">
            <FaRocket className="main-icon" />
            <div className="icon-glow"></div>
          </div>
          <h2>ابدأ رحلتك مع وسيطك اليوم</h2>
          <p>انضم إلى آلاف العملاء الراضين واكتشف قوة الوساطة الآمنة</p>
          <div className="cta-actions">
            <button className="cta-primary">
              <FaRocket />
              ابدأ الآن
            </button>
            <button className="cta-secondary">
              <FaComments />
              تواصل معنا
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}


