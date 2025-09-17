// Smart Caching System with Intelligent Invalidation
class SmartCache {
  constructor(options = {}) {
    this.cache = new Map()
    this.metadata = new Map()
    this.options = {
      maxSize: 100,
      ttl: 5 * 60 * 1000, // 5 minutes
      strategy: 'lru', // lru, lfu, fifo
      compression: false,
      encryption: false,
      ...options
    }
    
    this.accessCount = new Map()
    this.lastAccess = new Map()
    this.setupCleanup()
  }

  // Set cache entry with metadata
  set(key, value, options = {}) {
    const entry = {
      value: this.compress(value),
      timestamp: Date.now(),
      ttl: options.ttl || this.options.ttl,
      accessCount: 0,
      lastAccess: Date.now(),
      tags: options.tags || [],
      priority: options.priority || 0
    }

    this.cache.set(key, entry)
    this.metadata.set(key, {
      size: this.calculateSize(value),
      tags: entry.tags,
      priority: entry.priority
    })

    // Check if we need to evict
    if (this.cache.size > this.options.maxSize) {
      this.evict()
    }

    return true
  }

  // Get cache entry with intelligent retrieval
  get(key, options = {}) {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return options.defaultValue || null
    }

    // Check TTL
    if (this.isExpired(entry)) {
      this.delete(key)
      return options.defaultValue || null
    }

    // Update access metadata
    entry.accessCount++
    entry.lastAccess = Date.now()
    this.accessCount.set(key, entry.accessCount)
    this.lastAccess.set(key, entry.lastAccess)

    return this.decompress(entry.value)
  }

  // Check if entry exists and is valid
  has(key) {
    const entry = this.cache.get(key)
    if (!entry) return false
    
    if (this.isExpired(entry)) {
      this.delete(key)
      return false
    }
    
    return true
  }

  // Delete cache entry
  delete(key) {
    this.cache.delete(key)
    this.metadata.delete(key)
    this.accessCount.delete(key)
    this.lastAccess.delete(key)
    return true
  }

  // Clear all cache entries
  clear() {
    this.cache.clear()
    this.metadata.clear()
    this.accessCount.clear()
    this.lastAccess.clear()
  }

  // Invalidate by tags
  invalidateByTags(tags) {
    const keysToDelete = []
    
    this.metadata.forEach((metadata, key) => {
      if (metadata.tags.some(tag => tags.includes(tag))) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => this.delete(key))
    return keysToDelete.length
  }

  // Invalidate by pattern
  invalidateByPattern(pattern) {
    const regex = new RegExp(pattern)
    const keysToDelete = []
    
    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => this.delete(key))
    return keysToDelete.length
  }

  // Get cache statistics
  getStats() {
    const totalSize = Array.from(this.metadata.values())
      .reduce((sum, meta) => sum + meta.size, 0)
    
    const hitRate = this.calculateHitRate()
    
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize,
      totalSize,
      hitRate,
      strategy: this.options.strategy,
      oldestEntry: this.getOldestEntry(),
      newestEntry: this.getNewestEntry()
    }
  }

  // Get cache entries by tags
  getByTags(tags) {
    const results = []
    
    this.metadata.forEach((metadata, key) => {
      if (metadata.tags.some(tag => tags.includes(tag))) {
        const value = this.get(key)
        if (value !== null) {
          results.push({ key, value, metadata })
        }
      }
    })
    
    return results
  }

  // Warm up cache with data
  warmUp(data) {
    Object.entries(data).forEach(([key, value]) => {
      this.set(key, value, { priority: 1 })
    })
  }

  // Preload data
  async preload(keys, loader) {
    const promises = keys.map(async key => {
      if (!this.has(key)) {
        try {
          const value = await loader(key)
          this.set(key, value, { priority: 1 })
        } catch (error) {
          console.warn(`Failed to preload ${key}:`, error)
        }
      }
    })
    
    await Promise.all(promises)
  }

  // Check if entry is expired
  isExpired(entry) {
    return Date.now() - entry.timestamp > entry.ttl
  }

  // Calculate size of value
  calculateSize(value) {
    return JSON.stringify(value).length * 2 // Rough estimate
  }

  // Compress value if enabled
  compress(value) {
    if (this.options.compression) {
      // Simple compression - in real app, use proper compression
      return JSON.stringify(value)
    }
    return value
  }

  // Decompress value if enabled
  decompress(value) {
    if (this.options.compression) {
      try {
        return JSON.parse(value)
      } catch (error) {
        return value
      }
    }
    return value
  }

  // Evict entries based on strategy
  evict() {
    const entries = Array.from(this.cache.entries())
    
    switch (this.options.strategy) {
      case 'lru':
        this.evictLRU(entries)
        break
      case 'lfu':
        this.evictLFU(entries)
        break
      case 'fifo':
        this.evictFIFO(entries)
        break
      default:
        this.evictLRU(entries)
    }
  }

  // Evict Least Recently Used
  evictLRU(entries) {
    entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess)
    const toEvict = entries.slice(0, Math.floor(this.options.maxSize * 0.1))
    toEvict.forEach(([key]) => this.delete(key))
  }

  // Evict Least Frequently Used
  evictLFU(entries) {
    entries.sort((a, b) => a[1].accessCount - b[1].accessCount)
    const toEvict = entries.slice(0, Math.floor(this.options.maxSize * 0.1))
    toEvict.forEach(([key]) => this.delete(key))
  }

  // Evict First In First Out
  evictFIFO(entries) {
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    const toEvict = entries.slice(0, Math.floor(this.options.maxSize * 0.1))
    toEvict.forEach(([key]) => this.delete(key))
  }

  // Calculate hit rate
  calculateHitRate() {
    const totalAccess = Array.from(this.accessCount.values())
      .reduce((sum, count) => sum + count, 0)
    
    return totalAccess > 0 ? (this.cache.size / totalAccess) * 100 : 0
  }

  // Get oldest entry
  getOldestEntry() {
    let oldest = null
    let oldestTime = Infinity
    
    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldest = key
      }
    })
    
    return oldest
  }

  // Get newest entry
  getNewestEntry() {
    let newest = null
    let newestTime = 0
    
    this.cache.forEach((entry, key) => {
      if (entry.timestamp > newestTime) {
        newestTime = entry.timestamp
        newest = key
      }
    })
    
    return newest
  }

  // Setup cleanup interval
  setupCleanup() {
    setInterval(() => {
      this.cleanup()
    }, 60000) // Cleanup every minute
  }

  // Cleanup expired entries
  cleanup() {
    const expiredKeys = []
    
    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        expiredKeys.push(key)
      }
    })
    
    expiredKeys.forEach(key => this.delete(key))
    
    if (expiredKeys.length > 0) {
      console.log(`Cleaned up ${expiredKeys.length} expired cache entries`)
    }
  }

  // Export cache data
  export() {
    const data = {}
    this.cache.forEach((entry, key) => {
      data[key] = {
        value: entry.value,
        timestamp: entry.timestamp,
        ttl: entry.ttl,
        accessCount: entry.accessCount,
        lastAccess: entry.lastAccess,
        tags: entry.tags,
        priority: entry.priority
      }
    })
    return data
  }

  // Import cache data
  import(data) {
    Object.entries(data).forEach(([key, entry]) => {
      this.cache.set(key, entry)
      this.metadata.set(key, {
        size: this.calculateSize(entry.value),
        tags: entry.tags,
        priority: entry.priority
      })
    })
  }
}

// Create global cache instance
const smartCache = new SmartCache({
  maxSize: 200,
  ttl: 10 * 60 * 1000, // 10 minutes
  strategy: 'lru',
  compression: true
})

export default smartCache

// Helper functions for common caching patterns
export const cacheWithFallback = async (key, fallback, options = {}) => {
  const cached = smartCache.get(key)
  if (cached !== null) {
    return cached
  }
  
  const value = await fallback()
  smartCache.set(key, value, options)
  return value
}

export const cacheWithTTL = (key, value, ttl) => {
  return smartCache.set(key, value, { ttl })
}

export const cacheWithTags = (key, value, tags) => {
  return smartCache.set(key, value, { tags })
}

export const invalidateByTags = (tags) => {
  return smartCache.invalidateByTags(tags)
}

export const preloadData = async (keys, loader) => {
  return smartCache.preload(keys, loader)
}
