import { useState, useEffect, useCallback, useRef } from 'react'
import performanceOptimizer from '../utils/performance'

// Custom hook for optimized API calls
export const useOptimizedAPI = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetch, setLastFetch] = useState(null)
  
  const abortControllerRef = useRef(null)
  const retryCountRef = useRef(0)
  const maxRetries = options.maxRetries || 3

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Prevent duplicate requests
    if (loading && !forceRefresh) return

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    setLoading(true)
    setError(null)

    try {
      abortControllerRef.current = new AbortController()
      
      const result = await performanceOptimizer.optimizedRequest(url, {
        ...options,
        signal: abortControllerRef.current.signal
      })

      setData(result)
      setLastFetch(Date.now())
      retryCountRef.current = 0
    } catch (err) {
      if (err.name === 'AbortError') return
      
      let errorMessage = err.message;
      
      // Provide more specific error messages in Arabic
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'خطأ في الاتصال بالخادم، تحقق من اتصالك بالإنترنت';
      } else if (err.message.includes('404')) {
        errorMessage = 'البيانات المطلوبة غير موجودة';
      } else if (err.message.includes('403')) {
        errorMessage = 'ليس لديك صلاحية للوصول إلى هذه البيانات';
      } else if (err.message.includes('500')) {
        errorMessage = 'خطأ في الخادم، حاول مرة أخرى لاحقاً';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'انتهت مهلة الاتصال، حاول مرة أخرى';
      } else if (err.message.includes('NetworkError')) {
        errorMessage = 'خطأ في الشبكة، تحقق من اتصالك بالإنترنت';
      }
      
      setError(errorMessage);
      
      // Retry with exponential backoff
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 10000)
        
        setTimeout(() => {
          fetchData(forceRefresh)
        }, delay)
      }
    } finally {
      setLoading(false)
    }
  }, [url, JSON.stringify(options), maxRetries])

  // Auto-refresh with smart intervals
  useEffect(() => {
    if (!options.autoRefresh) return

    const interval = options.refreshInterval || 30000
    const intervalId = setInterval(() => {
      fetchData()
    }, interval)

    return () => clearInterval(intervalId)
  }, [fetchData, options.autoRefresh, options.refreshInterval])

  // Listen for connection changes
  useEffect(() => {
    const handleConnectionChange = () => {
      performanceOptimizer.setupConnectionAwareLoading()
    }

    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', handleConnectionChange)
      return () => navigator.connection.removeEventListener('change', handleConnectionChange)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    data,
    loading,
    error,
    lastFetch,
    refetch: () => fetchData(true),
    isStale: lastFetch ? Date.now() - lastFetch > (options.staleTime || 300000) : true
  }
}

// Hook for batched API calls
export const useBatchedAPI = (requests) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBatched = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const results = await performanceOptimizer.batchRequest(requests)
      setData(results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [requests])

  useEffect(() => {
    if (requests.length > 0) {
      fetchBatched()
    }
  }, [fetchBatched])

  return { data, loading, error, refetch: fetchBatched }
}

// Hook for real-time data with WebSocket fallback
export const useRealtimeData = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  
  const wsRef = useRef(null)
  const fallbackIntervalRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)

  const connectWebSocket = useCallback(() => {
    try {
      const wsUrl = url.replace('http', 'ws')
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        setConnected(true)
        setError(null)
      }

      wsRef.current.onmessage = (event) => {
        const newData = JSON.parse(event.data)
        setData(newData)
      }

      wsRef.current.onclose = () => {
        setConnected(false)
        // Attempt to reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket()
        }, 5000)
      }

      wsRef.current.onerror = (err) => {
        setError('WebSocket connection failed')
        setConnected(false)
      }
    } catch (err) {
      setError('WebSocket not supported')
      setConnected(false)
    }
  }, [url])

  const startFallbackPolling = useCallback(() => {
    if (fallbackIntervalRef.current) return

    fallbackIntervalRef.current = setInterval(async () => {
      try {
        const result = await performanceOptimizer.optimizedRequest(url, options)
        setData(result)
      } catch (err) {
        setError(err.message)
      }
    }, options.pollInterval || 10000)
  }, [url, options])

  useEffect(() => {
    // Try WebSocket first
    if ('WebSocket' in window) {
      connectWebSocket()
    } else {
      // Fallback to polling
      startFallbackPolling()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (fallbackIntervalRef.current) {
        clearInterval(fallbackIntervalRef.current)
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connectWebSocket, startFallbackPolling])

  return { data, connected, error }
}

// Hook for prefetching critical data
export const usePrefetch = (urls) => {
  useEffect(() => {
    urls.forEach(url => {
      performanceOptimizer.optimizedRequest(url).catch(() => {
        // Silently fail prefetch
      })
    })
  }, [urls])
}

// Hook for connection-aware loading
export const useConnectionAware = () => {
  const [connectionType, setConnectionType] = useState('unknown')
  const [isSlowConnection, setIsSlowConnection] = useState(false)

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      setConnectionType(connection.effectiveType || 'unknown')
      setIsSlowConnection(
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g'
      )

      const handleChange = () => {
        setConnectionType(connection.effectiveType || 'unknown')
        setIsSlowConnection(
          connection.effectiveType === 'slow-2g' || 
          connection.effectiveType === '2g'
        )
      }

      connection.addEventListener('change', handleChange)
      return () => connection.removeEventListener('change', handleChange)
    }
  }, [])

  return { connectionType, isSlowConnection }
}

// Hook for memory optimization
export const useMemoryOptimization = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      performanceOptimizer.optimizeMemory()
    }, 60000) // Every minute

    return () => clearInterval(interval)
  }, [])

  const getMemoryInfo = useCallback(() => {
    return performanceOptimizer.getMetrics().memory
  }, [])

  return { getMemoryInfo }
}

export default useOptimizedAPI
