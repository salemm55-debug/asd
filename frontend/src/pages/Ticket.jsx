import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  FaTicketAlt, FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaClock, FaCheckCircle, FaTimes, FaSpinner, FaCalendarAlt,
  FaMoneyBillWave, FaList, FaExclamationTriangle, FaStar,
  FaShieldAlt, FaArrowRight, FaHome, FaCopy, FaShare
} from 'react-icons/fa'
import { trackAnalytics } from '../utils/analytics'

export default function Ticket() {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copying, setCopying] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  
  // استخراج رقم التذكرة من URL
  const searchParams = new URLSearchParams(location.search)
  const ticketId = searchParams.get('id')

  useEffect(() => {
    if (!ticketId) {
      navigate('/ticket-not-found')
      return
    }

    // تتبع عرض التذكرة
    trackAnalytics('ticket_view', {
      ticketId: ticketId,
      timestamp: new Date().toISOString()
    })

    fetchTicketDetails()
  }, [ticketId])

  const fetchTicketDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/broker-requests/ticket/${ticketId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          navigate('/ticket-not-found')
          return
        }
        throw new Error('فشل في جلب تفاصيل التذكرة')
      }
      
      const data = await response.json()
      setTicket(data)
    } catch (err) {
      console.error('خطأ في جلب التذكرة:', err)
      setError(err.message || 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  const copyTicketNumber = async () => {
    if (!ticket) return
    
    try {
      setCopying(true)
      await navigator.clipboard.writeText(ticket.ticketNumber)
      
      // إظهار رسالة نجاح
      const notification = document.createElement('div')
      notification.textContent = 'تم نسخ رقم التذكرة!'
      notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: #10b981; color: white; padding: 12px 20px;
        border-radius: 8px; font-size: 14px; font-weight: 500;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        animation: slideInRight 0.3s ease-out;
      `
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in'
        setTimeout(() => document.body.removeChild(notification), 300)
      }, 2000)
      
      trackAnalytics('ticket_copy', { ticketNumber: ticket.ticketNumber })
    } catch (err) {
      console.error('فشل في نسخ رقم التذكرة:', err)
    } finally {
      setCopying(false)
    }
  }

  const shareTicket = async () => {
    if (!ticket) return
    
    const shareData = {
      title: `تذكرة واسطك - ${ticket.ticketNumber}`,
      text: `عرض تفاصيل الطلب: ${ticket.title}`,
      url: window.location.href
    }
    
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        // إظهار رسالة نجاح
        const notification = document.createElement('div')
        notification.textContent = 'تم نسخ رابط التذكرة!'
        notification.style.cssText = `
          position: fixed; top: 20px; right: 20px; z-index: 1000;
          background: #3b82f6; color: white; padding: 12px 20px;
          border-radius: 8px; font-size: 14px; font-weight: 500;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        `
        document.body.appendChild(notification)
        setTimeout(() => document.body.removeChild(notification), 2000)
      }
      
      trackAnalytics('ticket_share', { ticketNumber: ticket.ticketNumber })
    } catch (err) {
      console.error('فشل في مشاركة التذكرة:', err)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#f59e0b',
      'assigned': '#3b82f6', 
      'in_progress': '#8b5cf6',
      'completed': '#10b981',
      'cancelled': '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  const getStatusIcon = (status) => {
    const icons = {
      'pending': FaClock,
      'assigned': FaUser,
      'in_progress': FaSpinner,
      'completed': FaCheckCircle,
      'cancelled': FaTimes
    }
    const Icon = icons[status] || FaExclamationTriangle
    return <Icon />
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  if (loading) {
    return (
      <div className="ticket-container">
        <motion.div 
          className="loading-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}
        >
          <div style={{
            fontSize: '3rem',
            color: '#128c7e',
            marginBottom: '1rem',
            animation: 'spin 2s linear infinite'
          }}>
            <FaSpinner />
          </div>
          <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>جاري تحميل التذكرة...</h2>
          <p style={{ color: '#6b7280' }}>يرجى الانتظار قليلاً</p>
        </motion.div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="ticket-container">
        <motion.div 
          className="error-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}
        >
          <div style={{
            fontSize: '4rem',
            color: '#ef4444',
            marginBottom: '1rem'
          }}>
            <FaExclamationTriangle />
          </div>
          <h2 style={{ color: '#1f2937', marginBottom: '0.5rem' }}>خطأ في تحميل التذكرة</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>{error}</p>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 25px rgba(18, 140, 126, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            <FaHome /> العودة للرئيسية
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="ticket-container" style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '20px',
      direction: 'rtl'
    }}>
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        .ticket-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin-bottom: 20px;
          border: 1px solid #e5e7eb;
        }
        
        .ticket-header {
          background: linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%);
          color: white;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        
        .ticket-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          50% { transform: translate(-50%, -50%) rotate(180deg); }
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          padding: 24px;
        }
        
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
          border-right: 4px solid #128c7e;
        }
        
        .info-icon {
          color: #128c7e;
          font-size: 1.2rem;
          margin-top: 2px;
          flex-shrink: 0;
        }
        
        .info-content h4 {
          margin: 0 0 4px 0;
          color: #374151;
          font-size: 14px;
          font-weight: 600;
        }
        
        .info-content p {
          margin: 0;
          color: #1f2937;
          font-size: 16px;
          line-height: 1.5;
        }
        
        .broker-card {
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border: 2px solid #d1d5db;
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }
        
        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 24px;
          flex-wrap: wrap;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }
        
        .btn-secondary {
          background: white;
          color: #374151;
          border: 2px solid #d1d5db;
        }
        
        .btn-copy {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }
        
        @media (max-width: 768px) {
          .ticket-container {
            padding: 16px;
          }
          
          .ticket-header {
            padding: 20px;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
            padding: 20px;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .action-btn {
            justify-content: center;
          }
        }
      `}</style>

      {/* العنوان الرئيسي */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '2rem' }}
      >
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#1f2937', 
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <FaTicketAlt style={{ color: '#128c7e' }} />
          تفاصيل التذكرة
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          يمكنك هنا متابعة حالة طلبك ومعرفة آخر التحديثات
        </p>
      </motion.div>

      {/* بطاقة التذكرة الرئيسية */}
      <motion.div 
        className="ticket-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* رأس التذكرة */}
        <div className="ticket-header">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.8rem' }}>
                {ticket.title}
              </h2>
              <p style={{ 
                margin: '0 0 12px 0', 
                opacity: 0.9,
                fontSize: '1.1rem'
              }}>
                رقم التذكرة: {ticket.ticketNumber}
              </p>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(ticket.status) }}
              >
                {getStatusIcon(ticket.status)}
                {ticket.statusText}
              </div>
            </div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '12px', 
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', opacity: 0.8 }}>
                التصنيف
              </p>
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
                {ticket.categoryText}
              </p>
            </div>
          </div>
        </div>

        {/* محتوى التذكرة */}
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">
              <FaList />
            </div>
            <div className="info-content">
              <h4>وصف الطلب</h4>
              <p>{ticket.description}</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaMoneyBillWave />
            </div>
            <div className="info-content">
              <h4>السعر المتوقع</h4>
              <p>{formatPrice(ticket.price)}</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="info-content">
              <h4>الموقع</h4>
              <p>{ticket.location}</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaPhone />
            </div>
            <div className="info-content">
              <h4>معلومات التواصل</h4>
              <p>{ticket.contactInfo}</p>
            </div>
          </div>

          <div className="info-item">
            <div className="info-icon">
              <FaCalendarAlt />
            </div>
            <div className="info-content">
              <h4>تاريخ الإنشاء</h4>
              <p>{formatDate(ticket.createdAt)}</p>
            </div>
          </div>

          {ticket.deadline && (
            <div className="info-item">
              <div className="info-icon">
                <FaClock />
              </div>
              <div className="info-content">
                <h4>الموعد النهائي</h4>
                <p>{formatDate(ticket.deadline)}</p>
              </div>
            </div>
          )}

          {ticket.requirements && (
            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <div className="info-icon">
                <FaShieldAlt />
              </div>
              <div className="info-content">
                <h4>المتطلبات الإضافية</h4>
                <p>{ticket.requirements}</p>
              </div>
            </div>
          )}
        </div>

        {/* معلومات الوسيط */}
        {ticket.broker && (
          <motion.div 
            className="broker-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ margin: '24px' }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: ticket.broker.avatarUrl ? `url(${ticket.broker.avatarUrl})` : 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                border: '3px solid white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}>
                {!ticket.broker.avatarUrl && <FaUser />}
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: '#1f2937' }}>
                  الوسيط المُعين: {ticket.broker.name}
                </h3>
                <p style={{ margin: '0 0 8px 0', color: '#6b7280' }}>
                  {ticket.broker.title}
                </p>
                {ticket.broker.rating && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: '#f59e0b'
                  }}>
                    <FaStar />
                    <span style={{ color: '#1f2937', fontWeight: '600' }}>
                      {ticket.broker.rating} ({ticket.broker.reviewsCount} تقييم)
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '12px',
              fontSize: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaPhone style={{ color: '#128c7e' }} />
                <span>{ticket.broker.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaEnvelope style={{ color: '#128c7e' }} />
                <span>{ticket.broker.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaClock style={{ color: '#128c7e' }} />
                <span>يرد خلال: {ticket.broker.responseTime}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* أزرار الإجراءات */}
        <motion.div 
          className="action-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button
            className="action-btn btn-copy"
            onClick={copyTicketNumber}
            disabled={copying}
          >
            <FaCopy />
            {copying ? 'جاري النسخ...' : 'نسخ رقم التذكرة'}
          </button>
          
          <button
            className="action-btn btn-primary"
            onClick={shareTicket}
          >
            <FaShare />
            مشاركة التذكرة
          </button>
          
          <button
            className="action-btn btn-secondary"
            onClick={() => navigate('/')}
          >
            <FaHome />
            العودة للرئيسية
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}