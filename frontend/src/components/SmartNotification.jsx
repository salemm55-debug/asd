import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaBell } from 'react-icons/fa'

const SmartNotification = ({ 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose,
  show = true 
}) => {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />
      default:
        return <FaInfoCircle className="text-blue-500" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: '#10b981',
          text: 'white'
        }
      case 'error':
        return {
          bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: '#ef4444',
          text: 'white'
        }
      case 'warning':
        return {
          bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          border: '#f59e0b',
          text: 'white'
        }
      default:
        return {
          bg: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          border: '#3b82f6',
          text: 'white'
        }
    }
  }

  const colors = getColors()

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed top-4 right-4 z-50 max-w-sm w-full"
        style={{
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className="text-sm font-semibold mb-1" style={{ color: colors.text }}>
                  {title}
                </h4>
              )}
              <p className="text-sm opacity-90" style={{ color: colors.text }}>
                {message}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false)
                if (onClose) onClose()
              }}
              className="flex-shrink-0 p-1 rounded-full transition-colors"
              style={{ 
                color: colors.text,
                background: 'rgba(255,255,255,0.12)',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaTimes className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <motion.div
            className="h-1 bg-white bg-opacity-30"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default SmartNotification
