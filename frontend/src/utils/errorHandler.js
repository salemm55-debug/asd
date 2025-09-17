// Advanced Error Handling System
class ErrorHandler {
  constructor() {
    this.errors = new Map()
    this.errorCount = 0
    this.maxErrors = 100
    this.setupGlobalErrorHandling()
  }

  setupGlobalErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('Unhandled Promise Rejection', event.reason, 'promise')
      event.preventDefault()
    })

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError('JavaScript Error', event.error, 'javascript', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleError('Resource Loading Error', event.error, 'resource', {
          tagName: event.target.tagName,
          src: event.target.src || event.target.href
        })
      }
    }, true)
  }

  handleError(type, error, category, metadata = {}) {
    const errorId = this.generateErrorId()
    const timestamp = new Date().toISOString()
    
    const errorData = {
      id: errorId,
      type,
      category,
      message: error?.message || String(error),
      stack: error?.stack,
      timestamp,
      metadata,
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // Store error
    this.errors.set(errorId, errorData)
    this.errorCount++

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${type}]`, errorData)
    }

    // Send to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(errorData)
    }

    // Cleanup old errors
    if (this.errorCount > this.maxErrors) {
      this.cleanupOldErrors()
    }

    return errorId
  }

  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  reportError(errorData) {
    // Send to error reporting service
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorData)
    }).catch(() => {
      // Silently fail if error reporting fails
    })
  }

  cleanupOldErrors() {
    const entries = Array.from(this.errors.entries())
    const toDelete = entries.slice(0, entries.length - this.maxErrors)
    
    toDelete.forEach(([id]) => {
      this.errors.delete(id)
    })
    
    this.errorCount = this.errors.size
  }

  getErrors() {
    return Array.from(this.errors.values())
  }

  getErrorCount() {
    return this.errorCount
  }

  clearErrors() {
    this.errors.clear()
    this.errorCount = 0
  }

  // React Error Boundary helper
  static withErrorBoundary(Component, fallback = null) {
    return class extends React.Component {
      constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
      }

      static getDerivedStateFromError(error) {
        return { hasError: true, error }
      }

      componentDidCatch(error, errorInfo) {
        errorHandler.handleError('React Error Boundary', error, 'react', {
          componentStack: errorInfo.componentStack
        })
      }

      render() {
        if (this.state.hasError) {
          return fallback || <div>Something went wrong.</div>
        }

        return <Component {...this.props} />
      }
    }
  }
}

// Create global instance
const errorHandler = new ErrorHandler()

// Error reporting utilities
export const reportError = (error, context = {}) => {
  return errorHandler.handleError('Manual Error Report', error, 'manual', context)
}

export const reportWarning = (message, context = {}) => {
  return errorHandler.handleError('Warning', new Error(message), 'warning', context)
}

export const reportInfo = (message, context = {}) => {
  return errorHandler.handleError('Info', new Error(message), 'info', context)
}

// Performance monitoring
export const monitorPerformance = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'measure') {
        console.log(`${entry.name}: ${entry.duration}ms`)
      }
    })
  })

  observer.observe({ entryTypes: ['measure'] })
}

// Memory monitoring
export const monitorMemory = () => {
  if (performance.memory) {
    const memory = performance.memory
    const used = memory.usedJSHeapSize / 1024 / 1024
    const total = memory.totalJSHeapSize / 1024 / 1024
    const limit = memory.jsHeapSizeLimit / 1024 / 1024

    if (used / limit > 0.8) {
      reportWarning('High memory usage detected', {
        used: `${used.toFixed(2)}MB`,
        total: `${total.toFixed(2)}MB`,
        limit: `${limit.toFixed(2)}MB`
      })
    }
  }
}

// Network monitoring
export const monitorNetwork = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection
    
    connection.addEventListener('change', () => {
      reportInfo('Network connection changed', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      })
    })
  }
}

export default errorHandler
