import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaClock, FaFileAlt, FaPlus } from 'react-icons/fa'

export default function Compensation() {
  const [compensations, setCompensations] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    ticket_id: ''
  })
  const [loading, setLoading] = useState(false)
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (userId) {
      loadCompensations()
    }
  }, [userId])

  const loadCompensations = async () => {
    try {
      const response = await fetch(`/api/compensations/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setCompensations(data)
      }
    } catch (error) {
      console.error('خطأ في جلب طلبات التعويض:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || !formData.reason) return

    setLoading(true)
    try {
      const response = await fetch('/api/compensations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          ticket_id: formData.ticket_id || null,
          amount: parseFloat(formData.amount),
          reason: formData.reason
        })
      })

      if (response.ok) {
        alert('تم تقديم طلب التعويض بنجاح')
        setFormData({ amount: '', reason: '', ticket_id: '' })
        setShowForm(false)
        loadCompensations()
      } else {
        alert('خطأ في تقديم طلب التعويض')
      }
    } catch (error) {
      console.error('خطأ في تقديم طلب التعويض:', error)
      alert('خطأ في تقديم طلب التعويض')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheckCircle className="status-icon approved" />
      case 'rejected': return <FaTimesCircle className="status-icon rejected" />
      case 'paid': return <FaMoneyBillWave className="status-icon paid" />
      default: return <FaClock className="status-icon pending" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      case 'paid': return 'تم الدفع'
      default: return 'قيد المراجعة'
    }
  }

  return (
    <div className="compensation-container">
      <motion.section 
        className="compensation-header"
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <div className="header-content">
          <div className="header-icon">
            <FaMoneyBillWave />
          </div>
          <h1>نظام التعويض</h1>
          <p>تقديم طلبات التعويض ومتابعة حالتها</p>
        </div>
        
        <button 
          className="new-compensation-btn"
          onClick={() => setShowForm(true)}
        >
          <div className="btn-content">
            <FaPlus className="btn-icon" />
            <span className="btn-text">طلب تعويض جديد</span>
            <div className="btn-glow"></div>
          </div>
        </button>
      </motion.section>

      {/* Compensation Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            className="modal-overlay"
            initial={{opacity:0}} 
            animate={{opacity:1}} 
            exit={{opacity:0}}
            onClick={() => setShowForm(false)}
          >
            <motion.div 
              className="modal-content compensation-form"
              initial={{scale:0.8, opacity:0}} 
              animate={{scale:1, opacity:1}} 
              exit={{scale:0.8, opacity:0}}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>طلب تعويض جديد</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label>مبلغ التعويض (ريال سعودي)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="أدخل المبلغ"
                    required
                    min="1"
                    step="0.01"
                  />
                </div>
                
                <div className="form-group">
                  <label>رقم التذكرة</label>
                  <input
                    type="text"
                    value={formData.ticket_id}
                    onChange={(e) => setFormData({...formData, ticket_id: e.target.value})}
                    placeholder="رقم التذكرة المرتبطة"
                  />
                </div>
                
                <div className="form-group">
                  <label>سبب التعويض</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    placeholder="اشرح سبب طلب التعويض..."
                    rows="4"
                    required
                  />
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowForm(false)}
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit"
                    className="submit-btn"
                    disabled={loading || !formData.amount || !formData.reason}
                  >
                    {loading ? 'جاري الإرسال...' : 'تقديم الطلب'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compensations List */}
      <motion.section 
        className="compensations-list"
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration:0.8, delay:0.2}}
      >
        <h2>طلبات التعويض</h2>
        
        {compensations.length === 0 ? (
          <div className="empty-state">
            <FaFileAlt className="empty-icon" />
            <p>لا توجد طلبات تعويض</p>
          </div>
        ) : (
          <div className="compensations-grid">
            {compensations.map((compensation) => (
              <motion.div 
                key={compensation.id}
                className="compensation-card"
                initial={{opacity:0, y:20}} 
                animate={{opacity:1, y:0}} 
                transition={{duration:0.5}}
                whileHover={{y:-5}}
              >
                <div className="card-header">
                  <div className="compensation-id">
                    <FaFileAlt className="id-icon" />
                    <span>{compensation.id}</span>
                  </div>
                  <div className="status-badge">
                    {getStatusIcon(compensation.status)}
                    <span>{getStatusText(compensation.status)}</span>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="amount-section">
                    <span className="amount-label">المبلغ:</span>
                    <span className="amount-value">{compensation.amount} ريال</span>
                  </div>
                  
                  <div className="reason-section">
                    <span className="reason-label">السبب:</span>
                    <p className="reason-text">{compensation.reason}</p>
                  </div>
                  
                  {compensation.ticket_id && (
                    <div className="ticket-section">
                      <span className="ticket-label">رقم التذكرة:</span>
                      <span className="ticket-value">{compensation.ticket_id}</span>
                    </div>
                  )}
                  
                  {compensation.admin_notes && (
                    <div className="notes-section">
                      <span className="notes-label">ملاحظات الإدارة:</span>
                      <p className="notes-text">{compensation.admin_notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="card-footer">
                  <div className="date-info">
                    <span>تاريخ الطلب: {new Date(compensation.created_at).toLocaleDateString('ar-SA')}</span>
                    {compensation.approved_at && (
                      <span>تاريخ الموافقة: {new Date(compensation.approved_at).toLocaleDateString('ar-SA')}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  )
}
