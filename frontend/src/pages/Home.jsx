import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  FaShieldAlt, FaHandshake, FaChartLine, FaCheckCircle, FaRocket, FaUsers, 
  FaLock, FaClock, FaComments, FaStar, FaFire, FaGem, FaTrophy, FaMedal,
  FaGlobe, FaBolt, FaMagic, FaBrain, FaRobot, FaHeart, FaAward,
  FaSearch, FaFilter, FaSort, FaPlus, FaEye, FaEdit, FaTrash, FaDownload,
  FaUpload, FaSync, FaRedo, FaBell, FaCog, FaUser, FaSignInAlt, FaSignOutAlt,
  FaHome, FaArrowRight, FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaVolumeMute,
  FaThumbsUp, FaThumbsDown, FaShare, FaBookmark, FaFlag, FaExclamationTriangle,
  FaInfoCircle, FaQuestionCircle, FaGraduationCap, FaUniversity, FaBuilding,
  FaCar, FaPlane, FaShip, FaTrain, FaMotorcycle, FaBicycle, FaTruck,
  FaMoneyBillWave, FaCreditCard, FaWallet, FaCoins, FaDollarSign, FaEuroSign,
  FaPoundSign, FaYenSign, FaBitcoin, FaEthereum, FaPaypal, FaStripe,
  FaQuoteLeft, FaKey, FaUserShield, FaPhone, FaHeadset
} from 'react-icons/fa'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 8700,
    totalBrokers: 650,
    totalTransactions: 234000,
    successRate: 98.7,
    averageRating: 4.8,
    totalCountries: 46
  })

  // Auto-play slideshow - show only first slide
  useEffect(() => {
    setCurrentSlide(0)
    setIsPlaying(false)
  }, [])

  const heroSlides = [
    {
      title: "منصة وسيطك",
      subtitle: "الوساطة الآمنة والموثوقة",
      description: "نوفر لك أفضل الوسطاء المعتمدين لضمان صفقاتك بأعلى معايير الأمان والجودة",
      image: "hero-1",
      color: "linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)",
      bgPattern: "radial-gradient(circle at 20% 50%, rgba(18, 140, 126, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(13, 107, 95, 0.2) 0%, transparent 50%)",
      icon: FaRocket,
      animation: "float"
    },
    {
      title: "حماية مضمونة",
      subtitle: "أمان 100% لجميع معاملاتك",
      description: "نظام حماية متقدم يضمن سلامة أموالك وبياناتك في كل خطوة",
      image: "hero-2", 
      color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      bgPattern: "radial-gradient(circle at 30% 40%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(5, 150, 105, 0.3) 0%, transparent 50%)",
      icon: FaShieldAlt,
      animation: "pulse"
    },
    {
      title: "خدمة 24/7",
      subtitle: "دعم فني متواصل",
      description: "فريق الدعم الفني متاح على مدار الساعة لمساعدتك في أي وقت",
      image: "hero-3",
      color: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      bgPattern: "radial-gradient(circle at 40% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 70%, rgba(29, 78, 216, 0.3) 0%, transparent 50%)",
      icon: FaClock,
      animation: "rotate"
    }
  ]

  const features = [
    {
      icon: FaShieldAlt,
      title: "أمان متقدم",
      description: "نظام حماية متطور يضمن سلامة معاملاتك",
      color: "#10b981"
    },
    {
      icon: FaUsers,
      title: "وسطاء معتمدون",
      description: "أكثر من 650 وسيط معتمد وموثوق",
      color: "#3b82f6"
    },
    {
      icon: FaClock,
      title: "سرعة في التنفيذ",
      description: "إنجاز الصفقات في أقل وقت ممكن",
      color: "#f59e0b"
    },
    {
      icon: FaChartLine,
      title: "تقارير مفصلة",
      description: "إحصائيات وتقارير شاملة لجميع معاملاتك",
      color: "#8b5cf6"
    },
    {
      icon: FaComments,
      title: "دعم فني 24/7",
      description: "فريق الدعم متاح على مدار الساعة",
      color: "#ef4444"
    },
    {
      icon: FaTrophy,
      title: "جودة مضمونة",
      description: "نسبة نجاح 98.7% في جميع الصفقات",
      color: "#06b6d4"
    }
  ]

  const testimonials = [
    {
      name: "أحمد محمد العتيبي",
      role: "مستثمر عقاري",
      rating: 5,
      comment: "منصة وسيطك غيرت حياتي المهنية. الوسطاء المعتمدون والخدمة المتميزة جعلت من كل صفقة تجربة ناجحة.",
      avatar: "avatar-1"
    },
    {
      name: "فاطمة علي السعيد",
      role: "رائدة أعمال",
      rating: 5,
      comment: "الأمان والثقة هما ما يميز وسيطك. أشعر بالراحة التامة عند التعامل مع الوسطاء المعتمدين.",
      avatar: "avatar-2"
    },
    {
      name: "محمد عبدالله القحطاني",
      role: "تاجر",
      rating: 5,
      comment: "السرعة والدقة في التنفيذ مذهلة. أنصح الجميع بتجربة منصة وسيطك.",
      avatar: "avatar-3"
    },
    {
      name: "سارة أحمد المطيري",
      role: "مصممة أزياء",
      rating: 5,
      comment: "وسيطك ساعدني في بيع تصاميمي بثقة وأمان. العملاء يثقون في النظام والدفع آمن ومضمون.",
      avatar: "avatar-4"
    }
  ]

  const currencies = [
    { name: "الريال السعودي", code: "SAR", rate: "1.00", change: "+0.1%", icon: FaMoneyBillWave },
    { name: "الدولار الأمريكي", code: "USD", rate: "3.75", change: "+0.3%", icon: FaDollarSign },
    { name: "اليورو", code: "EUR", rate: "4.12", change: "-0.2%", icon: FaEuroSign },
    { name: "الجنيه الإسترليني", code: "GBP", rate: "4.78", change: "+0.5%", icon: FaPoundSign },
    { name: "الين الياباني", code: "JPY", rate: "0.025", change: "+0.1%", icon: FaYenSign },
    { name: "الدرهم الإماراتي", code: "AED", rate: "1.02", change: "+0.2%", icon: FaCoins },
    { name: "الدينار الكويتي", code: "KWD", rate: "12.25", change: "-0.1%", icon: FaCoins },
    { name: "الريال القطري", code: "QAR", rate: "1.03", change: "+0.3%", icon: FaCoins },
    { name: "الدرهم المغربي", code: "MAD", rate: "0.37", change: "+0.2%", icon: FaCoins },
    { name: "الدينار الأردني", code: "JOD", rate: "5.29", change: "+0.1%", icon: FaCoins },
    { name: "الليرة التركية", code: "TRY", rate: "0.12", change: "-0.4%", icon: FaCoins },
    { name: "الجنيه المصري", code: "EGP", rate: "0.12", change: "+0.6%", icon: FaCoins },
    { name: "البيتكوين", code: "BTC", rate: "140,250", change: "+2.1%", icon: FaBitcoin },
    { name: "الإيثيريوم", code: "ETH", rate: "3,250", change: "+1.8%", icon: FaEthereum },
    { name: "الريبل", code: "XRP", rate: "2.15", change: "+0.9%", icon: FaCoins }
  ]

  return (
    <div className="home-container">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration:0.8}}
      >
        <div className="hero-slideshow">
          {heroSlides.map((slide, index) => (
            <motion.div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              initial={{opacity:0, x:100, scale: 0.9}} 
              animate={{
                opacity: index === currentSlide ? 1 : 0, 
                x: index === currentSlide ? 0 : 100,
                scale: index === currentSlide ? 1 : 0.9
              }} 
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                scale: { duration: 1.5, ease: "easeOut" }
              }}
              style={{
                '--slide-color': slide.color,
                '--bg-pattern': slide.bgPattern
              }}
            >
              <div className="hero-content">
                <motion.div 
                  className="hero-text"
                  initial={{opacity:0, y:50, rotateX: 15}} 
                  animate={{opacity:1, y:0, rotateX: 0}} 
                  transition={{
                    duration: 1.0, 
                    delay: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <motion.h1
                    initial={{opacity:0, y:30, scale: 0.8}}
                    animate={{opacity:1, y:0, scale: 1}}
                    transition={{duration: 0.8, delay: 0.5, ease: "easeOut"}}
                    className="hero-title"
                    style={{
                      fontSize: '3.5rem',
                      fontWeight: '800',
                      color: '#1a202c',
                      textAlign: 'center',
                      marginBottom: '20px',
                      lineHeight: '1.2',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      background: 'none',
                      WebkitBackgroundClip: 'unset',
                      WebkitTextFillColor: 'unset'
                    }}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.h2
                    initial={{opacity:0, y:20, scale: 0.9}}
                    animate={{opacity:1, y:0, scale: 1}}
                    transition={{duration: 0.8, delay: 0.7, ease: "easeOut"}}
                    className="hero-subtitle"
                    style={{
                      fontSize: '2rem',
                      fontWeight: '600',
                      color: '#2d3748',
                      textAlign: 'center',
                      marginBottom: '16px',
                      lineHeight: '1.3',
                      textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    {slide.subtitle}
                  </motion.h2>
                  <motion.p
                    initial={{opacity:0, y:20}}
                    animate={{opacity:1, y:0}}
                    transition={{duration: 0.8, delay: 0.9, ease: "easeOut"}}
                    className="hero-description"
                    style={{
                      fontSize: '1.2rem',
                      color: '#4a5568',
                      textAlign: 'center',
                      maxWidth: '600px',
                      margin: '0 auto 40px',
                      lineHeight: '1.6',
                      textShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                  >
                    {slide.description}
                  </motion.p>
                  <motion.div 
                    className="hero-actions"
                    initial={{opacity:0, y:30}}
                    animate={{opacity:1, y:0}}
                    transition={{duration: 0.8, delay: 1.1, ease: "easeOut"}}
                  >
                    <motion.button 
                      className="cta-button primary"
                      whileHover={{scale:1.05, y: -3}}
                      whileTap={{scale:0.95}}
                      transition={{type: "spring", stiffness: 300, damping: 20}}
                      onClick={() => window.location.href = '/broker-request'}
                      style={{
                        background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
                        border: 'none',
                        borderRadius: '50px',
                        padding: '16px 40px',
                        color: 'white',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 8px 25px rgba(18, 140, 126, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        backdropFilter: 'none',
                        filter: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #0d6b5f 0%, #128c7e 100%)'
                        e.target.style.boxShadow = '0 12px 35px rgba(18, 140, 126, 0.6)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)'
                        e.target.style.boxShadow = '0 8px 25px rgba(18, 140, 126, 0.4)'
                      }}
                    >
                      <motion.div
                        className="button-content"
                        whileHover={{rotate: 5}}
                        transition={{duration: 0.2}}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          position: 'relative',
                          zIndex: 2
                        }}
                      >
                        <FaRocket style={{fontSize: '20px'}} />
                        <span>ابدأ الآن</span>
                      </motion.div>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.5s'
                      }}></div>
                    </motion.button>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="hero-visual"
                  initial={{opacity:0, scale:0.8, rotateY: 15}} 
                  animate={{opacity:1, scale:1, rotateY: 0}} 
                  transition={{
                    duration: 1.2, 
                    delay: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                >
                  <div className="hero-graphic">
                    {/* Main Icon with Dynamic Animation */}
                    <motion.div 
                      className="main-hero-icon"
                      animate={slide.animation === 'float' ? {
                        y: [0, -20, 0],
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      } : slide.animation === 'pulse' ? {
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8]
                      } : slide.animation === 'rotate' ? {
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{
                        duration: slide.animation === 'rotate' ? 4 : 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <slide.icon />
                      <div className="main-icon-glow"></div>
                      <div className="main-icon-pulse"></div>
                    </motion.div>

                    <div className="floating-elements">
                      <motion.div 
                        className="element element-1"
                        animate={{
                          y: [0, -30, 0],
                          rotate: [0, 360, 0],
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0
                        }}
                      >
                        <FaShieldAlt />
                        <div className="element-glow"></div>
                        <div className="element-pulse"></div>
                      </motion.div>
                      <motion.div 
                        className="element element-2"
                        animate={{
                          y: [0, 25, 0],
                          rotate: [0, -180, 0],
                          scale: [1, 1.15, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{
                          duration: 5.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                      >
                        <FaUsers />
                        <div className="element-glow"></div>
                        <div className="element-pulse"></div>
                      </motion.div>
                      <motion.div 
                        className="element element-3"
                        animate={{
                          y: [0, -20, 0],
                          rotate: [0, 270, 0],
                          scale: [1, 1.1, 1],
                          opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                          duration: 4.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2
                        }}
                      >
                        <FaChartLine />
                        <div className="element-glow"></div>
                        <div className="element-pulse"></div>
                      </motion.div>
                      <motion.div 
                        className="element element-4"
                        animate={{
                          y: [0, 18, 0],
                          rotate: [0, -90, 0],
                          scale: [1, 1.12, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 5.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 3
                        }}
                      >
                        <FaTrophy />
                        <div className="element-glow"></div>
                        <div className="element-pulse"></div>
                      </motion.div>
                      <motion.div 
                        className="element element-5"
                        animate={{
                          y: [0, -15, 0],
                          rotate: [0, 180, 0],
                          scale: [1, 1.08, 1],
                          opacity: [0.4, 1, 0.4]
                        }}
                        transition={{
                          duration: 4.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1.5
                        }}
                      >
                        <FaClock />
                        <div className="element-glow"></div>
                        <div className="element-pulse"></div>
                      </motion.div>
                      <motion.div 
                        className="element element-6"
                        animate={{
                          y: [0, 22, 0],
                          rotate: [0, -270, 0],
                          scale: [1, 1.06, 1],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 6.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2.5
                        }}
                      >
                        <FaComments />
                        <div className="element-glow"></div>
                        <div className="element-pulse"></div>
                      </motion.div>
                    </div>
                    <div className="background-pattern">
                      <motion.div 
                        className="pattern-circle circle-1"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.1, 0.3, 0.1]
                        }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      ></motion.div>
                      <motion.div 
                        className="pattern-circle circle-2"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.05, 0.2, 0.05]
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 2
                        }}
                      ></motion.div>
                      <motion.div 
                        className="pattern-circle circle-3"
                        animate={{
                          scale: [1, 1.8, 1],
                          opacity: [0.08, 0.25, 0.08]
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 4
                        }}
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
          
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats-section"
        initial={{opacity:0, y:50}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8, delay:0.2}}
      >
        <div className="stats-container">
          <motion.div 
            className="stats-header"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.4}}
          >
            <h2>أرقام تتحدث عن نفسها</h2>
            <p>إحصائيات حقيقية تثبت نجاح منصة وسيطك</p>
          </motion.div>
          
          <div className="stats-grid">
            {[
              { icon: FaUsers, value: stats.totalUsers.toLocaleString(), label: "مستخدم نشط", color: "#3b82f6" },
              { icon: FaHandshake, value: stats.totalBrokers, label: "وسيط معتمد", color: "#10b981" },
              { icon: FaChartLine, value: stats.totalTransactions.toLocaleString(), label: "صفقة مكتملة", color: "#f59e0b" },
              { icon: FaTrophy, value: `${stats.successRate}%`, label: "معدل النجاح", color: "#8b5cf6" },
              { icon: FaStar, value: stats.averageRating, label: "متوسط التقييم", color: "#ef4444" },
              { icon: FaGlobe, value: stats.totalCountries, label: "دولة", color: "#06b6d4" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                className="stat-card"
                initial={{opacity:0, scale:0.8}} 
                animate={{opacity:1, scale:1}} 
                transition={{duration:0.5, delay:0.6 + idx*0.1}}
                whileHover={{scale:1.05, y:-5}}
              >
                <div className="stat-icon" style={{color: stat.color}}>
                  <stat.icon />
                </div>
                <div className="stat-value" style={{color: stat.color}}>{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-glow" style={{background: `radial-gradient(circle, ${stat.color}20, transparent)`}}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial={{opacity:0, y:50}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8, delay:0.4}}
      >
        <div className="features-container">
          <motion.div 
            className="features-header"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.6}}
          >
            <h2>لماذا تختار وسيطك؟</h2>
            <p>ميزات متقدمة تجعل من تجربتك معنا الأفضل</p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                className="feature-card"
                initial={{opacity:0, y:30}} 
                animate={{opacity:1, y:0}} 
                transition={{duration:0.6, delay:0.8 + idx*0.1}}
                whileHover={{scale:1.05, y:-10}}
              >
                <div className="feature-icon" style={{color: feature.color}}>
                  <feature.icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-glow" style={{background: `radial-gradient(circle, ${feature.color}15, transparent)`}}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Currency Rates Section */}
      <motion.section 
        className="currency-section"
        initial={{opacity:0, y:50}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8, delay:0.6}}
      >
        <div className="currency-container">
          <motion.div 
            className="currency-header"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.8}}
          >
            <h2>أسعار العملات المباشرة</h2>
            <p>تتبع أسعار العملات المحلية والعالمية</p>
          </motion.div>
          
          <div className="currency-grid">
            {currencies.map((currency, idx) => (
              <motion.div 
                key={idx}
                className="currency-card"
                initial={{opacity:0, x:-30}} 
                animate={{opacity:1, x:0}} 
                transition={{duration:0.5, delay:1.0 + idx*0.05}}
                whileHover={{scale:1.02, y:-2}}
              >
                <div className="currency-icon">
                  <currency.icon />
                </div>
                <div className="currency-info">
                  <h4>{currency.name}</h4>
                  <div className="currency-code">{currency.code}</div>
                </div>
                <div className="currency-rate">
                  <div className="rate-value">{currency.rate}</div>
                  <div className={`rate-change ${currency.change.startsWith('+') ? 'positive' : 'negative'}`}>
                    {currency.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="testimonials-section"
        initial={{opacity:0, y:50}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8, delay:0.8}}
      >
        <div className="testimonials-container">
          <motion.div 
            className="testimonials-header"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:1.0}}
          >
            <h2>آراء عملائنا</h2>
            <p>تجارب حقيقية من مستخدمي منصة وسيطك</p>
          </motion.div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <motion.div 
                key={idx}
                className="testimonial-card"
                initial={{opacity:0, y:30}} 
                animate={{opacity:1, y:0}} 
                transition={{duration:0.6, delay:1.2 + idx*0.2}}
                whileHover={{scale:1.05, y:-5}}
              >
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    <FaUser />
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                  <div className="testimonial-rating">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <FaStar key={i} className="star" />
                    ))}
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>"{testimonial.comment}"</p>
                </div>
                <div className="testimonial-quote">
                  <FaQuoteLeft />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{opacity:0, y:50}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8, delay:1.0}}
      >
        <div className="cta-container">
          <motion.div 
            className="cta-content"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:1.2}}
          >
            <h2>ابدأ رحلتك مع وسيطك اليوم</h2>
            <p>انضم إلى آلاف المستخدمين الذين يثقون بمنصة وسيطك</p>
            <div className="cta-actions">
              <motion.button 
                className="cta-button primary large"
                whileHover={{scale:1.05}}
                whileTap={{scale:0.95}}
                onClick={() => window.location.href = '/broker-request'}
                style={{
                  background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '20px 50px',
                  color: 'white',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 10px 30px rgba(18, 140, 126, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #0d6b5f 0%, #128c7e 100%)'
                  e.target.style.boxShadow = '0 15px 40px rgba(18, 140, 126, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)'
                  e.target.style.boxShadow = '0 10px 30px rgba(18, 140, 126, 0.4)'
                }}
              >
                <FaRocket />
                ابدأ الآن
              </motion.button>
              <motion.button 
                className="cta-button secondary large"
                whileHover={{scale:1.05}}
                whileTap={{scale:0.95}}
                onClick={() => window.location.href = '/contact'}
              >
                <FaComments />
                تواصل معنا
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="cta-visual"
            initial={{opacity:0, scale:0.8}} 
            animate={{opacity:1, scale:1}} 
            transition={{duration:0.8, delay:1.4}}
          >
            <div className="cta-graphic">
              <div className="floating-icons">
                <FaShieldAlt className="icon-1" />
                <FaUsers className="icon-2" />
                <FaTrophy className="icon-3" />
                <FaChartLine className="icon-4" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}