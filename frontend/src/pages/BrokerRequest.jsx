import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useSessionData } from '../hooks/useDatabase'
import { 
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHandshake, FaClock, 
  FaShieldAlt, FaCheckCircle, FaPlus, FaTicketAlt, FaComments, 
  FaRocket, FaStar, FaGem, FaCrown, FaHeart, FaMagic, FaFire,
  FaBolt, FaGlobe, FaTrophy, FaMedal, FaAward, FaUsers
} from 'react-icons/fa'
import { trackBrokerRequest } from '../utils/analytics'
import smartCache from '../utils/smartCache'

export default function BrokerRequest() {
  const [showForm, setShowForm] = useState(false)
  const [userId] = useState(() => {
    // Generate or get existing user ID
    let id = localStorage.getItem('userId')
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('userId', id)
    }
    return id
  })
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    location: '',
    contactInfo: '',
    requirements: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sanitizeInput = (value) => {
    // Remove potentially harmful characters
    return value
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      // نحافظ على المسافات كما هي ولا نقوم بتقليصها
  }

  const validateInput = (name, value) => {
    switch (name) {
      case 'title':
        return value.length >= 3 && value.length <= 100
      case 'description':
        return value.length >= 10 && value.length <= 500
      case 'price':
        const price = parseFloat(value)
        return !isNaN(price) && price > 0 && price <= 10000000
      case 'location':
        return value.length >= 2 && value.length <= 50
      case 'contactInfo':
        const phoneRegex = /^(\+966|0)?[5-9][0-9]{8}$/
        return phoneRegex.test(value.replace(/\s/g, ''))
      case 'requirements':
        return value.length <= 1000
      case 'category':
        return value && value.length > 0
      default:
        return true
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const sanitizedValue = sanitizeInput(value)
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }))
    
    // Validate input
    if (!validateInput(name, sanitizedValue)) {
      setErrors(prev => ({ 
        ...prev, 
        [name]: getErrorMessage(name, sanitizedValue) 
      }))
    }
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    })
  }

  const getErrorMessage = (name, value) => {
    switch (name) {
      case 'title':
        if (value.length < 3) return 'العنوان يجب أن يكون 3 أحرف على الأقل'
        if (value.length > 100) return 'العنوان يجب أن يكون أقل من 100 حرف'
        break
      case 'description':
        if (value.length < 10) return 'الوصف يجب أن يكون 10 أحرف على الأقل'
        if (value.length > 500) return 'الوصف يجب أن يكون أقل من 500 حرف'
        break
      case 'price':
        const price = parseFloat(value)
        if (isNaN(price)) return 'يرجى إدخال سعر صحيح'
        if (price <= 0) return 'السعر يجب أن يكون أكبر من صفر'
        if (price > 10000000) return 'السعر كبير جداً'
        break
      case 'location':
        if (value.length < 2) return 'الموقع يجب أن يكون حرفين على الأقل'
        if (value.length > 50) return 'الموقع يجب أن يكون أقل من 50 حرف'
        break
      case 'contactInfo':
        const phoneRegex = /^(\+966|0)?[5-9][0-9]{8}$/
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'يرجى إدخال رقم هاتف صحيح'
        break
      case 'requirements':
        if (value.length > 1000) return 'المتطلبات يجب أن تكون أقل من 1000 حرف'
        break
      case 'category':
        if (!value || value.length === 0) return 'يرجى اختيار نوع الصفقة'
        break
      default:
        return ''
    }
    return ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      if (!validateInput(key, formData[key])) {
        newErrors[key] = getErrorMessage(key, formData[key])
      }
    })
    
    // Check for required fields
    if (!formData.category) newErrors.category = 'يرجى اختيار نوع الصفقة'
    
    setErrors(newErrors)
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return
    }
    
    // Force buyer role for creating mediation request

    setIsSubmitting(true)
    
    try {
      const requestData = {
        buyer_id: userId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        location: formData.location,
        contact_info: formData.contactInfo,
        requirements: formData.requirements
      }

      // Track broker request analytics
      try { trackBrokerRequest(requestData) } catch {}
      
      // Cache form data for potential retry
      smartCache.set(`broker_request_${userId}`, requestData, {
        tags: ['broker_request', 'form_data'],
        ttl: 30 * 60 * 1000 // 30 minutes
      })

      const response = await fetch('/api/mediation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })
      
      if (response.ok) {
        const created = await response.json()
        const requestId = created?.id
        if (!requestId) {
          throw new Error('لم يتم استرجاع معرف طلب الوساطة')
        }
        // الانتقال إلى صفحة الشات باستخدام request (سيختار الدور ويُسجل من هناك)
        window.location.href = `/chat?request=${requestId}`
      }
      
      setFormData({
        title: '',
        description: '',
        category: '',
        price: '',
        location: '',
        contactInfo: '',
        requirements: ''
      })
      setErrors({})
      setShowForm(false)
    } catch (error) {
      console.error('خطأ في حفظ الطلب:', error)
      alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="broker-request-container">
      {/* Header Section */}
      <motion.section 
        className="request-header"
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <div className="header-content">
          <div className="header-main">
            <div className="header-icon">
              <FaRocket className="main-icon" />
              <div className="icon-glow"></div>
            </div>
            <h1>طلب وسيط</h1>
            <p>اطلب وسيطاً موثوقاً لضمان صفقتك - تجربة بسيطة وسريعة</p>
            
          </div>
          
          <div className="request-cta">
            <button 
              className="enhanced-request-btn"
              onClick={() => setShowForm(true)}
              style={{
                background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
                border: '1px solid #0d6b5f',
                color: '#ffffff',
                borderRadius: '14px',
                padding: '14px 28px',
                boxShadow: '0 8px 25px rgba(18, 140, 126, 0.25)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(18, 140, 126, 0.35)';
                e.currentTarget.style.filter = 'brightness(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(18, 140, 126, 0.25)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              <div className="btn-content">
                <div className="btn-icon-container">
                  <FaRocket className="btn-icon" />
                  <div className="icon-pulse"></div>
                </div>
                <span className="btn-text">طلب وسيط الآن</span>
                <div className="btn-glow"></div>
                <div className="btn-shine"></div>
              </div>
            </button>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section 
        className="how-it-works"
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8, delay:0.2}}
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '40px 20px'
        }}
      >
        <div className="section-header" style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>كيف يعمل النظام؟</h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto'
          }}>خطوات بسيطة لطلب وسيط والحصول على أفضل خدمة</p>
        </div>
        
        <div className="steps-grid" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          maxWidth: '700px',
          margin: '0 auto'
        }}>
          <motion.div 
            className="step-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.5, delay:0.1}}
            style={{
              background: 'white',
              padding: '24px 16px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="step-icon" style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: 'white',
              fontSize: '24px',
              boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)'
            }}>
              <FaPlus />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>1. املأ النموذج</h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>أدخل تفاصيل طلبك واختر التخصص المناسب</p>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>1</div>
          </motion.div>
          
          <motion.div 
            className="step-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.5, delay:0.2}}
            style={{
              background: 'white',
              padding: '24px 16px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="step-icon" style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'white',
              fontSize: '32px',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
            }}>
              <FaTicketAlt />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>2. إنشاء تذكرة</h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>سيتم إنشاء تذكرة تلقائياً لطلبك</p>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>2</div>
          </motion.div>
          
          <motion.div 
            className="step-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.5, delay:0.3}}
            style={{
              background: 'white',
              padding: '24px 16px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="step-icon" style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'white',
              fontSize: '32px',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
            }}>
              <FaUsers />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>3. اختيار الوسيط</h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>نقوم باختيار أفضل وسيط متخصص لطلبك</p>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>3</div>
          </motion.div>
          
          <motion.div 
            className="step-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.5, delay:0.4}}
            style={{
              background: 'white',
              padding: '24px 16px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="step-icon" style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'white',
              fontSize: '32px',
              boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
            }}>
              <FaComments />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>4. الشات الحيوي</h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>تواصل مباشر مع الوسيط عبر الشات المتقدم</p>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>4</div>
          </motion.div>
          
          <motion.div 
            className="step-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.5, delay:0.5}}
            style={{
              background: 'white',
              padding: '24px 16px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="step-icon" style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'white',
              fontSize: '32px',
              boxShadow: '0 8px 25px rgba(6, 182, 212, 0.3)'
            }}>
              <FaHandshake />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>5. التفاوض والاتفاق</h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>التفاوض على الشروط والاتفاق على التفاصيل</p>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>5</div>
          </motion.div>
          
          <motion.div 
            className="step-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.5, delay:0.6}}
            style={{
              background: 'white',
              padding: '24px 16px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="step-icon" style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'white',
              fontSize: '32px',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
            }}>
              <FaCheckCircle />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>6. إتمام الصفقة</h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>ضمان كامل وإتمام الصفقة بأمان</p>
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>6</div>
          </motion.div>
        </div>
      </motion.section>

      {/* Request Form */}
      {showForm && (
        <motion.div 
          className="form-overlay"
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          transition={{duration:0.3}}
        >
          <motion.div 
            className="form-modal"
            initial={{opacity:0, scale:0.9}} 
            animate={{opacity:1, scale:1}} 
            transition={{duration:0.3}}
          >
            <div className="form-header">
              <h3>طلب وسيط</h3>
              <button 
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="request-form">
              

              <div className="form-group">
                <label>نوع الصفقة *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={{
                    border: errors.category ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px',
                    width: '100%',
                    fontSize: '16px'
                  }}
                >
                  <option value="">اختر نوع الصفقة</option>
                  <option value="real-estate">عقارات</option>
                  <option value="vehicles">مركبات</option>
                  <option value="electronics">إلكترونيات</option>
                  <option value="accounts">حسابات</option>
                  <option value="gaming">قيمنق</option>
                  <option value="social">حسابات تواصل</option>
                  <option value="digital-goods">منتجات رقمية</option>
                  <option value="services">خدمات</option>
                  <option value="general">أخرى</option>
                </select>
                {errors.category && (
                  <div style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>
                    {errors.category}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>وصف مختصر للصفقة *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="مثال: بيع سيارة تويوتا 2020"
                  style={{
                    border: errors.title ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px',
                    width: '100%',
                    fontSize: '16px'
                  }}
                />
                {errors.title && (
                  <div style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>
                    {errors.title}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>وصف تفصيلي للصفقة *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="اكتب وصفاً مفصلاً للصفقة..."
                  rows="4"
                  style={{
                    border: errors.description ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px',
                    width: '100%',
                    fontSize: '16px',
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                />
                {errors.description && (
                  <div style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>
                    {errors.description}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>القيمة المتوقعة (ريال) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="مثال: 50000"
                  min="1"
                  max="10000000"
                  style={{
                    border: errors.price ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px',
                    width: '100%',
                    fontSize: '16px'
                  }}
                />
                {errors.price && (
                  <div style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>
                    {errors.price}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>المدينة *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="مثال: الرياض"
                  style={{
                    border: errors.location ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px',
                    width: '100%',
                    fontSize: '16px'
                  }}
                />
                {errors.location && (
                  <div style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>
                    {errors.location}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>رقم الهاتف *</label>
                <input
                  type="tel"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                  placeholder="مثال: 0501234567"
                  style={{
                    border: errors.contactInfo ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '12px',
                    width: '100%',
                    fontSize: '16px'
                  }}
                />
                {errors.contactInfo && (
                  <div style={{color: '#ef4444', fontSize: '14px', marginTop: '4px'}}>
                    {errors.contactInfo}
                  </div>
                )}
              </div>

              <div className="form-actions" style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'flex-end',
                marginTop: '24px',
                flexWrap: 'wrap'
              }}>
                <motion.button 
                  type="submit" 
                  className="enhanced-submit-btn"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? {scale: 1.05, y: -2} : {}}
                  whileTap={!isSubmitting ? {scale: 0.95} : {}}
                  style={{
                    background: isSubmitting 
                      ? '#9ca3af' 
                      : 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: isSubmitting 
                      ? 'none' 
                      : '0 8px 25px rgba(18, 140, 126, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    minWidth: '160px',
                    justifyContent: 'center'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{rotate: 360}}
                        transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                        style={{fontSize: '18px'}}
                      >
                        ⏳
                      </motion.div>
                      <span>جاري الإرسال...</span>
                    </>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{rotate: 15}}
                        transition={{duration: 0.2}}
                        style={{fontSize: '18px'}}
                      >
                        <FaRocket />
                      </motion.div>
                      <span>إرسال الطلب</span>
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.5s'
                      }}></div>
                    </>
                  )}
                </motion.button>
                
                <motion.button 
                  type="button" 
                  className="enhanced-cancel-btn" 
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? {scale: 1.05, y: -2} : {}}
                  whileTap={!isSubmitting ? {scale: 0.95} : {}}
                  style={{
                    background: 'transparent',
                    color: '#6b7280',
                    border: '2px solid #d1d5db',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '120px',
                    justifyContent: 'center',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  إلغاء
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial={{opacity:0}} 
        whileInView={{opacity:1}} 
        viewport={{once:true}}
        transition={{duration:0.8}}
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '80px 20px'
        }}
      >
        <div className="section-header" style={{textAlign: 'center', marginBottom: '60px'}}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>لماذا تختار وسيطك؟</h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto'
          }}>منصة رائدة في مجال الوساطة مع ضمانات كاملة</p>
        </div>
        
        <div className="features-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '32px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <motion.div 
            className="feature-card"
            initial={{opacity:0, y:20}} 
            whileInView={{opacity:1, y:0}} 
            viewport={{once:true}}
            transition={{duration:0.5, delay:0.1}}
            style={{
              background: 'white',
              padding: '32px 24px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="feature-icon" style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'white',
              fontSize: '32px'
            }}>
              <FaShieldAlt />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>حماية كاملة</h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>ضمان 100% لحماية أموالك وصفقاتك مع تأمين شامل</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            initial={{opacity:0, y:20}} 
            whileInView={{opacity:1, y:0}} 
            viewport={{once:true}}
            transition={{duration:0.5, delay:0.2}}
            style={{
              background: 'white',
              padding: '32px 24px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="feature-icon" style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'white',
              fontSize: '32px'
            }}>
              <FaHandshake />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>وسطاء معتمدون</h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>شبكة واسعة من الوسطاء الموثوقين والمعتمدين</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            initial={{opacity:0, y:20}} 
            whileInView={{opacity:1, y:0}} 
            viewport={{once:true}}
            transition={{duration:0.5, delay:0.3}}
            style={{
              background: 'white',
              padding: '32px 24px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div className="feature-icon" style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'white',
              fontSize: '32px'
            }}>
              <FaClock />
            </div>
            <h3 style={{
              fontSize: '1.3rem',
              fontWeight: '600',
              color: '#1a202c',
              marginBottom: '12px'
            }}>سرعة في التنفيذ</h3>
            <p style={{
              color: '#64748b',
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>معالجة سريعة للطلبات في أقل وقت ممكن</p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{opacity:0}} 
        whileInView={{opacity:1}} 
        viewport={{once:true}}
        transition={{duration:0.8}}
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          padding: '80px 20px',
          textAlign: 'center'
        }}
      >
        <div className="cta-content" style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <div className="cta-icon" style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            color: 'white',
            fontSize: '40px',
            boxShadow: '0 10px 30px rgba(18, 140, 126, 0.3)'
          }}>
            <FaRocket />
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>ابدأ رحلتك مع وسيطك الآن</h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>اطلب وسيطاً موثوقاً وتمتع بأفضل تجربة وساطة</p>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <button 
              className="enhanced-cta-btn"
              onClick={() => setShowForm(true)}
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
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
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
              <FaRocket />
              <span>طلب وسيط الآن</span>
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
