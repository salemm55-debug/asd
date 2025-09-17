// Smart Performance Optimization System
class PerformanceOptimizer {
  constructor() {
    this.observers = new Map()
    this.metrics = new Map()
    this.cache = new Map()
    this.requestQueue = new Map()
    this.thresholds = {
      fcp: 1800, // First Contentful Paint
      lcp: 2500, // Largest Contentful Paint
      fid: 100,  // First Input Delay
      cls: 0.1,  // Cumulative Layout Shift
      ttfb: 600  // Time to First Byte
    }
    
    this.setupPerformanceObserver()
    this.setupResourceOptimization()
    this.setupAPIOptimization()
    this.setupSmartCaching()
  }

  setupPerformanceObserver() {
    // Observe Core Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach(entry => {
            this.metrics.set('fcp', entry.startTime)
            this.checkThreshold('fcp', entry.startTime)
          })
        })
        fcpObserver.observe({ entryTypes: ['paint'] })
        this.observers.set('fcp', fcpObserver)
      } catch (error) {
        console.warn('FCP observer setup failed:', error)
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          this.metrics.set('lcp', lastEntry.startTime)
          this.checkThreshold('lcp', lastEntry.startTime)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.set('lcp', lcpObserver)
      } catch (error) {
        console.warn('LCP observer setup failed:', error)
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach(entry => {
            this.metrics.set('fid', entry.processingStart - entry.startTime)
            this.checkThreshold('fid', entry.processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.set('fid', fidObserver)
      } catch (error) {
        console.warn('FID observer setup failed:', error)
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0
          const entries = list.getEntries()
          entries.forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          this.metrics.set('cls', clsValue)
          this.checkThreshold('cls', clsValue)
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.set('cls', clsObserver)
      } catch (error) {
        console.warn('CLS observer setup failed:', error)
      }
    }
  }

  setupResourceOptimization() {
    // Lazy load images
    this.setupLazyLoading()
    
    // Preload critical resources
    this.preloadCriticalResources()
    
    // Optimize images
    this.optimizeImages()
    
    // Setup service worker for caching
    this.setupServiceWorker()
  }

  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.removeAttribute('data-src')
              imageObserver.unobserve(img)
            }
          }
        })
      })

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img)
      })
    }
  }

  preloadCriticalResources() {
    // Preload critical CSS
    const criticalCSS = document.querySelector('link[rel="preload"][as="style"]')
    if (criticalCSS) {
      criticalCSS.onload = () => {
        criticalCSS.rel = 'stylesheet'
      }
    }

    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ]
    
    criticalFonts.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = font
      link.onload = () => {
        link.rel = 'stylesheet'
      }
      document.head.appendChild(link)
    })
  }

  optimizeImages() {
    // Convert images to WebP if supported
    if (this.supportsWebP()) {
      document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]').forEach(img => {
        const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/, '.webp')
        const webpImg = new Image()
        webpImg.onload = () => {
          img.src = webpSrc
        }
        webpImg.src = webpSrc
      })
    }
  }

  supportsWebP() {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)
        })
        .catch(error => {
          console.warn('Service Worker registration failed:', error)
        })
    }
  }

  checkThreshold(metric, value) {
    const threshold = this.thresholds[metric]
    if (threshold && value > threshold) {
      console.warn(`Performance warning: ${metric} is ${value}ms, threshold is ${threshold}ms`)
      this.triggerOptimization(metric, value)
    }
  }

  triggerOptimization(metric, value) {
    switch (metric) {
      case 'fcp':
      case 'lcp':
        this.optimizeRendering()
        break
      case 'fid':
        this.optimizeInteractions()
        break
      case 'cls':
        this.optimizeLayout()
        break
    }
  }

  optimizeRendering() {
    // Reduce animations for better performance
    document.body.style.setProperty('--animation-duration', '0.1s')
    
    // Use will-change for animated elements
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.style.willChange = 'transform, opacity'
    })
  }

  optimizeInteractions() {
    // Debounce scroll events
    let scrollTimeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        // Handle scroll
      }, 16) // ~60fps
    })

    // Use passive event listeners
    window.addEventListener('touchstart', () => {}, { passive: true })
    window.addEventListener('touchmove', () => {}, { passive: true })
  }

  optimizeLayout() {
    // Add explicit dimensions to images
    document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
      img.style.aspectRatio = '16/9'
    })
  }

  // Memory management
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers.clear()
    this.metrics.clear()
  }

  // API Optimization Methods
  setupAPIOptimization() {
    this.setupRequestBatching()
    this.setupRequestDeduplication()
    this.setupRequestCaching()
    this.setupRequestRetry()
  }

  setupRequestBatching() {
    // Batch multiple API requests into single requests
    this.batchRequests = new Map()
    this.batchTimeout = 100 // ms
  }

  setupRequestDeduplication() {
    // Prevent duplicate requests
    this.pendingRequests = new Map()
  }

  setupRequestCaching() {
    // Cache API responses
    this.apiCache = new Map()
    this.cacheExpiry = 5 * 60 * 1000 // 5 minutes
  }

  setupRequestRetry() {
    // Retry failed requests with exponential backoff
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000
    }
  }

  setupSmartCaching() {
    // Smart caching with LRU eviction
    this.maxCacheSize = 100
    this.cacheOrder = []
  }

  // Optimized API request method
  async optimizedRequest(url, options = {}) {
    const cacheKey = this.generateCacheKey(url, options)
    
    // Check cache first
    if (this.apiCache.has(cacheKey)) {
      const cached = this.apiCache.get(cacheKey)
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data
      } else {
        this.apiCache.delete(cacheKey)
      }
    }

    // Check for pending identical requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)
    }

    // Create new request
    const requestPromise = this.makeRequest(url, options)
    this.pendingRequests.set(cacheKey, requestPromise)

    try {
      const result = await requestPromise
      
      // Cache successful response
      this.cacheResponse(cacheKey, result)
      
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }

  generateCacheKey(url, options) {
    const method = options.method || 'GET'
    const body = options.body ? JSON.stringify(options.body) : ''
    return `${method}:${url}:${body}`
  }

  async makeRequest(url, options) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        // Try to get more specific error information
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch (parseError) {
          // If we can't parse the error response, use the status text
        }
        
        throw new Error(errorMessage);
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      // Provide more specific error messages
      if (error.name === 'AbortError') {
        throw new Error('انتهت مهلة الاتصال، حاول مرة أخرى');
      } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('خطأ في الاتصال بالخادم، تحقق من اتصالك بالإنترنت');
      } else if (error.message.includes('NetworkError')) {
        throw new Error('خطأ في الشبكة، تحقق من اتصالك بالإنترنت');
      }
      
      throw error;
    }
  }

  cacheResponse(key, data) {
    // LRU cache implementation
    if (this.apiCache.size >= this.maxCacheSize) {
      const oldestKey = this.cacheOrder.shift()
      this.apiCache.delete(oldestKey)
    }

    this.apiCache.set(key, {
      data,
      timestamp: Date.now()
    })
    this.cacheOrder.push(key)
  }

  // Batch multiple requests
  batchRequest(requests) {
    return new Promise((resolve) => {
      const batchId = Date.now().toString()
      this.batchRequests.set(batchId, requests)

      setTimeout(() => {
        const batchedRequests = this.batchRequests.get(batchId)
        this.batchRequests.delete(batchId)
        
        // Execute batched requests
        this.executeBatchedRequests(batchedRequests).then(resolve)
      }, this.batchTimeout)
    })
  }

  async executeBatchedRequests(requests) {
    const promises = requests.map(req => this.optimizedRequest(req.url, req.options))
    return Promise.allSettled(promises)
  }

  // Smart prefetching
  prefetchCriticalResources() {
    const criticalUrls = [
      '/api/admin/stats',
      '/api/admin/tickets',
      '/api/brokers'
    ]

    criticalUrls.forEach(url => {
      this.optimizedRequest(url).catch(() => {
        // Silently fail prefetch
      })
    })
  }

  // Connection-aware loading
  setupConnectionAwareLoading() {
    if ('connection' in navigator) {
      const connection = navigator.connection
      
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Reduce quality for slow connections
        this.enableLowQualityMode()
      } else if (connection.effectiveType === '4g') {
        // Enable high quality for fast connections
        this.enableHighQualityMode()
      }
    }
  }

  enableLowQualityMode() {
    // Reduce image quality
    document.documentElement.style.setProperty('--image-quality', '0.7')
    
    // Disable animations
    document.documentElement.style.setProperty('--animation-duration', '0s')
    
    // Reduce polling frequency
    this.setPollingInterval(30000) // 30 seconds
  }

  enableHighQualityMode() {
    // Restore full quality
    document.documentElement.style.setProperty('--image-quality', '1')
    document.documentElement.style.setProperty('--animation-duration', '0.3s')
    
    // Increase polling frequency
    this.setPollingInterval(5000) // 5 seconds
  }

  setPollingInterval(interval) {
    // Update polling intervals for real-time features
    window.dispatchEvent(new CustomEvent('updatePollingInterval', { 
      detail: { interval } 
    }))
  }

  // Memory optimization
  optimizeMemory() {
    // Clear old cache entries
    const now = Date.now()
    for (const [key, value] of this.apiCache.entries()) {
      if (now - value.timestamp > this.cacheExpiry) {
        this.apiCache.delete(key)
      }
    }

    // Clear old metrics
    if (this.metrics.size > 100) {
      const entries = Array.from(this.metrics.entries())
      this.metrics.clear()
      entries.slice(-50).forEach(([key, value]) => {
        this.metrics.set(key, value)
      })
    }
  }

  // Get performance metrics
  getMetrics() {
    return {
      ...Object.fromEntries(this.metrics),
      navigation: performance.getEntriesByType('navigation')[0],
      memory: performance.memory ? {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      } : null,
      cache: {
        size: this.apiCache.size,
        hitRate: this.calculateCacheHitRate()
      }
    }
  }

  calculateCacheHitRate() {
    // Simple hit rate calculation
    const totalRequests = this.metrics.get('totalRequests') || 0
    const cacheHits = this.metrics.get('cacheHits') || 0
    return totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0
  }

  // Performance budget checker
  checkBudget() {
    const budget = {
      js: 250000, // 250KB
      css: 100000, // 100KB
      images: 1000000, // 1MB
      fonts: 100000 // 100KB
    }

    const resources = performance.getEntriesByType('resource')
    const usage = {
      js: 0,
      css: 0,
      images: 0,
      fonts: 0
    }

    resources.forEach(resource => {
      const size = resource.transferSize || 0
      if (resource.name.endsWith('.js')) usage.js += size
      else if (resource.name.endsWith('.css')) usage.css += size
      else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp)$/)) usage.images += size
      else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) usage.fonts += size
    })

    Object.keys(budget).forEach(type => {
      if (usage[type] > budget[type]) {
        console.warn(`Performance budget exceeded for ${type}: ${usage[type]} > ${budget[type]}`)
      }
    })

    return { budget, usage }
  }
}

// Create global instance
const performanceOptimizer = new PerformanceOptimizer()

export default performanceOptimizer

// Helper functions
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const requestIdleCallback = (callback, options = {}) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options)
  } else {
    return setTimeout(callback, 1)
  }
}

export const cancelIdleCallback = (id) => {
  if ('cancelIdleCallback' in window) {
    return window.cancelIdleCallback(id)
  } else {
    return clearTimeout(id)
  }
}
