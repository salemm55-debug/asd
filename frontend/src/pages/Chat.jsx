import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { 
  FaPaperPlane, FaUser, FaRobot, FaShieldAlt, FaComments, FaClock, 
  FaCheckCircle, FaVideo, FaPhone, FaFileAlt, FaImage, FaSmile, 
  FaMicrophone, FaEllipsisV, FaStar, FaHeart, FaThumbsUp, FaReply,
  FaDownload, FaShare, FaCopy, FaBell, FaBellSlash, FaVolumeUp,
  FaVolumeMute, FaCog, FaUsers, FaHistory, FaArchive, FaSearch,
  FaList, FaPlus
} from 'react-icons/fa'
import { io } from 'socket.io-client'
import SmartNotification from '../components/SmartNotification'
import { useSession } from '../hooks/useSession'

import { trackChatMessage } from '../utils/analytics'

export default function Chat() {
  // استخدام نظام الجلسات
  const { session, createSession, updateSession, validateSession, endSession, isLoggedIn, isLoading: sessionLoading } = useSession()
  
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [ticketId, setTicketId] = useState(null)
  const [userInfo, setUserInfo] = useState({ id: '', name: '', type: 'user' })
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyTo, setReplyTo] = useState(null)
  const [userRole, setUserRole] = useState('buyer')
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [rolesState, setRolesState] = useState({ buyerId: null, sellerId: null })
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [isReporting, setIsReporting] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [lastMessageTime, setLastMessageTime] = useState(0)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [connectionStatus, setConnectionStatus] = useState('connected')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginData, setLoginData] = useState({ nickname: '', userRole: '' })
  const [isBrokerLink, setIsBrokerLink] = useState(false)
  const [brokerId, setBrokerId] = useState(null)
  const [hasInitializedBroker, setHasInitializedBroker] = useState(false)
  
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)
  const lastTypingEmitRef = useRef(0)
  const fileInputRef = useRef(null)
  const rateLimitRef = useRef(null)
  const maxFileSize = 50 * 1024 * 1024 // 50MB

  // Smart notification system
  const addNotification = (type, title, message, duration = 5000) => {
    const id = Date.now() + Math.random()
    const notification = { id, type, title, message, duration }
    setNotifications(prev => [...prev, notification])
    
    // Auto remove after duration
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // صفحة الشات تدعم نظام الوساطة الجديد مع عرض الأسماء والرتب

  // Check for mediation request parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const request = urlParams.get('request')
    const broker = urlParams.get('broker')
    const brokerIdParam = urlParams.get('brokerId')
    const brokerName = urlParams.get('brokerName')
    
    if (request) {
      setTicketId(request)
    }
    
    if (broker === 'true' && brokerIdParam) {
      setIsBrokerLink(true)
      setBrokerId(brokerIdParam)
      setUserRole('broker')
      // Set broker name from URL or generate one
      const displayName = brokerName || `وسيط ${brokerIdParam.slice(-4)}`
      setUserInfo(prev => ({ ...prev, name: displayName, type: 'broker' }))
      
      // Show broker welcome message
      addNotification('success', 'مرحباً بالوسيط', `تم تسجيل دخولك كوسيط: ${displayName}`)
    }
  }, [])

  const handleRoleSelection = async (role) => {
    // التحقق من وجود جلسة نشطة
    if (!isLoggedIn || !session) {
      setShowLoginModal(true)
      return
    }

    const currentUserId = session.userId
    
    // Check if role is already taken
    if (role === 'buyer' && rolesState.buyerId && rolesState.buyerId !== currentUserId) {
      alert('دور المشتري مشغول حالياً من قبل مستخدم آخر')
      return
    }
    if (role === 'seller' && rolesState.sellerId && rolesState.sellerId !== currentUserId) {
      alert('دور البائع مشغول حالياً من قبل مستخدم آخر')
      return
    }

    setUserRole(role)
    setShowRoleSelection(false)
    
    // تحديث الجلسة مع الدور الجديد
    try {
      await updateSession({ userRole: role })
    } catch (error) {
      console.error('خطأ في تحديث الجلسة:', error)
    }

    // حفظ الدور في قاعدة البيانات
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const existingRequest = urlParams.get('request')
      if (existingRequest) {
        const response = await fetch(`/api/mediation-requests/${existingRequest}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: currentUserId,
            user_name: session.nickname,
            role: role
          })
        })
        
        if (response.ok) {
          console.log('تم حفظ الدور في قاعدة البيانات')
          // تحديث حالة الأدوار المحلية
          setRolesState(prev => ({
            ...prev,
            [role === 'buyer' ? 'buyerId' : 'sellerId']: currentUserId
          }))
        } else {
          console.error('فشل في حفظ الدور في قاعدة البيانات')
        }
      }
    } catch (error) {
      console.error('خطأ في حفظ الدور:', error)
    }

    // Try to join current request with role if it already exists in URL
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const existingRequest = urlParams.get('request')
      if (existingRequest && socket) {
        const joinData = { 
          requestId: existingRequest, 
          userId: currentUserId,
          userName: session.nickname,
          role: role
        }
        socket.emit('join-mediation', joinData)
      }
    } catch {}
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const requestId = urlParams.get('request')
      
      await createSession(loginData.nickname, loginData.userRole, requestId)
      
      setShowLoginModal(false)
      setLoginData({ nickname: '', userRole: '' })
      
      // إعادة تحميل الجلسة للتأكد من التحديث
      await validateSession()
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error)
      alert(error.message || 'خطأ في تسجيل الدخول')
    }
  }

  const handleReport = async () => {
    if (!reportReason.trim() || isReporting) return
    setIsReporting(true)
    
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const requestId = urlParams.get('request') || ticketId
      if (!requestId) {
        alert('لا يمكن إرسال البلاغ بدون معرف طلب وساطة صالح')
        return
      }

      const response = await fetch(`/api/mediation-requests/${requestId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: session?.userId || localStorage.getItem('userId') || `user_${Date.now()}`,
          sender_name: session?.nickname || userInfo.name || 'مستخدم',
          sender_role: userRole || 'user',
          message: `بلاغ عن مشكلة: ${reportReason}`,
          message_type: 'system'
        })
      })
      
      if (response.ok) {
        alert('تم إرسال البلاغ كرسالة نظام داخل المحادثة')
        setShowReportModal(false)
        setReportReason('')
      } else {
        alert('خطأ في إرسال البلاغ')
      }
    } catch (error) {
      console.error('خطأ في إرسال البلاغ:', error)
      alert('خطأ في إرسال البلاغ')
    } finally {
      setIsReporting(false)
    }
  }

  useEffect(() => {
    // انتظار تحميل الجلسة
    if (sessionLoading) return

    // التحقق من وجود جلسة نشطة
    if (!isLoggedIn || !session) {
      // تحقق أولاً من رابط وسيط لتخطي نافذة الدخول وإنشاء جلسة تلقائياً
      const urlParams = new URLSearchParams(window.location.search)
      const isBrokerLinkParam = urlParams.get('broker') === 'true'
      const brokerIdParam = urlParams.get('brokerId')
      const brokerNameParam = urlParams.get('brokerName') || (brokerIdParam ? `وسيط ${brokerIdParam.slice(-4)}` : 'وسيط')
      const ticketIdParam = urlParams.get('ticket')

      if (isBrokerLinkParam && brokerIdParam && !hasInitializedBroker) {
        (async () => {
          try {
            await createSession(brokerNameParam, 'broker', ticketIdParam)
            setHasInitializedBroker(true)
            setShowLoginModal(false)
            // إعادة تحميل الجلسة للتأكد من التحديث
            await validateSession()
          } catch (e) {
            console.error('فشل إنشاء جلسة الوسيط التلقائية:', e)
            setShowLoginModal(true)
          }
        })()
        return
      }

      setShowLoginModal(true)
      return
    }

    // تحديث معلومات المستخدم من الجلسة
    setUserInfo({ 
      id: session.userId, 
      name: session.nickname, 
      type: 'user' 
    })

    // تحديث الدور من الجلسة
    if (session.userRole) {
      setUserRole(session.userRole)
      setShowRoleSelection(false)
    }

    // Initialize socket connection
    const newSocket = io('http://localhost:8080')
    setSocket(newSocket)

    // Get ticket ID and role from URL
  const urlParams = new URLSearchParams(window.location.search)
  const ticketIdFromUrl = urlParams.get('ticket')
  const roleFromUrl = urlParams.get('role')
  
  if (ticketIdFromUrl) {
    // SECURITY FIX: Don't trust role from URL - validate it properly
    // Only allow role from URL if it's a valid broker link
    const isBrokerLink = urlParams.get('broker') === 'true'
    const brokerId = urlParams.get('brokerId')
    
    if (isBrokerLink && brokerId) {
      // This is a broker link, set role to broker
      setUserRole('broker')
      setShowRoleSelection(false)
    } else if (roleFromUrl && ['buyer', 'seller'].includes(roleFromUrl)) {
      // Only allow buyer/seller roles from URL for regular users
      // But validate this role against the database later
      setUserRole(roleFromUrl)
      setShowRoleSelection(false)
    }
      
      // Validate request ID format and existence
      validateRequestAccess(ticketIdFromUrl, newSocket)
    } else {
      // منع الوصول المباشر لصفحة الشات بدون تذكرة صالحة
      // إعادة التوجيه للصفحة الرئيسية
      window.location.replace('/')
    }

    return () => {
      newSocket.close()
    }
  }, [sessionLoading, isLoggedIn, session])

  // Separate effect for role selection
  useEffect(() => {
    // Check if user already has a role from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const roleFromUrl = urlParams.get('role')
    const savedRole = localStorage.getItem('userRole')
    const isBrokerLink = urlParams.get('broker') === 'true'
    const brokerId = urlParams.get('brokerId')
    
    if (isBrokerLink && brokerId) {
      // This is a broker link, set role to broker
      setUserRole('broker')
      setShowRoleSelection(false)
    } else if (roleFromUrl && ['buyer', 'seller'].includes(roleFromUrl)) {
      // SECURITY: Only allow buyer/seller roles from URL for regular users
      setUserRole(roleFromUrl)
      setShowRoleSelection(false)
    } else if (savedRole && ['buyer', 'seller', 'broker'].includes(savedRole)) {
      // إذا كان هناك دور محفوظ في localStorage، استخدمه
      setUserRole(savedRole)
      setShowRoleSelection(false)
    } else {
      // إذا لم يكن هناك دور، اعرض اختيار الدور
      setShowRoleSelection(true)
    }
  }, [])

  const validateRequestAccess = async (requestId, socket) => {
    try {
      // Check if request ID is valid format (alphanumeric with length between 8-32)
      const requestIdPattern = /^[a-zA-Z0-9]{8,32}$/
      if (!requestIdPattern.test(requestId)) {
        console.error('Invalid request ID format:', requestId)
        // Show user-friendly error message
        const errorMessage = 'معرف الطلب غير صحيح. سيتم توجيهك لصفحة بدء محادثة جديدة.'
        showErrorNotification(errorMessage)
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
        return
      }

      // Check if request exists in database with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      try {
        const response = await fetch(`/api/mediation-requests/${requestId}`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          console.error('Request validation failed:', response.status)
          const errorMessage = response.status === 404 
            ? 'طلب الوساطة غير موجود. سيتم توجيهك لصفحة بدء محادثة جديدة.'
            : 'حدث خطأ في التحقق من الطلب. سيتم توجيهك لصفحة بدء محادثة جديدة.'
          showErrorNotification(errorMessage)
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
          return
        }

        const requestData = await response.json()

        // If validations pass, set the request
        setTicketId(requestId)
        await loadMessages(requestId)
        
        // Get current users from database
        try {
          const usersResponse = await fetch(`/api/mediation-requests/${requestId}/users`)
          if (usersResponse.ok) {
            const users = await usersResponse.json()
            const newRoles = { buyerId: null, sellerId: null }
            users.forEach(user => {
              if (user.role === 'buyer') newRoles.buyerId = user.id
              if (user.role === 'seller') newRoles.sellerId = user.id
            })
            setRolesState(newRoles)
          }
        } catch (error) {
          console.error('خطأ في جلب المستخدمين:', error)
        }
        
        // include role and user id so server can reserve roles
        const joinData = { 
          requestId: requestId, 
          userId: session.userId,
          userName: session.nickname,
          role: session.userRole
        }
        socket.emit('join-mediation', joinData)
        
        // Get current users from socket
        socket.emit('get-users', requestId)
        
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          console.error('Request timeout')
          const errorMessage = 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.'
          showErrorNotification(errorMessage)
        } else {
          throw fetchError
        }
      }
      
    } catch (error) {
      console.error('Request validation error:', error)
      // Show user-friendly error and redirect
      const errorMessage = 'حدث خطأ في تحميل المحادثة. سيتم توجيهك لصفحة بدء محادثة جديدة.'
      showErrorNotification(errorMessage)
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    }
  }

  const showErrorNotification = (message) => {
    // Create a more user-friendly error notification
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
      z-index: 10000;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      max-width: 400px;
      opacity: 0;
      transform: translateX(20px);
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    `
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 5000)

    // Trigger entrance transition
    requestAnimationFrame(() => {
      notification.style.opacity = '1'
      notification.style.transform = 'translateX(0)'
    })
  }

  useEffect(() => {
    if (socket) {
      // Listen for new messages
      socket.on('new-message', (message) => {
        // Only add message if it's not from current user to avoid duplication
        if (message.sender_id !== userInfo.id) {
          setMessages(prev => {
            // Check if message already exists to prevent duplicates
            const exists = prev.some(msg => 
              msg.id === message.id || 
              (msg.sender_id === message.sender_id && 
               msg.message === message.message && 
               Math.abs(new Date(msg.created_at) - new Date(message.created_at)) < 1000))
            
            if (exists) return prev
            return [...prev, message]
          })
        }
      })

      // Listen for typing indicators
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

      // Listen for user updates and errors
      socket.on('users-updated', (users) => {
        // Update roles state based on users
        const newRoles = { buyerId: null, sellerId: null }
        users.forEach(user => {
          if (user.role === 'buyer') newRoles.buyerId = user.id
          if (user.role === 'seller') newRoles.sellerId = user.id
        })
        setRolesState(newRoles)
      })
      socket.on('role-error', (err) => {
        alert(err?.message || 'لا يمكن اختيار هذا الدور حالياً')
      })

      // Listen for errors
      socket.on('error', (error) => {
        console.error('Socket error:', error)
      })

      // Ensure typing stops if socket disconnects
      socket.on('disconnect', () => {
        setIsTyping(false)
      })
    }
  }, [socket, userInfo.id])

  useEffect(() => {
    // Add a small delay to prevent scroll issues
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [messages])

  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      // Temporarily disable smooth scrolling if force is true
      const messagesContainer = document.querySelector('.whatsapp-messages')
      if (messagesContainer && force) {
        messagesContainer.style.scrollBehavior = 'auto'
      }
      
      messagesEndRef.current.scrollIntoView({ 
        behavior: force ? 'auto' : 'smooth',
        block: 'end',
        inline: 'nearest'
      })
      
      // Restore smooth scrolling after scroll
      if (messagesContainer && force) {
        setTimeout(() => {
          messagesContainer.style.scrollBehavior = 'smooth'
        }, 100)
      }
    }
  }

  const loadMessages = async (ticketId) => {
    try {
      // Load from server with timeout only (disable localStorage)
      let savedMessages = []
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      try {
        const response = await fetch(`/api/mediation-requests/${ticketId}/chat`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Loaded messages from server:', data.length)
          
          setMessages(Array.isArray(data) ? data : [])
        } else {
          console.warn('Failed to load messages from server:', response.status)
          setMessages([])
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          console.warn('Message loading timeout')
          setMessages([])
        } else {
          throw fetchError
        }
      }
    } catch (error) {
      console.error('خطأ في تحميل الرسائل:', error)
      setMessages([])
    }
  }

  // إيقاف أي تخزين محلي للرسائل

  // تعطيل حفظ/قراءة الدور من localStorage لتفادي الالتباس بين المستخدمين
  // الدور يُستمد من الجلسة أو من قاعدة البيانات فقط

  const checkRateLimit = () => {
    const now = Date.now()
    const timeWindow = 60000 // 1 minute
    const maxMessages = 10 // Maximum 10 messages per minute
    
    // Reset counter if time window has passed
    if (now - lastMessageTime > timeWindow) {
      setMessageCount(0)
      setLastMessageTime(now)
    }
    
    // Check if rate limit exceeded
    if (messageCount >= maxMessages) {
      setIsRateLimited(true)
      const remainingTime = Math.ceil((timeWindow - (now - lastMessageTime)) / 1000)
      
      if (rateLimitRef.current) {
        clearTimeout(rateLimitRef.current)
      }
      
      rateLimitRef.current = setTimeout(() => {
        setIsRateLimited(false)
        setMessageCount(0)
        setLastMessageTime(Date.now())
      }, timeWindow - (now - lastMessageTime))
      
      return false
    }
    
    return true
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !ticketId) return
    
    // Check message length limit (500 characters)
    if (newMessage.trim().length > 500) {
      alert('الرسالة طويلة جداً! الحد الأقصى 500 حرف.')
      return
    }
    
    // Check rate limit
    if (!checkRateLimit()) {
      alert('تم تجاوز الحد الأقصى للرسائل. يرجى الانتظار دقيقة واحدة.')
      return
    }

    const messageId = Date.now() + Math.random()
    const currentUserId = session?.userId
    const currentUserName = session?.nickname || userInfo.name || 'مستخدم'
    const messageData = {
      id: messageId,
      ticket_id: ticketId,
      sender_id: currentUserId,
      sender_type: userInfo.type,
      sender_name: currentUserName,
      sender_role: userRole || 'user',
      message: newMessage.trim(),
      message_type: 'text',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      tempId: `temp_${Date.now()}_${Math.random()}` // Temporary ID for tracking
    }

    // Update rate limit counters
    setMessageCount(prev => prev + 1)
    setLastMessageTime(Date.now())

    // Clear input immediately to prevent double sending
    const messageText = newMessage.trim()
    setNewMessage('')
    setIsTyping(false)
    
    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Add to current messages state immediately for better UX
    setMessages(prev => {
      const newMessages = [...prev, messageData]
      return newMessages
    })

    // Scroll to bottom with force to prevent unwanted scrolling
    setTimeout(() => {
      scrollToBottom(true)
    }, 50)

    // Track message analytics
    try { trackChatMessage('text', messageText.length) } catch {}

    // Send via socket for real-time (only to other users)
    if (socket && socket.connected) {
      socket.emit('send-mediation-message', {
        requestId: ticketId,
        senderId: currentUserId,
        senderName: currentUserName,
        senderRole: userRole || 'user',
        message: messageData.message,
        messageType: 'text'
      })
    }


    // Send to server for database persistence (primary storage)
    try {
      const response = await fetch(`/api/mediation-requests/${ticketId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: currentUserId,
          sender_name: currentUserName,
          sender_role: userRole || 'user',
          message: messageText,
          message_type: 'text'
        })
      })
      
      if (response && response.ok) {
        const result = await response.json()
        console.log('Message saved to database successfully:', result)
        
        // Update message with server-generated ID if provided
        if (result.message_id) {
          setMessages(prev => prev.map(msg => 
            msg.tempId === messageData.tempId 
              ? { ...msg, id: result.message_id, tempId: undefined }
              : msg
          ))
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
    } catch (error) {
      console.error('خطأ في حفظ الرسالة في قاعدة البيانات:', error)
      
      // Show appropriate error message based on error type
      let errorMessage = 'فشل في حفظ الرسالة في قاعدة البيانات'
      
      if (error.message && error.message.includes('انتهت صلاحية')) {
        errorMessage = 'انتهت صلاحية المحادثة لهذه التذكرة (3 أيام)'
      } else if (error.message && (error.message.includes('Rate limit') || error.message.includes('تجاوز الحد'))) {
        errorMessage = 'تم تجاوز الحد المسموح من الرسائل، حاول مرة أخرى لاحقاً'
        setIsRateLimited(true)
        setTimeout(() => setIsRateLimited(false), 60000) // 1 minute cooldown
      } else if (error.message && error.message.includes('التذكرة غير موجودة')) {
        errorMessage = 'التذكرة غير موجودة أو تم حذفها'
      } else if (error.message && error.message.includes('معرف المرسل مطلوب')) {
        errorMessage = 'خطأ في تحديد هوية المستخدم'
      } else if (error.message && error.message.includes('NetworkError')) {
        errorMessage = 'خطأ في الاتصال بالخادم، تحقق من اتصالك بالإنترنت'
      }
      
      addNotification('error', 'خطأ في الإرسال', errorMessage)
      
      // Remove the message from local state if it failed to save to database
      setMessages(prev => prev.filter(msg => msg.tempId !== messageData.tempId))
    }
  }

  const handleTyping = (e) => {
    const value = e.target.value
    
    // Enforce 500 character limit strictly
    if (value.length > 500) {
      return // Don't update state if over limit
    }
    
    setNewMessage(value)
    
    if (!isTyping) {
      setIsTyping(true)
      if (socket && socket.connected) {
        const currentUserId = session?.userId
        socket.emit('typing', {
          requestId: ticketId,
          userId: currentUserId,
          userName: userInfo.name,
          isTyping: true
        })
      }
    } else {
      // Throttle typing emits to once every 700ms
      const now = Date.now()
      if (now - lastTypingEmitRef.current > 700 && socket && socket.connected) {
        lastTypingEmitRef.current = now
        const currentUserId = session?.userId
        socket.emit('typing', {
          requestId: ticketId,
          userId: currentUserId,
          userName: userInfo.name,
          isTyping: true
        })
      }
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      if (socket && socket.connected) {
      socket.emit('typing', {
        requestId: ticketId,
        userId: userInfo.id,
        userName: userInfo.name,
        isTyping: false
      })
      }
    }, 900)
  }

  const handleInputBlur = () => {
    setIsTyping(false)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    if (socket && socket.connected) {
      const currentUserId = session?.userId
      socket.emit('typing', {
        requestId: ticketId,
        userId: currentUserId,
        userName: userInfo.name,
        isTyping: false
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getSenderIcon = (senderType) => {
    switch (senderType) {
      case 'admin':
        return <FaShieldAlt className="sender-icon admin" />
      case 'broker':
        return <FaRobot className="sender-icon broker" />
      default:
        return <FaUser className="sender-icon user" />
    }
  }

  const getSenderName = (senderType, messageSenderId, messageObj) => {
    // Always prefer the explicit name if present on the message
    if (messageObj?.sender_name && messageObj.sender_name.trim()) {
      return messageObj.sender_name
    }

    // Broker naming should be visible to everyone
    if (senderType === 'broker') {
      if (isBrokerLink && brokerId) return `وسيط ${brokerId.slice(-4)}`
      return 'الوسيط'
    }

    // Map based on roles attached to the ticket so all viewers get consistent labels
    if (rolesState.buyerId === messageSenderId) return 'المُشتري'
    if (rolesState.sellerId === messageSenderId) return 'البائع'

    // As a final fallback
    return 'مستخدم'
  }

  // Get role display with proper styling
  const getRoleDisplay = (senderType, messageSenderId, messageObj) => {
    if (senderType === 'admin') return { name: 'مدير النظام', color: '#8b5cf6', icon: '👑' }
    if (senderType === 'broker' || messageObj?.sender_role === 'broker') return { name: 'الوسيط', color: '#10b981', icon: '🤝' }
    if (messageObj?.sender_role === 'buyer' || rolesState.buyerId === messageSenderId) return { name: 'المُشتري', color: '#3b82f6', icon: '🛒' }
    if (messageObj?.sender_role === 'seller' || rolesState.sellerId === messageSenderId) return { name: 'البائع', color: '#f59e0b', icon: '🏪' }
    return { name: 'مستخدم', color: '#6b7280', icon: '👤' }
  }

  const getSenderRole = (senderType, messageSenderId, messageObj) => {
    const roleDisplay = getRoleDisplay(senderType, messageSenderId, messageObj)
    return roleDisplay.name
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    
    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`الملف ${file.name} كبير جداً. الحد الأقصى 50 ميجابايت`)
        continue
      }
      
      // Check file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain', 'application/zip', 'application/x-rar-compressed'
      ]
      
      if (!allowedTypes.includes(file.type)) {
        alert(`نوع الملف ${file.name} غير مدعوم`)
        continue
      }
      
      setIsUploading(true)
      setUploadProgress(0)
      
      try {
        // Create a unique file ID
        const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return prev
            }
            return prev + Math.random() * 10
          })
        }, 200)
        
        // For now, we'll create a mock file data since we don't have a real upload endpoint
        // In a real application, you would upload to a server
        const mockFileData = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // Create a local URL for preview
          uploadedAt: new Date().toISOString()
        }
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
        
        clearInterval(progressInterval)
        setUploadProgress(100)
        
        const currentUserId = session?.userId
        const fileMessage = {
          id: Date.now() + Math.random(),
          ticketId,
          senderId: currentUserId,
          senderType: userInfo.type,
          message: `تم رفع ملف: ${file.name}`,
          messageType: 'file',
          fileData: mockFileData,
          timestamp: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
        
        // Add to messages immediately
        setMessages(prev => [...prev, fileMessage])
        
        // لا تخزين محلي
        
        // Send via socket (only to other users)
        if (socket) {
          socket.emit('send-message', {
            ...fileMessage,
            isFromCurrentUser: true
          })
        }
        
        setUploadedFiles(prev => [...prev, mockFileData])
        
        // Show success message
        console.log(`تم رفع الملف ${file.name} بنجاح`)
        
      } catch (error) {
        console.error('خطأ في رفع الملف:', error)
        alert(`خطأ في رفع الملف ${file.name}: ${error.message}`)
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleMessageAction = (action, message) => {
    switch (action) {
      case 'reply':
        setReplyTo(message)
        break
      case 'copy':
        navigator.clipboard.writeText(message.message)
        break
      case 'star':
        // Handle star message
        break
      case 'delete':
        // Handle delete message
        break
      default:
        break
    }
  }

  const filteredMessages = messages.filter(message => 
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const emojis = []

  // Role Selection Modal - REMOVED as requested

  return (
    <div className="chat-container whatsapp-style">
      {/* Temporary component-scoped styles for scrollbar hiding and whatsapp look */}
      <style>{`
        .whatsapp-messages::-webkit-scrollbar { width: 0; height: 0; }
        .whatsapp-messages { -ms-overflow-style: none; scrollbar-width: none; }
        .message.selected { outline: 2px solid rgba(18,140,126,0.25); }
        .message-content { background: transparent !important; box-shadow: none !important; border: none !important; padding: 0 !important; }
        .message { background: transparent !important; }
        .message.sent { background: linear-gradient(135deg, #d7f5cd 0%, #c8f0c0 100%) !important; }
        .message.received { background: linear-gradient(135deg, #f5efe6 0%, #f0e6d2 100%) !important; }
        
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .message:hover .message-actions {
          opacity: 1 !important;
        }
        
        .message-actions {
          transition: opacity 0.3s ease;
        }
        
        .input-wrapper:focus-within {
          border-color: #128c7e !important;
          box-shadow: 0 4px 20px rgba(18, 140, 126, 0.2) !important;
        }
        
        .message-input:focus {
          outline: none !important;
        }
        
        .message-input::placeholder {
          color: #9ca3af;
          font-style: italic;
        }
        
        /* Hide scrollbars globally in chat */
        .chat-container *::-webkit-scrollbar {
          display: none;
        }
        .chat-container * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Header */}
      <motion.header 
        className="chat-header whatsapp-header"
        initial={{opacity:0, y:-20}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
        style={{
          background: 'linear-gradient(135deg, #075e54 0%, #128c7e 100%)',
          color: 'white',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div className="header-left" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <div className="chat-avatar" style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <FaComments style={{fontSize: '18px'}} />
            <div className="status-dot" style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              background: '#4caf50',
              borderRadius: '50%',
              border: '2px solid white'
            }}></div>
          </div>
          <div className="chat-details">
            <h1 style={{margin: 0, fontSize: '16px', fontWeight: '600', color: 'white'}}>
              الشات النشط
            </h1>
            <p style={{margin: 0, fontSize: '12px', opacity: 0.8, color: 'white'}}>متصل الآن</p>
          </div>
        </div>
        
        <div className="header-controls" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          {/* Search Button */}
          <button
            className="control-btn"
            title="البحث في المحادثة"
            onClick={() => setShowSearch(!showSearch)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            <FaSearch />
            <span>بحث</span>
          </button>

          {/* Settings Button */}
          <button
            className="control-btn"
            title="الإعدادات"
            onClick={() => setShowSettings(!showSettings)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            <FaCog />
            <span>إعدادات</span>
          </button>

          {/* Copy Chat Button */}
          <button
            className="control-btn"
            title="نسخ المحادثة"
            onClick={async () => {
              try {
                const chatText = messages.map(msg => {
                  const senderName = getSenderName(msg.sender_type, msg.sender_id, msg)
                  const senderRole = getSenderRole(msg.sender_type, msg.sender_id, msg)
                  const time = formatTime(msg.created_at)
                  return `${senderName} [${senderRole}] - ${time}:\n${msg.message}`
                }).join('\n\n')
                
                await navigator.clipboard.writeText(chatText)
                addNotification('success', 'تم نسخ المحادثة', 'تم نسخ جميع الرسائل إلى الحافظة')
              } catch (error) {
                console.error('خطأ في نسخ المحادثة:', error)
                addNotification('error', 'خطأ في النسخ', 'لم يتم نسخ المحادثة')
              }
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          >
            <FaCopy />
            <span>نسخ</span>
          </button>
        </div>
      </motion.header>

      {/* Enhanced Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            className="enhanced-search-container"
            initial={{opacity:0, height:0, y:-30, scale: 0.95}} 
            animate={{opacity:1, height:'auto', y:0, scale: 1}} 
            exit={{opacity:0, height:0, y:-30, scale: 0.95}}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              scale: { duration: 0.3, ease: "easeOut" }
            }}
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderBottom: '1px solid #e2e8f0',
              padding: '16px 20px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <motion.div 
              className="search-backdrop"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(18, 140, 126, 0.05), transparent 70%)',
                pointerEvents: 'none'
              }}
            />
            
            <div className="enhanced-search-wrapper" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              position: 'relative',
              zIndex: 2
            }}>
            <motion.div 
              className="search-input-container"
              initial={{scale: 0.9, opacity: 0, y: -10}}
              animate={{scale: 1, opacity: 1, y: 0}}
              transition={{
                duration: 0.4, 
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileFocus={{scale: 1.02, y: -2}}
              style={{
                flex: 1,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'white',
                borderRadius: '25px',
                padding: '8px 16px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '2px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#128c7e'
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(18, 140, 126, 0.25)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
              }}
            >
                <motion.div 
                  className="search-icon-container"
                  animate={{
                    rotate: searchTerm ? 360 : 0,
                    scale: searchTerm ? 1.1 : 1,
                    color: searchTerm ? '#128c7e' : '#9ca3af'
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  style={{
                    fontSize: '18px',
                    marginLeft: '8px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <FaSearch />
                </motion.div>
                
                <input
                  type="text"
                  placeholder="ابحث في المحادثة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="enhanced-search-input"
                  autoFocus
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    flex: 1,
                    fontSize: '16px',
                    color: '#1a202c',
                    fontFamily: 'inherit'
                  }}
                />
                
                {searchTerm && (
                  <motion.button 
                    className="clear-search-btn"
                    onClick={() => setSearchTerm('')}
                    title="مسح البحث"
                    initial={{scale: 0, opacity: 0}}
                    animate={{scale: 1, opacity: 1}}
                    exit={{scale: 0, opacity: 0}}
                    whileHover={{scale: 1.1, rotate: 90}}
                    whileTap={{scale: 0.9}}
                    style={{
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    ×
                  </motion.button>
                )}
              </motion.div>
              
              <motion.button 
                className="close-search-btn"
                onClick={() => {
                  setShowSearch(false)
                  setSearchTerm('')
                }}
                title="إغلاق البحث"
                whileHover={{scale: 1.1, rotate: 90}}
                whileTap={{scale: 0.9}}
                style={{
                  background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(107, 114, 128, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                ✕
              </motion.button>
            </div>
            
            {searchTerm && (
              <motion.div 
                className="search-results-info"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.3, delay: 0.2}}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  marginTop: '12px',
                  padding: '8px 16px',
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <motion.span 
                  className="results-count"
                  style={{
                    background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(18, 140, 126, 0.3)'
                  }}
                >
                  {filteredMessages.length} نتيجة
                </motion.span>
                <span 
                  className="search-term"
                  style={{
                    color: '#4a5568',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  لـ "{searchTerm}"
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <motion.div 
        className="messages-container whatsapp-messages"
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration:0.8, delay:0.2}}
        style={{
          flex: 1,
          background: '#e5ddd5',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="messages-list" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
          {filteredMessages.length === 0 ? (
            <div className="empty-state" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666',
              textAlign: 'center'
            }}>
              <div className="empty-animation" style={{marginBottom: '20px'}}>
                <FaComments style={{fontSize: '48px', color: '#128c7e'}} />
              </div>
              <h3 style={{margin: '0 0 8px 0', fontSize: '18px'}}>لا توجد رسائل بعد</h3>
              <p style={{margin: 0, fontSize: '14px'}}>ابدأ المحادثة بإرسال رسالة</p>
            </div>
          ) : (
            filteredMessages.map((message, idx) => {
              // Determine if message is from current user
              const currentUserId = session?.userId
              const isCurrentUser = message.sender_id === currentUserId
              
              return (
                <motion.div 
                  key={message.id} 
                  className={`message-wrapper ${isCurrentUser ? 'current-user' : 'other-user'}`}
                  initial={{opacity:0, y:20}} 
                  animate={{opacity:1, y:0}} 
                  transition={{duration:0.5, delay:idx*0.1}}
                  style={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    marginBottom: '8px'
                  }}
                >
                  <motion.div 
                    className={`message ${isCurrentUser ? 'sent' : 'received'} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                    initial={{opacity:0, y:20, x: isCurrentUser ? 20 : -20}} 
                    animate={{opacity:1, y:0, x: 0}} 
                    transition={{duration:0.5, delay:idx*0.1}}
                    whileHover={{scale:1.02, y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.2)'}}
                    onClick={() => setSelectedMessage(message)}
                    style={{
                      maxWidth: '75%',
                      padding: '16px 20px',
                      borderRadius: isCurrentUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                      // Softer green for sent, warmer beige for received
                      background: isCurrentUser 
                        ? 'linear-gradient(135deg, #d7f5cd 0%, #c8f0c0 100%)' 
                        : 'linear-gradient(135deg, #f5efe6 0%, #f0e6d2 100%)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      position: 'relative',
                      wordWrap: 'break-word',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                      transform: 'translateY(0)',
                      opacity: 1
                    }}
                  >
                <div className="message-content" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0, color: '#1f2937' }}>
                  <div className="message-header">
                    <div className="sender-info">
                      <div className="sender-details">
                        <span className="sender-name" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: '600',
                          fontSize: '15px',
                          marginBottom: '8px'
                        }}>
                          <span style={{color: '#1a202c', fontWeight: '700'}}>
                            {getSenderName(message.sender_type, message.sender_id, message)}
                          </span>
                          {(() => {
                            const roleDisplay = getRoleDisplay(message.sender_type, message.sender_id, message)
                            return (
                              <span className="sender-role" style={{
                                background: `linear-gradient(135deg, ${roleDisplay.color} 0%, ${roleDisplay.color}dd 100%)`,
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.8px',
                                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <span>{roleDisplay.icon}</span>
                                <span>{roleDisplay.name}</span>
                              </span>
                            )
                          })()}
                        </span>
                      </div>
                    </div>
                    <div className="message-meta">
                      <span className="message-time" style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {formatTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  {replyTo && replyTo.id === message.id && (
                    <div className="reply-preview">
                      <FaReply className="reply-icon" />
                      <span>رد على: {message.message.substring(0, 50)}...</span>
                    </div>
                  )}
                  
                  <div className="message-body" style={{
                    marginTop: '12px',
                    fontSize: '16px',
                    lineHeight: '1.6',
                    wordBreak: 'break-word',
                    fontWeight: '500',
                    color: '#1f2937',
                    textAlign: 'right',
                    direction: 'rtl',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {message.messageType === 'file' ? (
                      <div className="file-message" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}>
                        <div className="file-preview" style={{
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }}>
                          {message.fileData?.type?.startsWith('image/') ? (
                            <img 
                              src={message.fileData.url} 
                              alt={message.fileData.name}
                              className="file-image"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '4px'
                              }}
                            />
                          ) : (
                            <div className="file-icon" style={{fontSize: '20px', color: '#128c7e'}}>
                              <FaFileAlt />
                            </div>
                          )}
                        </div>
                        <div className="file-info" style={{flex: 1}}>
                          <p className="file-name" style={{
                            margin: '0 0 4px 0',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>{message.fileData?.name || message.message}</p>
                          <p className="file-size" style={{
                            margin: '0 0 8px 0',
                            fontSize: '12px',
                            color: '#6b7280'
                          }}>
                            {(message.fileData?.size / 1024 / 1024).toFixed(2)} ميجابايت
                          </p>
                          <a 
                            href={message.fileData?.url} 
                            download={message.fileData?.name}
                            className="download-link"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#128c7e',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            <FaDownload /> تحميل
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p style={{
                        margin: 0,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>{message.message}</p>
                    )}
                  </div>
                  
                  
                  {isCurrentUser && (
                    <div className="message-status" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '8px',
                      fontSize: '11px',
                      color: '#6b7280',
                      justifyContent: 'flex-end'
                    }}>
                      <FaCheckCircle className="status-icon" style={{
                        fontSize: '12px',
                        color: '#10b981'
                      }} />
                      <span>تم الإرسال</span>
                    </div>
                  )}
                </div>
                  </motion.div>
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: '#f7efe5',
                borderRadius: '20px 20px 20px 6px',
                maxWidth: '200px',
                marginBottom: '8px'
              }}
            >
              <div className="typing-dots" style={{
                display: 'flex',
                gap: '4px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#128c7e',
                  borderRadius: '50%',
                  animation: 'typing 1.4s infinite ease-in-out'
                }}></span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#128c7e',
                  borderRadius: '50%',
                  animation: 'typing 1.4s infinite ease-in-out 0.2s'
                }}></span>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#128c7e',
                  borderRadius: '50%',
                  animation: 'typing 1.4s infinite ease-in-out 0.4s'
                }}></span>
              </div>
              <span className="typing-text" style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                {typingUsers.length === 1 
                  ? `${typingUsers[0].userName} يكتب...`
                  : `${typingUsers.map(u => u.userName).join(' و ')} يكتبون...`
                }
              </span>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </motion.div>

      {/* Message Input */}
      <motion.div 
        className="message-input-container whatsapp-input"
        initial={{opacity:0, y:20}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8, delay:0.4}}
        style={{
          background: '#efeae5',
          padding: '20px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          width: '100%'
        }}
      >
        {/* Reply Preview */}
        {replyTo && (
          <div className="reply-preview-bar" style={{
            background: '#e7f3ff',
            border: '1px solid #b3d9ff',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: '#0066cc'
          }}>
            <div className="reply-info" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <FaReply />
              <span>رد على: {replyTo.message.substring(0, 50)}...</span>
            </div>
            <button 
              className="cancel-reply"
              onClick={() => setReplyTo(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="input-wrapper" style={{
          display: 'flex',
          alignItems: 'flex-end',
          background: 'white',
          borderRadius: '24px',
          padding: '18px 22px',
          border: newMessage.length > 500 
            ? '2px solid #ef4444' 
            : newMessage.length > 400
            ? '2px solid #f59e0b'
            : '2px solid #e0e0e0',
          gap: '16px',
          boxShadow: newMessage.length > 500 
            ? '0 4px 15px rgba(239, 68, 68, 0.3)'
            : newMessage.length > 400
            ? '0 4px 15px rgba(245, 158, 11, 0.3)'
            : '0 4px 15px rgba(0,0,0,0.1)',
          minHeight: '120px',
          width: '100%',
          transition: 'all 0.3s ease'
        }}>
          <div className="input-tools" style={{display: 'flex', gap: '4px'}}>
            <button 
              className="tool-btn"
              onClick={() => setShowFileUpload(!showFileUpload)}
              title="إرسال ملف"
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f0f0'
                e.target.style.color = '#128c7e'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none'
                e.target.style.color = '#666'
              }}
            >
              <FaFileAlt />
            </button>
            
            <button 
              className="tool-btn"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="إضافة إيموجي"
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f0f0'
                e.target.style.color = '#128c7e'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none'
                e.target.style.color = '#666'
              }}
            >
              <FaSmile />
            </button>
          </div>
          
          <div className="input-field" style={{flex: 1, display: 'flex', alignItems: 'center', width: '100%'}}>
            <textarea
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={handleKeyPress}
              onBlur={handleInputBlur}
              placeholder="اكتب رسالتك هنا... (حد أقصى 500 حرف)"
              className="message-input"
              rows="3"
              maxLength={500}
              style={{
                border: 'none',
                outline: 'none',
                resize: 'none',
                background: 'transparent',
                width: '100%',
                fontSize: '18px',
                lineHeight: '28px',
                maxHeight: '200px',
                fontFamily: 'inherit',
                padding: '12px 0',
                minHeight: '84px'
              }}
            />
            
            <div className="input-actions">
              <motion.button 
                onClick={sendMessage}
                disabled={!newMessage.trim() || isRateLimited || newMessage.length > 500}
                className="send-button modern"
                title={isRateLimited ? "تم تجاوز الحد الأقصى للرسائل" : newMessage.length > 500 ? "الرسالة طويلة جداً" : "إرسال الرسالة"}
                whileHover={newMessage.trim() && !isRateLimited && newMessage.length <= 500 ? {scale: 1.1, rotate: 5} : {}}
                whileTap={newMessage.trim() && !isRateLimited && newMessage.length <= 500 ? {scale: 0.9} : {}}
                style={{
                  background: newMessage.trim() && !isRateLimited && newMessage.length <= 500
                    ? '#128c7e' 
                    : '#ccc',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '14px 20px',
                  minWidth: '120px',
                  height: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: newMessage.trim() && !isRateLimited && newMessage.length <= 500 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  boxShadow: newMessage.trim() && !isRateLimited && newMessage.length <= 500 ? '0 6px 20px rgba(18, 140, 126, 0.4)' : 'none'
                }}
              >
                <FaPaperPlane style={{fontSize: '16px', marginLeft: 8}} />
                <span style={{fontWeight: 600}}>إرسال</span>
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* File Upload */}
        <AnimatePresence>
          {showFileUpload && (
            <motion.div 
              className="file-upload-section"
              initial={{opacity:0, height:0}} 
              animate={{opacity:1, height:'auto'}} 
              exit={{opacity:0, height:0}}
              transition={{duration:0.3}}
            >
              <div className="upload-options">
                <button 
                  className="upload-option"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaImage /> صورة
                </button>
                <button 
                  className="upload-option"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaFileAlt /> ملف
                </button>
                <button 
                  className="upload-option"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaDownload /> من الجهاز
                </button>
              </div>
              
              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${uploadProgress}%`}}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
              
              <div className="upload-info">
                <p>الحد الأقصى: 50 ميجابايت</p>
                <p>الصيغ المدعومة: JPG, PNG, GIF, MP4, PDF, DOC, DOCX</p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                multiple
                style={{display: 'none'}}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div 
              className="emoji-picker"
              initial={{opacity:0, y:20}} 
              animate={{opacity:1, y:0}} 
              exit={{opacity:0, y:20}}
              transition={{duration:0.3}}
            >
              <div className="emoji-grid">
                {emojis.map((emoji, idx) => (
                  <button
                    key={idx}
                    className="emoji-btn"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="input-footer" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.8)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="input-hints" style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span className="hint" style={{
              background: 'linear-gradient(135deg, #128c7e 0%, #0d6b5f 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(18, 140, 126, 0.3)'
            }}>Enter للإرسال (حد أقصى 500 حرف)</span>
            <span className="hint" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(59, 130, 246, 0.3)'
            }}>Shift+Enter للسطر الجديد</span>
            <span className="hint" style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(139, 92, 246, 0.3)'
            }}>Ctrl+K للبحث</span>
            <span className="hint" style={{
              background: newMessage.length > 450 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : newMessage.length > 400
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}>حد الأحرف: {newMessage.length}/500</span>
          </div>
          
          <div className="input-stats" style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span className="char-count" style={{
              background: newMessage.length > 450 
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : newMessage.length > 400
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
            }}>{newMessage.length}/500</span>
            <span className="typing-status" style={{
              background: isTyping 
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : newMessage.length > 500
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}>
              {isTyping ? 'يكتب...' : newMessage.length > 500 ? 'رسالة طويلة!' : 'متاح'}
            </span>
            {isRateLimited && (
              <span className="rate-limit-warning" style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
              }}>
                ⚠️ تم تجاوز الحد الأقصى للرسائل
              </span>
            )}
            <span className="message-count" style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '15px',
              fontSize: '12px',
              fontWeight: '600',
              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)'
            }}>
              {messageCount}/10 رسالة في الدقيقة
            </span>
            {newMessage.length > 500 && (
              <span className="char-limit-warning" style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '15px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)'
              }}>
                ⚠️ تجاوز حد الأحرف!
              </span>
            )}
          </div>
        </div>
      </motion.div>


      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="settings-panel"
            initial={{opacity:0, x:300}} 
            animate={{opacity:1, x:0}} 
            exit={{opacity:0, x:300}}
            transition={{duration:0.3}}
          >
            <div className="settings-header">
              <h3>إعدادات الشات</h3>
              <button 
                className="close-settings"
                onClick={() => setShowSettings(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="settings-content">
              <div className="setting-group">
                <h4>الإشعارات</h4>
                <div className="setting-item">
                  <span>إشعارات الرسائل</span>
                  <button 
                    className={`toggle ${isNotificationsEnabled ? 'on' : 'off'}`}
                    onClick={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>
              </div>
              
              <div className="setting-group">
                <h4>الصوت</h4>
                <div className="setting-item">
                  <span>كتم الصوت</span>
                  <button 
                    className={`toggle ${isMuted ? 'on' : 'off'}`}
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div 
            className="modal-overlay"
            initial={{opacity:0}} 
            animate={{opacity:1}} 
            exit={{opacity:0}}
            onClick={() => setShowReportModal(false)}
          >
            <motion.div 
              className="modal-content report-modal"
              initial={{scale:0.8, opacity:0}} 
              animate={{scale:1, opacity:1}} 
              exit={{scale:0.8, opacity:0}}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>الإبلاغ عن مشكلة</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowReportModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <p>يرجى وصف المشكلة التي تواجهها:</p>
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="اكتب هنا وصف المشكلة..."
                  rows="4"
                  className="report-textarea"
                />
              </div>
              
              <div className="modal-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowReportModal(false)}
                >
                  إلغاء
                </button>
                <button 
                  className="submit-btn"
                  onClick={handleReport}
                  disabled={!reportReason.trim()}
                >
                  إرسال البلاغ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>تسجيل الدخول</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowLoginModal(false)}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label>اسم المستخدم</label>
                  <input
                    type="text"
                    value={loginData.nickname}
                    onChange={(e) => setLoginData({...loginData, nickname: e.target.value})}
                    placeholder="أدخل اسم المستخدم"
                    required
                    minLength={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>اختر دورك</label>
                  <select
                    value={loginData.userRole}
                    onChange={(e) => setLoginData({...loginData, userRole: e.target.value})}
                    required
                  >
                    <option value="">اختر دورك</option>
                    <option value="buyer">مشتري</option>
                    <option value="seller">بائع</option>
                  </select>
                </div>
                
                <button type="submit" className="submit-btn">
                  تسجيل الدخول
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Notifications */}
      {notifications.map(notification => (
        <SmartNotification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}
