// Enhanced Ranks System for Wasitak Platform
// This system provides intelligent role management and user ranking

export const RANK_TIERS = {
  // Transaction Roles - Simplified to Buyer and Seller only
  BUYER: {
    id: 'buyer',
    name: 'مشتري',
    level: 1,
    color: '#F59E0B',
    icon: 'B',
    description: 'دور المشتري في الصفقة',
    requirements: {},
    benefits: ['البحث عن السلع والخدمات', 'التواصل مع البائعين', 'الضمان المالي', 'حماية المشتري']
  },
  
  SELLER: {
    id: 'seller',
    name: 'بائع',
    level: 1,
    color: '#8B5CF6',
    icon: 'S',
    description: 'دور البائع في الصفقة',
    requirements: {},
    benefits: ['عرض السلع والخدمات', 'التواصل مع المشترين', 'حماية البائع', 'إدارة المخزون']
  },
  
  // Broker Role - Special access from admin page
  BROKER: {
    id: 'broker',
    name: 'وسيط',
    level: 2,
    color: '#EF4444',
    icon: 'K',
    description: 'وسيط معتمد في المنصة',
    requirements: { adminAccess: true },
    benefits: ['إدارة الصفقات', 'مراقبة المحادثات', 'حل النزاعات', 'أدوات الوساطة']
  },
  
  // Administrative Tiers
  ADMIN: {
    id: 'admin',
    name: 'مدير',
    level: 3,
    color: '#1F2937',
    icon: 'A',
    description: 'مدير النظام',
    requirements: { adminAppointment: true },
    benefits: ['إدارة كاملة للنظام', 'إحصائيات شاملة', 'أدوات التطوير', 'صلاحيات كاملة']
  }
}

export const ROLE_CATEGORIES = {
  TRANSACTION: ['buyer', 'seller'],
  PROFESSIONAL: ['broker'],
  ADMINISTRATIVE: ['admin']
}

// Calculate user rank based on activity and performance
export const calculateUserRank = (userStats) => {
  const { adminRole = null, brokerAccess = false } = userStats
  
  // Check for administrative roles first
  if (adminRole === 'admin') return RANK_TIERS.ADMIN
  
  // Check for broker access
  if (brokerAccess) return RANK_TIERS.BROKER
  
  // Default to buyer role
  return RANK_TIERS.BUYER
}

// Get role for transaction context
export const getTransactionRole = (userRole, rolesState, userId) => {
  // Check if user is already assigned a role in this transaction
  if (rolesState.buyerId === userId) return RANK_TIERS.BUYER
  if (rolesState.sellerId === userId) return RANK_TIERS.SELLER
  
  // Return user's selected role
  switch (userRole) {
    case 'buyer': return RANK_TIERS.BUYER
    case 'seller': return RANK_TIERS.SELLER
    case 'broker': return RANK_TIERS.BROKER
    default: return RANK_TIERS.BUYER
  }
}

// Get rank display information
export const getRankDisplay = (rank) => {
  // Safety check to prevent undefined errors
  if (!rank) {
    return {
      name: 'مستخدم',
      icon: 'U',
      color: '#6B7280',
      level: 1,
      description: 'مستخدم عادي'
    }
  }
  
  return {
    name: rank.name || 'مستخدم',
    icon: rank.icon || 'U',
    color: rank.color || '#6B7280',
    level: rank.level || 1,
    description: rank.description || 'مستخدم عادي'
  }
}

// Check if user can perform action based on rank
export const canPerformAction = (userRank, action) => {
  const actionRequirements = {
    'create_ticket': { minLevel: 1 },
    'manage_transaction': { minLevel: 2, roles: ['broker'] },
    'moderate_content': { minLevel: 3, roles: ['admin'] },
    'admin_panel': { minLevel: 3, roles: ['admin'] },
    'broker_access': { minLevel: 2, roles: ['broker'] }
  }
  
  const requirement = actionRequirements[action]
  if (!requirement) return false
  
  if (userRank.level < requirement.minLevel) return false
  if (requirement.roles && !requirement.roles.includes(userRank.id)) return false
  
  return true
}

// Get rank progression info
export const getRankProgression = (currentRank, userStats) => {
  const nextTier = Object.values(RANK_TIERS)
    .filter(rank => rank.level > currentRank.level)
    .sort((a, b) => a.level - b.level)[0]
  
  if (!nextTier) return null
  
  const progress = {
    current: currentRank,
    next: nextTier,
    requirements: nextTier.requirements,
    progress: calculateProgress(currentRank, nextTier, userStats)
  }
  
  return progress
}

// Calculate progress towards next rank
const calculateProgress = (currentRank, nextRank, userStats) => {
  const { transactions = 0, rating = 0 } = userStats
  const { requirements } = nextRank
  
  if (!requirements.minTransactions && !requirements.minRating) return 100
  
  let progress = 0
  let totalRequirements = 0
  
  if (requirements.minTransactions) {
    totalRequirements += 1
    progress += Math.min(transactions / requirements.minTransactions, 1)
  }
  
  if (requirements.minRating) {
    totalRequirements += 1
    progress += Math.min(rating / requirements.minRating, 1)
  }
  
  return Math.round((progress / totalRequirements) * 100)
}

// Get rank benefits
export const getRankBenefits = (rank) => {
  return rank.benefits || []
}

// Check if user has specific benefit
export const hasBenefit = (userRank, benefit) => {
  return getRankBenefits(userRank).includes(benefit)
}

// Get all available roles for user
export const getAvailableRoles = (userStats) => {
  const available = []
  
  // All users can be buyers or sellers
  available.push(RANK_TIERS.BUYER, RANK_TIERS.SELLER)
  
  // Check broker eligibility (only from admin page)
  if (userStats.brokerAccess) {
    available.push(RANK_TIERS.BROKER)
  }
  
  return available
}

// Rank comparison
export const compareRanks = (rank1, rank2) => {
  return rank1.level - rank2.level
}

// Get rank hierarchy
export const getRankHierarchy = () => {
  return Object.values(RANK_TIERS).sort((a, b) => a.level - b.level)
}
