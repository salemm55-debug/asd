import { useState, useEffect, useCallback } from 'react'

// Hook لإدارة الجلسات
export const useSession = () => {
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // إنشاء جلسة جديدة
  const createSession = useCallback(async (nickname, userRole = null, ticketId = null) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname,
          user_role: userRole,
          ticket_id: ticketId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل في إنشاء الجلسة')
      }

      // حفظ الجلسة في localStorage
      localStorage.setItem('sessionId', data.sessionId)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('nickname', data.nickname)
      localStorage.setItem('userRole', data.sessionData.userRole || '')
      localStorage.setItem('sessionData', JSON.stringify(data.sessionData))

      setSession(data.sessionData)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  // تحديث الجلسة
  const updateSession = useCallback(async (sessionData) => {
    try {
      if (!session?.userId) {
        throw new Error('لا توجد جلسة نشطة')
      }

      const response = await fetch('/api/sessions/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: session.userId,
          session_data: sessionData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'فشل في تحديث الجلسة')
      }

      // تحديث الجلسة المحلية
      const updatedSession = { ...session, ...sessionData }
      setSession(updatedSession)
      localStorage.setItem('sessionData', JSON.stringify(updatedSession))

      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [session])

  // التحقق من صحة الجلسة
  const validateSession = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId')
      const sessionId = localStorage.getItem('sessionId')

      if (!userId) {
        return false
      }

      const response = await fetch('/api/sessions/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          session_id: sessionId
        })
      })

      const data = await response.json()

      if (response.ok && data.valid) {
        setSession(data.sessionData)
        localStorage.setItem('sessionData', JSON.stringify(data.sessionData))
        return true
      } else {
        // الجلسة غير صالحة، مسح البيانات المحلية
        clearSession()
        return false
      }
    } catch (err) {
      console.error('خطأ في التحقق من الجلسة:', err)
      clearSession()
      return false
    }
  }, [])

  // إنهاء الجلسة
  const endSession = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId')
      const nickname = localStorage.getItem('nickname')

      if (userId) {
        await fetch('/api/users/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            nickname: nickname
          })
        })
      }

      clearSession()
    } catch (err) {
      console.error('خطأ في إنهاء الجلسة:', err)
      clearSession()
    }
  }, [])

  // مسح الجلسة محلياً
  const clearSession = useCallback(() => {
    localStorage.removeItem('sessionId')
    localStorage.removeItem('userId')
    localStorage.removeItem('nickname')
    localStorage.removeItem('userRole')
    localStorage.removeItem('sessionData')
    setSession(null)
    setError(null)
  }, [])

  // تحميل الجلسة عند بدء التطبيق
  useEffect(() => {
    const loadSession = async () => {
      try {
        setIsLoading(true)
        
        // محاولة تحميل الجلسة من localStorage
        const savedSession = localStorage.getItem('sessionData')
        if (savedSession) {
          const sessionData = JSON.parse(savedSession)
          setSession(sessionData)
          
          // التحقق من صحة الجلسة مع الخادم
          const isValid = await validateSession()
          if (!isValid) {
            setSession(null)
          }
        }
      } catch (err) {
        console.error('خطأ في تحميل الجلسة:', err)
        clearSession()
      } finally {
        setIsLoading(false)
      }
    }

    loadSession()
  }, [validateSession, clearSession])

  // تحديث الجلسة تلقائياً كل 5 دقائق
  useEffect(() => {
    if (!session) return

    const interval = setInterval(async () => {
      try {
        await validateSession()
      } catch (err) {
        console.error('خطأ في تحديث الجلسة:', err)
      }
    }, 5 * 60 * 1000) // 5 دقائق

    return () => clearInterval(interval)
  }, [session, validateSession])

  return {
    session,
    isLoading,
    error,
    createSession,
    updateSession,
    validateSession,
    endSession,
    clearSession,
    isLoggedIn: !!session
  }
}

export default useSession
