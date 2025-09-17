const data = [
  { 
    name: 'فاطمة العبدالله', 
    location: 'الرياض', 
    role: 'متجر إلكتروني', 
    rating: 5,
    text: 'منصة وسيطك رفعت مصداقيتنا أمام العملاء. التحويل يتم خلال دقائق بعد الإتمام. الخدمة سريعة وآمنة جداً.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-03-15'
  },
  { 
    name: 'عبدالله الشمري', 
    location: 'حائل', 
    role: 'وسيط عقاري', 
    rating: 5,
    text: 'توثيق العقود والدفع المضمون سهلوا علي التعامل مع ملاك ومستأجرين. أصبحت أكثر ثقة في الصفقات.',
    avatar: '👤',
    verified: true,
    joinDate: '2022-11-08'
  },
  { 
    name: 'نورة المطيري', 
    location: 'جدة', 
    role: 'بائعة أعمال حرة', 
    rating: 5,
    text: 'أصبحت أقبل مشاريع أكبر لأن الدفع عبر وسيطك يحميني ويحمي العميل. تجربة رائعة حقاً.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-07-22'
  },
  { 
    name: 'سلمان الدوسري', 
    location: 'الدمام', 
    role: 'مستورد', 
    rating: 5,
    text: 'الضمان المالي خفض المخاطر في الطلبيات الدولية. خدمة دعم راقية ومتاحة 24/7.',
    avatar: '👤',
    verified: true,
    joinDate: '2022-05-12'
  },
  { 
    name: 'ليلى القحطاني', 
    location: 'أبها', 
    role: 'مصممة', 
    rating: 5,
    text: 'تجربة مستخدم ممتازة وسرعة في حل أي إشكال. أوصي بها للجميع. الدعم الفني ممتاز.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-01-18'
  },
  { 
    name: 'شركة المدار', 
    location: 'الرياض', 
    role: 'شركة تقنية', 
    rating: 5,
    text: 'تكامل سهل وإشعارات آنية. أشبه بمنصات عالمية لكن بخدمة محلية. فريق العمل محترف جداً.',
    avatar: '👤',
    verified: true,
    joinDate: '2022-02-03'
  },
  { 
    name: 'محمد العتيبي', 
    location: 'الرياض', 
    role: 'مستثمر عقاري', 
    rating: 5,
    text: 'منصة وسيطك غيرت حياتي المهنية. الوسطاء المعتمدون والخدمة المتميزة جعلت من كل صفقة تجربة ناجحة.',
    avatar: '👤',
    verified: true,
    joinDate: '2022-08-14'
  },
  { 
    name: 'هند السعيد', 
    location: 'الخبر', 
    role: 'رائدة أعمال', 
    rating: 5,
    text: 'الأمان والثقة هما ما يميز وسيطك. أشعر بالراحة التامة عند التعامل مع الوسطاء المعتمدين.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-04-09'
  },
  { 
    name: 'خالد القحطاني', 
    location: 'الطائف', 
    role: 'تاجر', 
    rating: 5,
    text: 'السرعة والدقة في التنفيذ مذهلة. أنصح الجميع بتجربة منصة وسيطك. خدمة لا مثيل لها.',
    avatar: '👤',
    verified: true,
    joinDate: '2022-12-01'
  },
  { 
    name: 'أحمد الزهراني', 
    location: 'مكة المكرمة', 
    role: 'مطور برمجيات', 
    rating: 5,
    text: 'منصة وسيطك ساعدتني في بيع خدماتي البرمجية بثقة. العملاء يثقون في النظام والضمانات.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-06-15'
  },
  { 
    name: 'مريم الشهري', 
    location: 'الرياض', 
    role: 'مصممة أزياء', 
    rating: 5,
    text: 'أبيع تصاميمي عبر وسيطك وأشعر بالأمان التام. العملاء يدفعون والمال يصلني فوراً.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-09-03'
  },
  { 
    name: 'عبدالرحمن الغامدي', 
    location: 'الدمام', 
    role: 'تاجر سيارات', 
    rating: 5,
    text: 'بعت أكثر من 50 سيارة عبر وسيطك. كل صفقة تتم بسلاسة وأمان. أنصح كل تاجر بالاستخدام.',
    avatar: '👤',
    verified: true,
    joinDate: '2022-07-20'
  },
  { 
    name: 'سارة المطيري', 
    location: 'الخبر', 
    role: 'مستشارة عقارية', 
    rating: 5,
    text: 'وسيطك وفر لي عميلاً موثوقاً لكل صفقة. لا أخاف من النصب أو الاحتيال بعد الآن.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-02-14'
  },
  { 
    name: 'يوسف العتيبي', 
    location: 'الرياض', 
    role: 'مستثمر', 
    rating: 5,
    text: 'استثمرت في عدة مشاريع عبر وسيطك. كل استثمار محمي ومضمون. عائدات ممتازة.',
    avatar: '👤',
    verified: true,
    joinDate: '2022-04-10'
  },
  { 
    name: 'رانيا السعد', 
    location: 'جدة', 
    role: 'مديرة تسويق', 
    rating: 5,
    text: 'شركتنا تستخدم وسيطك لجميع المعاملات. وفر علينا الوقت والجهد. خدمة احترافية.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-01-25'
  },
  { 
    name: 'فهد القحطاني', 
    location: 'الطائف', 
    role: 'مطور تطبيقات', 
    rating: 5,
    text: 'أطور تطبيقات وأبيعها عبر وسيطك. العملاء يثقون في النظام والدفع آمن ومضمون.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-05-08'
  },
  { 
    name: 'لينا الشمري', 
    location: 'الرياض', 
    role: 'مصممة جرافيك', 
    rating: 5,
    text: 'أصمم شعارات ومواد دعائية. وسيطك وفر لي عملاء جدد ودفع آمن لكل مشروع.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-08-12'
  },
  { 
    name: 'عمر المطيري', 
    location: 'الدمام', 
    role: 'تاجر إلكترونيات', 
    rating: 5,
    text: 'أبيع أجهزة إلكترونية عبر وسيطك. كل صفقة تتم بسلاسة والعميل راضي دائماً.',
    avatar: '👤',
    verified: true,
    joinDate: '2022-12-18'
  },
  { 
    name: 'هالة العتيبي', 
    location: 'الخبر', 
    role: 'مستشارة مالية', 
    rating: 5,
    text: 'أقدم استشارات مالية وأستخدم وسيطك لضمان الدفع. العملاء يثقون في الخدمة.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-03-30'
  },
  { 
    name: 'مشعل الدوسري', 
    location: 'الرياض', 
    role: 'مطور ويب', 
    rating: 5,
    text: 'أطور مواقع إلكترونية وأبيع خدماتي عبر وسيطك. كل مشروع محمي ومضمون.',
    avatar: '👤',
    verified: true,
    joinDate: '2023-07-05'
  }
]

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaQuoteLeft, FaThumbsUp, FaCalendarAlt, FaHandshake } from 'react-icons/fa'

export default function Testimonials() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const categories = [
    { id: 'all', name: 'جميع الآراء', count: data.length },
    { id: 'verified', name: 'عملاء موثقون', count: data.filter(t => t.verified).length },
    { id: 'recent', name: 'الأحدث', count: data.filter(t => new Date(t.joinDate) > new Date('2023-01-01')).length }
  ]

  const filteredData = data.filter(item => {
    if (selectedCategory === 'verified') return item.verified
    if (selectedCategory === 'recent') return new Date(item.joinDate) > new Date('2023-01-01')
    return true
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.joinDate) - new Date(a.joinDate)
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div className="testimonials-page">
      <motion.section 
        className="testimonials-hero"
        initial={{opacity:0, y:50}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.8}}
      >
        <div className="hero-content">
          <motion.h1
            initial={{opacity:0, y:30}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.8, delay:0.2}}
            className="hero-title"
          >
            آراء عملائنا
          </motion.h1>
          <motion.p
            initial={{opacity:0, y:20}}
            animate={{opacity:1, y:0}}
            transition={{duration:0.8, delay:0.4}}
            className="hero-subtitle"
          >
            تجارب حقيقية من آلاف المستخدمين الذين يثقون بمنصة وسيطك
          </motion.p>
          
        </div>
      </motion.section>


      <motion.section 
        className="testimonials-grid-section"
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{duration:0.8, delay:0.5}}
      >
        
        <div className="testimonials-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {sortedData.slice(0, 12).map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="testimonial-card"
              initial={{opacity:0, y:50, scale:0.9}}
              animate={{opacity:1, y:0, scale:1}}
              transition={{
                duration:0.6,
                delay:index * 0.1,
                ease:[0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{scale:1.05, y:-10}}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div className="testimonial-header">
                <div className="user-info">
                  <div className="avatar">
                    <span className="avatar-emoji">{testimonial.avatar}</span>
                    {testimonial.verified && (
                      <FaCheckCircle className="verified-badge" />
                    )}
                  </div>
                  <div className="user-details">
                    <h3 className="user-name">{testimonial.name}</h3>
                    <div className="user-meta">
                      <span className="user-role">{testimonial.role}</span>
                      <span className="user-location">
                        <FaMapMarkerAlt />
                        {testimonial.location}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="rating">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <FaStar key={i} className="star" />
                  ))}
                </div>
              </div>

              <div className="testimonial-content">
                <FaQuoteLeft className="quote-icon" />
                <blockquote className="testimonial-text">
                  "{testimonial.text}"
                </blockquote>
              </div>

              <div className="testimonial-footer">
                <div className="join-info">
                  <span className="join-date">
                    <FaCalendarAlt />
                    انضم في {new Date(testimonial.joinDate).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                
                <div className="testimonial-actions">
                  <button className="action-btn">
                    <FaThumbsUp />
                  </button>
                  <button className="action-btn">
                    مشاركة
                  </button>
                </div>
              </div>

              <div className="testimonial-glow"></div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section 
        className="testimonials-cta"
        initial={{opacity:0, y:50}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.8, delay:0.8}}
      >
        <div className="cta-content">
          <h2>انضم إلى آلاف العملاء الراضين</h2>
          <p>ابدأ رحلتك مع وسيطك اليوم واستمتع بتجربة آمنة وموثوقة</p>
          <motion.button 
            className="cta-button"
            whileHover={{scale:1.05}}
            whileTap={{scale:0.95}}
          >
            ابدأ الآن مجاناً
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}


