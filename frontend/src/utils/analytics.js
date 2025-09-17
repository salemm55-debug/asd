// Smart Analytics System
class SmartAnalytics {
  constructor() {
    this.events = []
    this.sessionId = this.generateSessionId()
    this.userId = localStorage.getItem('userId') || 'anonymous'
    this.startTime = Date.now()
    
    // Track page views
    this.trackPageView()
    
    // Track user interactions
    this.setupEventListeners()
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  trackPageView() {
    const pageData = {
      type: 'page_view',
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }
    
    this.events.push(pageData)
    this.sendEvent(pageData)
  }

  trackEvent(eventName, properties = {}) {
    const eventData = {
      type: 'custom_event',
      name: eventName,
      properties: {
        ...properties,
        url: window.location.href,
        path: window.location.pathname
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }
    
    this.events.push(eventData)
    this.sendEvent(eventData)
  }

  trackUserAction(action, target, properties = {}) {
    const actionData = {
      type: 'user_action',
      action,
      target,
      properties: {
        ...properties,
        url: window.location.href,
        path: window.location.pathname
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }
    
    this.events.push(actionData)
    this.sendEvent(actionData)
  }

  trackPerformance(metric, value, properties = {}) {
    const performanceData = {
      type: 'performance',
      metric,
      value,
      properties: {
        ...properties,
        url: window.location.href,
        path: window.location.pathname
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }
    
    this.events.push(performanceData)
    this.sendEvent(performanceData)
  }

  trackError(error, context = {}) {
    const errorData = {
      type: 'error',
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        url: window.location.href,
        path: window.location.pathname
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }
    
    this.events.push(errorData)
    this.sendEvent(errorData)
  }

  setupEventListeners() {
    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a, [role="button"]')
      if (target) {
        this.trackUserAction('click', target.tagName, {
          text: target.textContent?.trim(),
          className: target.className,
          id: target.id
        })
      }
    })

    // Track form submissions
    document.addEventListener('submit', (e) => {
      this.trackUserAction('form_submit', e.target.tagName, {
        formId: e.target.id,
        formClass: e.target.className
      })
    })

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('page_visibility_change', {
        hidden: document.hidden,
        visibilityState: document.visibilityState
      })
    })

    // Track errors
    window.addEventListener('error', (e) => {
      this.trackError(e.error, {
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.trackError(new Error(e.reason), {
        type: 'unhandled_promise_rejection'
      })
    })
  }

  sendEvent(eventData) {
    // Send to server
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    }).catch(error => {
      console.warn('Failed to send analytics event:', error)
      // Store in localStorage for later retry
      this.storeEventForRetry(eventData)
    })
  }

  storeEventForRetry(eventData) {
    try {
      const stored = JSON.parse(localStorage.getItem('analytics_retry') || '[]')
      stored.push(eventData)
      localStorage.setItem('analytics_retry', JSON.stringify(stored.slice(-100))) // Keep last 100 events
    } catch (error) {
      console.warn('Failed to store event for retry:', error)
    }
  }

  retryFailedEvents() {
    try {
      const stored = JSON.parse(localStorage.getItem('analytics_retry') || '[]')
      if (stored.length > 0) {
        stored.forEach(event => this.sendEvent(event))
        localStorage.removeItem('analytics_retry')
      }
    } catch (error) {
      console.warn('Failed to retry events:', error)
    }
  }

  getSessionDuration() {
    return Date.now() - this.startTime
  }

  getEventsByType(type) {
    return this.events.filter(event => event.type === type)
  }

  getEventsByUser(userId) {
    return this.events.filter(event => event.userId === userId)
  }

  getEventsBySession(sessionId) {
    return this.events.filter(event => event.sessionId === sessionId)
  }

  // Export events for analysis
  exportEvents() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      startTime: this.startTime,
      duration: this.getSessionDuration(),
      events: this.events
    }
  }
}

// Create global instance
const analytics = new SmartAnalytics()

// Retry failed events on page load
analytics.retryFailedEvents()

export default analytics

// Helper functions for common tracking
export const trackChatMessage = (messageType, messageLength) => {
  analytics.trackEvent('chat_message', {
    messageType,
    messageLength,
    timestamp: Date.now()
  })
}

export const trackBrokerRequest = (requestData) => {
  analytics.trackEvent('broker_request', {
    category: requestData.category,
    price: requestData.price,
    location: requestData.location,
    userRole: requestData.userRole
  })
}

export const trackPageTime = (pageName, timeSpent) => {
  analytics.trackPerformance('page_time', timeSpent, {
    page: pageName
  })
}

export const trackUserEngagement = (action, details = {}) => {
  analytics.trackUserAction(action, 'user_engagement', details)
}
