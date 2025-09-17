import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useOptimizedAPI } from '../hooks/useOptimizedAPI'
import { 
  FaTicketAlt, FaSearch, FaSync, FaEye, FaEdit, FaTrash, 
  FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaComments,
  FaFilter, FaSort, FaDownload, FaPlus, FaMinus, FaTimes, 
  FaCheck, FaExclamationTriangle, FaInfoCircle, FaQuestionCircle
} from 'react-icons/fa'

export default function Admin() {
  const [tickets, setTickets] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Use optimized API hooks for tickets
  const { data: ticketsData, loading: ticketsLoading, error: ticketsError, refetch: refetchTickets } = useOptimizedAPI(
    '/api/admin/tickets',
    {
      autoRefresh: true,
      refreshInterval: 15000,
      staleTime: 30000
    }
  )

  // Update tickets when data changes
  useEffect(() => {
    if (ticketsData) {
      setTickets(ticketsData)
    }
  }, [ticketsData])

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(ticket =>
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTicketAction = async (ticketId, action) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        refetchTickets()
        alert(`تم ${action === 'approve' ? 'الموافقة على' : 'رفض'} التذكرة بنجاح`)
      } else {
        alert('خطأ في تنفيذ العملية')
      }
    } catch (error) {
      console.error('خطأ في تنفيذ العملية:', error)
      alert('خطأ في تنفيذ العملية')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه التذكرة؟')) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/admin/tickets/${ticketId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          refetchTickets()
          alert('تم حذف التذكرة بنجاح')
        } else {
          alert('خطأ في حذف التذكرة')
        }
      } catch (error) {
        console.error('خطأ في حذف التذكرة:', error)
        alert('خطأ في حذف التذكرة')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="status-icon pending" />
      case 'approved': return <FaCheckCircle className="status-icon approved" />
      case 'rejected': return <FaTimesCircle className="status-icon rejected" />
      default: return <FaQuestionCircle className="status-icon" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'في الانتظار'
      case 'approved': return 'موافق عليه'
      case 'rejected': return 'مرفوض'
      default: return 'غير محدد'
    }
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <motion.header 
        className="admin-header"
        initial={{opacity:0, y:-20}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <div className="header-content">
          <div className="admin-info">
            <div className="admin-avatar">
              <FaTicketAlt className="avatar-icon" />
              <div className="status-indicator online"></div>
            </div>
            <div className="admin-details">
              <h1>إدارة التذاكر</h1>
              <p>نظام إدارة تذاكر الدعم</p>
            </div>
          </div>
          
          <div className="header-controls">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="البحث في التذاكر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="control-buttons">
              <button 
                className="control-btn refresh-btn"
                onClick={() => refetchTickets()}
                title="تحديث التذاكر"
                disabled={isLoading}
              >
                <FaSync className={isLoading ? 'spinning' : ''} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Tickets Content */}
      <motion.section 
        className="tickets-content"
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration:0.5}}
      >
        <div className="content-header">
          <h2>إدارة التذاكر</h2>
          <p>عرض وإدارة جميع تذاكر الدعم</p>
        </div>

        <div className="tickets-grid">
          {ticketsLoading ? (
            <div className="loading-state">
              <FaSync className="spinning" />
              <p>جاري تحميل التذاكر...</p>
            </div>
          ) : ticketsError ? (
            <div className="error-state">
              <FaExclamationTriangle />
              <p>خطأ في تحميل التذاكر</p>
              <button onClick={() => refetchTickets()}>إعادة المحاولة</button>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="empty-state">
              <FaTicketAlt />
              <p>لا توجد تذاكر</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                className="ticket-card"
                initial={{opacity:0, y:20}}
                animate={{opacity:1, y:0}}
                transition={{duration:0.3}}
                whileHover={{scale:1.02, y:-5}}
              >
                <div className="ticket-header">
                  <div className="ticket-id">
                    <FaTicketAlt className="ticket-icon" />
                    <span>#{ticket.id}</span>
                  </div>
                  <div className="ticket-status">
                    {getStatusIcon(ticket.status)}
                    <span>{getStatusText(ticket.status)}</span>
                  </div>
                </div>
                
                <div className="ticket-content">
                  <div className="ticket-user">
                    <FaUser className="user-icon" />
                    <span>{ticket.user_name}</span>
                  </div>
                  
                  <div className="ticket-category">
                    <span className="category-badge">{ticket.category}</span>
                  </div>
                  
                  <div className="ticket-message">
                    <p>{ticket.message}</p>
                  </div>
                  
                  <div className="ticket-meta">
                    <div className="ticket-date">
                      <FaClock className="meta-icon" />
                      <span>{new Date(ticket.created_at).toLocaleString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="ticket-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setShowTicketModal(true)
                    }}
                    title="عرض التفاصيل"
                  >
                    <FaEye />
                  </button>
                  
                  {ticket.status === 'pending' && (
                    <>
                      <button
                        className="action-btn approve-btn"
                        onClick={() => handleTicketAction(ticket.id, 'approve')}
                        disabled={isLoading}
                        title="الموافقة"
                      >
                        <FaCheck />
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleTicketAction(ticket.id, 'reject')}
                        disabled={isLoading}
                        title="الرفض"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteTicket(ticket.id)}
                    disabled={isLoading}
                    title="حذف"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.section>

      {/* Ticket Modal */}
      {showTicketModal && selectedTicket && (
        <motion.div
          className="modal-overlay"
          initial={{opacity:0}}
          animate={{opacity:1}}
          onClick={() => setShowTicketModal(false)}
        >
          <motion.div
            className="ticket-modal"
            initial={{scale:0.8, opacity:0}}
            animate={{scale:1, opacity:1}}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>تفاصيل التذكرة #{selectedTicket.id}</h3>
              <button
                className="close-btn"
                onClick={() => setShowTicketModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="ticket-details">
                <div className="detail-row">
                  <strong>المستخدم:</strong>
                  <span>{selectedTicket.user_name}</span>
                </div>
                <div className="detail-row">
                  <strong>الفئة:</strong>
                  <span>{selectedTicket.category}</span>
                </div>
                <div className="detail-row">
                  <strong>الحالة:</strong>
                  <span className={`status-text ${selectedTicket.status}`}>
                    {getStatusText(selectedTicket.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>تاريخ الإنشاء:</strong>
                  <span>{new Date(selectedTicket.created_at).toLocaleString('ar-SA')}</span>
                </div>
                <div className="detail-row">
                  <strong>الرسالة:</strong>
                  <p className="ticket-message-text">{selectedTicket.message}</p>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              {selectedTicket.status === 'pending' && (
                <>
                  <button
                    className="action-btn approve-btn"
                    onClick={() => {
                      handleTicketAction(selectedTicket.id, 'approve')
                      setShowTicketModal(false)
                    }}
                    disabled={isLoading}
                  >
                    <FaCheck /> الموافقة
                  </button>
                  <button
                    className="action-btn reject-btn"
                    onClick={() => {
                      handleTicketAction(selectedTicket.id, 'reject')
                      setShowTicketModal(false)
                    }}
                    disabled={isLoading}
                  >
                    <FaTimes /> الرفض
                  </button>
                </>
              )}
              <button
                className="action-btn delete-btn"
                onClick={() => {
                  handleDeleteTicket(selectedTicket.id)
                  setShowTicketModal(false)
                }}
                disabled={isLoading}
              >
                <FaTrash /> حذف
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}