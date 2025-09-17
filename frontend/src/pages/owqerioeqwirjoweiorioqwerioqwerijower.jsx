import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { 
  FaHandshake, FaUser, FaRobot, FaShieldAlt, FaComments, FaClock, 
  FaCheckCircle, FaVideo, FaPhone, FaFileAlt, FaImage, FaSmile, 
  FaMicrophone, FaEllipsisV, FaStar, FaHeart, FaThumbsUp, FaReply,
  FaDownload, FaShare, FaCopy, FaBell, FaBellSlash, FaVolumeUp,
  FaVolumeMute, FaCog, FaUsers, FaHistory, FaArchive, FaSearch,
  FaList, FaPlus, FaPaperPlane, FaShoppingCart, FaStore, FaUserTie
} from 'react-icons/fa'
import { io } from 'socket.io-client'

export default function Owqerioeqwirjoweiorioqwerioqwerijower() {
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [requestId, setRequestId] = useState(null)
  const [userInfo, setUserInfo] = useState({ id: '', name: '', role: '' })
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginData, setLoginData] = useState({ name: '', role: '' })
  const [requestData, setRequestData] = useState(null)
  const [users, setUsers] = useState([])
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState([])
  
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Get request ID from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const requestIdParam = urlParams.get('request')
    if (requestIdParam) {
      setRequestId(requestIdParam)
      loadRequestData(requestIdParam)
    } else {
      // If no request ID, show role selection
      setShowRoleSelection(true)
    }
  }, [])

  // Load request data
  const loadRequestData = async (id) => {
    try {
      const response = await fetch(`/api/mediation-requests/${id}`)
      if (response.ok) {
        const data = await response.json()
        setRequestData(data)
      }
    } catch (error) {
      console.error('خطأ في تحميل بيانات الطلب:', error)
    }
  }

  // Load messages
  const loadMessages = async (id) => {
    try {
      const response = await fetch(`/api/mediation-requests/${id}/chat`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('خطأ في تحميل الرسائل:', error)
    }
  }

  // Load users
  const loadUsers = async (id) => {
    try {
      const response = await fetch(`/api/mediation-requests/${id}/users`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('خطأ في تحميل المستخدمين:', error)
    }
  }

  // Initialize socket connection
  useEffect(() => {
    if (requestId) {
      const newSocket = io('http://localhost:8080')
      setSocket(newSocket)
      
      // Load initial data
      loadMessages(requestId)
      loadUsers(requestId)

      return () => {
        newSocket.close()
      }
    }
  }, [requestId])

  // Socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        setIsConnected(true)
        console.log('Connected to server')
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
        console.log('Disconnected from server')
      })

      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message])
        scrollToBottom()
      })

      socket.on('users-updated', (updatedUsers) => {
        setUsers(updatedUsers)
      })

      socket.on('user-typing', (data) => {
        if (data.userId !== userInfo.id) {
          setTypingUsers(prev => {
            if (data.isTyping) {
              return [...prev.filter(u => u.userId !== data.userId), data]
            } else {
              return prev.filter(u => u.userId !== data.userId)
            }
          })
        }
      })

      socket.on('join-success', (data) => {
        addNotification('success', 'تم الانضمام', data.message)
        setShowLoginModal(false)
        setShowRoleSelection(false)
      })

      socket.on('role-error', (error) => {
        addNotification('error', 'خطأ', error.message)
      })

      socket.on('error', (error) => {
        addNotification('error', 'خطأ', error.message)
      })
    }
  }, [socket, userInfo.id])

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Add notification
  const addNotification = (type, title, message) => {
    const id = Date.now() + Math.random()
    const notification = { id, type, title, message }
    setNotifications(prev => [...prev, notification])
    
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginData.name.trim() || !loginData.role) {
      addNotification('error', 'خطأ', 'يرجى ملء جميع الحقول')
      return
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setUserInfo({ id: userId, name: loginData.name, role: loginData.role })

    if (requestId) {
      try {
        const response = await fetch(`/api/mediation-requests/${requestId}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            user_name: loginData.name,
            role: loginData.role
          })
        })

        if (response.ok) {
          // Join socket room
          socket.emit('join-mediation', {
            requestId,
            userId,
            userName: loginData.name,
            role: loginData.role
          })
        } else {
          const error = await response.json()
          addNotification('error', 'خطأ', error.error)
        }
      } catch (error) {
        addNotification('error', 'خطأ', 'فشل في الانضمام للطلب')
      }
    } else {
      // Create new request
      try {
        const response = await fetch('/api/mediation-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buyer_id: userId,
            title: `طلب وساطة من ${loginData.name}`,
            description: 'طلب وساطة جديد',
            category: 'general',
            price: 0,
            location: 'غير محدد'
          })
      })
      
      if (response.ok) {
          const data = await response.json()
          setRequestId(data.id)
          window.history.replaceState({}, '', `?request=${data.id}`)
          loadRequestData(data.id)
          
          // Join socket room
          socket.emit('join-mediation', {
            requestId: data.id,
            userId,
            userName: loginData.name,
            role: loginData.role
          })
        } else {
          const error = await response.json()
          addNotification('error', 'خطأ', error.error)
        }
      } catch (error) {
        addNotification('error', 'خطأ', 'فشل في إنشاء الطلب')
      }
    }
  }

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !requestId || !userInfo.id) return

    const messageData = {
      requestId,
      senderId: userInfo.id,
      senderName: userInfo.name,
      senderRole: userInfo.role,
      message: newMessage.trim(),
      messageType: 'text'
    }

    // Add to local state immediately
    setMessages(prev => [...prev, {
      id: Date.now(),
      ...messageData,
      created_at: new Date().toISOString()
    }])

    // Clear input
    setNewMessage('')
    setIsTyping(false)

    // Send via socket
    if (socket) {
      socket.emit('send-mediation-message', messageData)
    }

    // Send to server
    try {
      await fetch(`/api/mediation-requests/${requestId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      })
    } catch (error) {
      console.error('خطأ في حفظ الرسالة:', error)
    }
  }

  // Handle typing
  const handleTyping = (e) => {
    setNewMessage(e.target.value)
    
    if (!isTyping) {
      setIsTyping(true)
      if (socket) {
        socket.emit('typing', {
          requestId,
          userId: userInfo.id,
          userName: userInfo.name,
          isTyping: true
        })
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      if (socket) {
        socket.emit('typing', {
          requestId,
          userId: userInfo.id,
          userName: userInfo.name,
          isTyping: false
        })
      }
    }, 1000)
  }

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Get role display name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'buyer': return 'مشتري'
      case 'seller': return 'بائع'
      case 'broker': return 'وسيط'
      default: return 'مستخدم'
    }
  }

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'buyer': return <FaShoppingCart />
      case 'seller': return <FaStore />
      case 'broker': return <FaUserTie />
      default: return <FaUser />
    }
  }

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'buyer': return '#3b82f6'
      case 'seller': return '#f59e0b'
      case 'broker': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="mediation-container">
      <style>{`
        .mediation-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .mediation-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
          color: white;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .header-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }
        
        .connection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${isConnected ? '#10b981' : '#ef4444'};
        }
        
        .users-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .user-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.2);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .messages-container {
          flex: 1;
          background: #f8fafc;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .message {
          display: flex;
          flex-direction: column;
          max-width: 70%;
          padding: 15px 20px;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: relative;
        }
        
        .message.sent {
          align-self: flex-end;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }
        
        .message.received {
          align-self: flex-start;
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }
        
        .message-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        
        .sender-name {
          font-weight: 700;
          font-size: 14px;
        }
        
        .sender-role {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .message-content {
          font-size: 16px;
          line-height: 1.5;
          word-wrap: break-word;
        }
        
        .message-time {
          font-size: 11px;
          opacity: 0.7;
          margin-top: 5px;
        }
        
        .input-container {
          background: white;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 15px;
          align-items: flex-end;
        }
        
        .message-input {
          flex: 1;
          border: 2px solid #e5e7eb;
          border-radius: 25px;
          padding: 12px 20px;
          font-size: 16px;
          resize: none;
          outline: none;
          transition: border-color 0.3s;
        }
        
        .message-input:focus {
          border-color: #3b82f6;
        }
        
        .send-button {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .send-button:hover {
          transform: scale(1.05);
        }
        
        .send-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          transform: none;
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 200px;
        }
        
        .typing-dots {
          display: flex;
          gap: 4px;
        }
        
        .typing-dot {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 30px;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        
        .modal-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 10px 0;
        }
        
        .modal-subtitle {
          color: #6b7280;
          font-size: 16px;
          margin: 0;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .form-input, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: #3b82f6;
        }
        
        .role-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 15px;
          margin-top: 10px;
        }
        
        .role-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }
        
        .role-option:hover {
          border-color: #3b82f6;
          background: #f8fafc;
        }
        
        .role-option.selected {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        
        .role-icon {
          font-size: 24px;
          margin-bottom: 10px;
        }
        
        .role-name {
          font-weight: 600;
          color: #374151;
        }
        
        .submit-button {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 15px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
        }
        
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          padding: 15px 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 1001;
          max-width: 400px;
        }
        
        .notification.success {
          border-left: 4px solid #10b981;
        }
        
        .notification.error {
          border-left: 4px solid #ef4444;
        }
        
        .notification-title {
          font-weight: 700;
          margin: 0 0 5px 0;
        }
        
        .notification-message {
          margin: 0;
          color: #6b7280;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #6b7280;
          text-align: center;
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 20px;
          opacity: 0.5;
        }
      `}</style>

      {/* Header */}
      <motion.header 
        className="mediation-header"
        initial={{opacity:0, y:-20}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <div className="header-left">
          <FaHandshake style={{fontSize: '28px'}} />
          <div>
            <h1 className="header-title">نظام الوساطة</h1>
            <div className="connection-status">
              <div className="status-dot"></div>
              <span>{isConnected ? 'متصل' : 'غير متصل'}</span>
            </div>
          </div>
            </div>
            
        <div className="users-list">
          {users.map(user => (
            <div key={user.id} className="user-badge">
              {getRoleIcon(user.role)}
              <span>{user.name}</span>
              <span style={{color: getRoleColor(user.role)}}>
                ({getRoleDisplayName(user.role)})
              </span>
            </div>
          ))}
        </div>
      </motion.header>

      {/* Messages */}
      <motion.div 
        className="messages-container"
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration:0.5}}
      >
        {messages.length === 0 ? (
            <div className="empty-state">
            <FaComments className="empty-icon" />
            <h3>لا توجد رسائل بعد</h3>
            <p>ابدأ المحادثة بإرسال رسالة</p>
            </div>
          ) : (
          messages.map((message, idx) => {
            const isCurrentUser = message.sender_id === userInfo.id
            return (
              <motion.div 
                key={message.id || idx} 
                className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                initial={{opacity:0, y:20}} 
                animate={{opacity:1, y:0}} 
                transition={{duration:0.5, delay:idx*0.1}}
              >
                <div className="message-header">
                  <span className="sender-name">{message.sender_name}</span>
                  <span 
                    className="sender-role"
                    style={{backgroundColor: getRoleColor(message.sender_role)}}
                  >
                    {getRoleIcon(message.sender_role)}
                    {getRoleDisplayName(message.sender_role)}
                  </span>
                </div>
                <div className="message-content">{message.message}</div>
                <div className="message-time">
                  {new Date(message.created_at).toLocaleTimeString('ar-SA')}
                </div>
              </motion.div>
            )
          })
          )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <motion.div 
            className="typing-indicator"
            initial={{opacity:0, y:10}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.3}}
          >
            <div className="typing-dots">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              </div>
            <span>
              {typingUsers.length === 1 
                ? `${typingUsers[0].userName} يكتب...`
                : `${typingUsers.map(u => u.userName).join(' و ')} يكتبون...`
              }
                    </span>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Input */}
      {userInfo.id && (
        <motion.div 
          className="input-container"
          initial={{opacity:0, y:20}} 
          animate={{opacity:1, y:0}} 
          transition={{duration:0.5}}
        >
          <textarea
            value={newMessage}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك هنا..."
            className="message-input"
            rows="1"
          />
          <button 
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="send-button"
          >
            <FaPaperPlane />
          </button>
        </motion.div>
      )}

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            className="modal-overlay"
            initial={{opacity:0}} 
            animate={{opacity:1}} 
            exit={{opacity:0}}
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{scale:0.8, opacity:0}} 
              animate={{scale:1, opacity:1}} 
              exit={{scale:0.8, opacity:0}}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">انضم للوساطة</h2>
                <p className="modal-subtitle">أدخل اسمك واختر دورك</p>
              </div>
              
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">اسمك</label>
                  <input
                    type="text"
                    value={loginData.name}
                    onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                    className="form-input"
                    placeholder="أدخل اسمك"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">اختر دورك</label>
                  <div className="role-options">
                    <div 
                      className={`role-option ${loginData.role === 'buyer' ? 'selected' : ''}`}
                      onClick={() => setLoginData({...loginData, role: 'buyer'})}
                    >
                      <FaShoppingCart className="role-icon" style={{color: '#3b82f6'}} />
                      <span className="role-name">مشتري</span>
                    </div>
                    <div 
                      className={`role-option ${loginData.role === 'seller' ? 'selected' : ''}`}
                      onClick={() => setLoginData({...loginData, role: 'seller'})}
                    >
                      <FaStore className="role-icon" style={{color: '#f59e0b'}} />
                      <span className="role-name">بائع</span>
                    </div>
                    <div 
                      className={`role-option ${loginData.role === 'broker' ? 'selected' : ''}`}
                      onClick={() => setLoginData({...loginData, role: 'broker'})}
                    >
                      <FaUserTie className="role-icon" style={{color: '#10b981'}} />
                      <span className="role-name">وسيط</span>
                    </div>
                </div>
              </div>
              
                <button type="submit" className="submit-button">
                  انضم الآن
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      {notifications.map(notification => (
        <motion.div 
          key={notification.id}
          className={`notification ${notification.type}`}
          initial={{opacity:0, x:300}} 
          animate={{opacity:1, x:0}} 
          exit={{opacity:0, x:300}}
        >
          <h4 className="notification-title">{notification.title}</h4>
          <p className="notification-message">{notification.message}</p>
        </motion.div>
      ))}
    </div>
  )
}