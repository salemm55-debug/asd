import { motion } from 'framer-motion'
import { FaGem, FaCrown, FaTrophy, FaMedal, FaAward, FaGlobe, FaShieldAlt, FaBolt, FaMagic, FaFire, FaHeart, FaStar, FaUsers, FaHandshake, FaComments, FaRocket, FaCheck, FaTimes, FaArrowRight, FaInfinity, FaHeadset, FaChartLine, FaCog, FaLock, FaGift, FaTag } from 'react-icons/fa'

export default function Pricing() {
  const tiers = [
    {
      name: 'أساسي',
      icon: FaGem,
      fee: '1%',
      originalFee: '1.5%',
      description: 'مثالي للمبتدئين والصفقات الصغيرة',
      features: [
        { text: 'صفقات فردية', included: true },
        { text: 'تنبيهات عبر البريد', included: true },
        { text: 'مساعدة أساسية', included: true },
        { text: 'حماية أساسية', included: true },
        { text: 'تقارير شهرية', included: true },
        { text: 'دعم عبر البريد', included: true },
        { text: 'تكاملات متقدمة', included: false },
        { text: 'دعم أولوية', included: false }
      ],
      color: '#10b981',
      popular: false,
      savings: '33%'
    },
    {
      name: 'محترف',
      icon: FaCrown,
      fee: '0.8%',
      originalFee: '1.2%',
      description: 'الأفضل للوسطاء المحترفين',
      features: [
        { text: 'متابعة فورية', included: true },
        { text: 'تقارير موسعة', included: true },
        { text: 'دعم أولوية', included: true },
        { text: 'حماية متقدمة', included: true },
        { text: 'تقارير يومية', included: true },
        { text: 'دعم عبر الهاتف', included: true },
        { text: 'تكاملات متقدمة', included: true },
        { text: 'تحليلات ذكية', included: true }
      ],
      color: '#f59e0b',
      popular: true,
      savings: '33%'
    },
    {
      name: 'متقدم',
      icon: FaTrophy,
      fee: '0.5%',
      originalFee: '0.8%',
      description: 'للوسطاء ذوي الخبرة العالية',
      features: [
        { text: 'إدارة متقدمة', included: true },
        { text: 'تكاملات متخصصة', included: true },
        { text: 'SLA مضمون', included: true },
        { text: 'حماية متقدمة', included: true },
        { text: 'تقارير مخصصة', included: true },
        { text: 'دعم مخصص', included: true },
        { text: 'تحليلات متقدمة', included: true },
        { text: 'استشارات مجانية', included: true }
      ],
      color: '#8b5cf6',
      popular: false,
      savings: '37%'
    },
    {
      name: 'منشآت',
      icon: FaAward,
      fee: 'تفاوض',
      originalFee: null,
      description: 'حلول مخصصة للشركات الكبيرة',
      features: [
        { text: 'إدارة حساب مخصصة', included: true },
        { text: 'تكاملات خاصة', included: true },
        { text: 'SLA مضمون 99.9%', included: true },
        { text: 'حماية مخصصة', included: true },
        { text: 'تقارير مخصصة', included: true },
        { text: 'دعم مخصص 24/7', included: true },
        { text: 'تدريب فريق', included: true },
        { text: 'استشارات متخصصة', included: true }
      ],
      color: '#ef4444',
      popular: false,
      savings: null
    }
  ]

  const benefits = [
    {
      icon: FaShieldAlt,
      title: 'حماية مالية كاملة',
      description: 'جميع الأموال محمية في حسابات ضمان آمنة'
    },
    {
      icon: FaBolt,
      title: 'سرعة فائقة',
      description: 'معالجة الصفقات في أقل من دقيقة واحدة'
    },
    {
      icon: FaHeadset,
      title: 'دعم 24/7',
      description: 'فريق دعم متاح على مدار الساعة'
    },
    {
      icon: FaChartLine,
      title: 'تقارير ذكية',
      description: 'تحليلات مفصلة ولوحات متابعة متقدمة'
    }
  ]

  const faqs = [
    {
      question: 'هل يمكنني تغيير الخطة في أي وقت؟',
      answer: 'نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت بدون رسوم إضافية.'
    },
    {
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نقبل جميع البطاقات الائتمانية، التحويل البنكي، والدفع الإلكتروني.'
    },
    {
      question: 'هل هناك فترة تجريبية مجانية؟',
      answer: 'نعم، نقدم 30 يوم تجريبي مجاني لجميع الخطط.'
    },
    {
      question: 'ما هو الحد الأدنى للصفقة؟',
      answer: 'لا يوجد حد أدنى، يمكنك بدء الصفقات من أي مبلغ.'
    }
  ]

  return (
    <div className="pricing-container">
      {/* Header Section */}
      <motion.section 
        className="pricing-header"
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <FaGem className="main-icon" />
              <div className="icon-glow"></div>
            </div>
            <h1>خطط أسعار مرنة</h1>            
          </div>
        </div>
      </motion.section>

      {/* Pricing Tiers */}
      <motion.section 
        className="pricing-tiers"
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8, delay:0.2}}
      >
        <div className="section-header">
          <h2>اختر خطتك المثالية</h2>
          <p>جميع الخطط تشمل الحماية الكاملة والدعم المتميز</p>
        </div>
        
        <div className="pricing-grid">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.name}
              className={`pricing-card ${tier.popular ? 'popular' : ''}`}
              initial={{opacity:0, y:30}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.6, delay:0.3 + index * 0.1}}
              whileHover={{scale:1.02, y:-5}}
            >
              {tier.popular && (
                <div className="popular-badge">
                  <FaStar className="star-icon" />
                  الأكثر شعبية
                </div>
              )}
              
              <div className="card-header">
                <div className="tier-icon-wrapper" style={{backgroundColor: tier.color + '20'}}>
                  <tier.icon className="tier-icon" style={{color: tier.color}} />
                </div>
                <h3>{tier.name}</h3>
                <p>{tier.description}</p>
              </div>
              
              <div className="card-pricing">
                <div className="price-container">
                  <span className="price">{tier.fee}</span>
                  {tier.originalFee && (
                    <span className="original-price">{tier.originalFee}</span>
                  )}
                </div>
                {tier.savings && (
                  <div className="savings-badge">
                    <FaTag className="tag-icon" />
                    وفر {tier.savings}
                  </div>
                )}
              </div>
              
              <div className="card-features">
                <ul>
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className={feature.included ? 'included' : 'not-included'}>
                      {feature.included ? (
                        <FaCheck className="check-icon" />
                      ) : (
                        <FaTimes className="times-icon" />
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="card-actions">
                <button className={`pricing-btn ${tier.popular ? 'primary' : 'secondary'}`}>
                  <FaRocket />
                  {tier.name === 'منشآت' ? 'تواصل معنا' : 'ابدأ الآن'}
                </button>
                {tier.name !== 'منشآت' && (
                  <button className="trial-btn">
                    <FaGift />
                    جرب مجاناً 30 يوم
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="pricing-benefits"
        initial={{opacity:0}} 
        whileInView={{opacity:1}} 
        viewport={{once:true}}
        transition={{duration:0.8}}
      >
        <div className="section-header">
          <h2>مميزات تشملها جميع الخطط</h2>
        </div>
        
        <div className="benefits-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '800px', margin: '0 auto'}}>
          {benefits.map((benefit, index) => (
            <motion.div 
              key={benefit.title}
              className="benefit-card"
              initial={{opacity:0, y:30}} 
              whileInView={{opacity:1, y:0}} 
              viewport={{once:true}}
              transition={{duration:0.6, delay:index * 0.1}}
              whileHover={{scale:1.05}}
            >
              <div className="benefit-icon-wrapper">
                <benefit.icon className="benefit-icon" />
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className="pricing-faq"
        initial={{opacity:0}} 
        whileInView={{opacity:1}} 
        viewport={{once:true}}
        transition={{duration:0.8}}
      >
        <div className="section-header">
          <h2>أسئلة شائعة</h2>
          <p>إجابات على أكثر الأسئلة شيوعاً حول خطط الأسعار</p>
        </div>
        
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <motion.div 
              key={faq.question}
              className="faq-card"
              initial={{opacity:0, y:30}} 
              whileInView={{opacity:1, y:0}} 
              viewport={{once:true}}
              transition={{duration:0.6, delay:index * 0.1}}
            >
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="pricing-cta"
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


