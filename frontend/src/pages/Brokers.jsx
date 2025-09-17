import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaShieldAlt, FaHandshake, FaCheckCircle, FaFilter, FaSearch, FaSort } from 'react-icons/fa'

export default function Brokers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showBrokerLinkModal, setShowBrokerLinkModal] = useState(false)
  const [selectedBroker, setSelectedBroker] = useState(null)
  const [brokerLink, setBrokerLink] = useState('')

  const brokers = [
    {
      id: 1,
      name: 'أحمد محمد العتيبي',
      title: 'وسيط عقارات متخصص',
      rating: 4.9,
      reviews: 127,
      location: 'الرياض',
      category: 'real-estate',
      experience: '8 سنوات',
      completedDeals: 245,
      responseTime: 'أقل من ساعة',
      phone: '+966501234567',
      email: 'ahmed@wasitak.com',
      specialties: ['عقارات', 'شقق', 'فلل', 'أراضي'],
      description: 'خبير في العقارات السكنية والتجارية مع خبرة واسعة في السوق السعودي',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية'],
      workingHours: '8:00 ص - 10:00 م',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'فاطمة علي السعيد',
      title: 'وسيط مركبات',
      rating: 4.8,
      reviews: 89,
      location: 'جدة',
      category: 'vehicles',
      experience: '5 سنوات',
      completedDeals: 156,
      responseTime: 'أقل من 30 دقيقة',
      phone: '+966502345678',
      email: 'fatima@wasitak.com',
      specialties: ['سيارات', 'دراجات نارية', 'شاحنات'],
      description: 'متخصصة في بيع وشراء المركبات الجديدة والمستعملة',
      verified: true,
      premium: false,
      languages: ['العربية'],
      workingHours: '9:00 ص - 8:00 م',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'محمد عبدالله القحطاني',
      title: 'وسيط إلكترونيات',
      rating: 4.7,
      reviews: 203,
      location: 'الدمام',
      category: 'electronics',
      experience: '6 سنوات',
      completedDeals: 312,
      responseTime: 'أقل من ساعة',
      phone: '+966503456789',
      email: 'mohammed@wasitak.com',
      specialties: ['هواتف', 'لابتوب', 'أجهزة منزلية'],
      description: 'خبير في الإلكترونيات والتقنية مع معرفة عميقة بالأسواق',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية', 'الأردية'],
      workingHours: '10:00 ص - 9:00 م',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'نورا سعد المطيري',
      title: 'وسيط مجوهرات',
      rating: 4.9,
      reviews: 78,
      location: 'الرياض',
      category: 'jewelry',
      experience: '4 سنوات',
      completedDeals: 98,
      responseTime: 'أقل من ساعتين',
      phone: '+966504567890',
      email: 'nora@wasitak.com',
      specialties: ['ذهب', 'فضة', 'ألماس', 'ساعات'],
      description: 'متخصصة في المجوهرات الثمينة والساعات الفاخرة',
      verified: true,
      premium: false,
      languages: ['العربية', 'الفرنسية'],
      workingHours: '11:00 ص - 7:00 م',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'خالد أحمد الشمري',
      title: 'وسيط عام',
      rating: 4.6,
      reviews: 145,
      location: 'القصيم',
      category: 'general',
      experience: '10 سنوات',
      completedDeals: 423,
      responseTime: 'أقل من ساعة',
      phone: '+966505678901',
      email: 'khalid@wasitak.com',
      specialties: ['عقارات', 'مركبات', 'إلكترونيات', 'عام'],
      description: 'وسيط متعدد التخصصات مع خبرة واسعة في مختلف المجالات',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية'],
      workingHours: '8:00 ص - 11:00 م',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 6,
      name: 'ريم عبدالرحمن الزهراني',
      title: 'وسيط عقارات تجارية',
      rating: 4.8,
      reviews: 92,
      location: 'مكة المكرمة',
      category: 'real-estate',
      experience: '7 سنوات',
      completedDeals: 187,
      responseTime: 'أقل من 45 دقيقة',
      phone: '+966506789012',
      email: 'reem@wasitak.com',
      specialties: ['مكاتب', 'محلات', 'مستودعات', 'عقارات تجارية'],
      description: 'متخصصة في العقارات التجارية والاستثمارية',
      verified: true,
      premium: false,
      languages: ['العربية', 'الإنجليزية'],
      workingHours: '9:00 ص - 8:00 م',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 7,
      name: 'عبدالرحمن سعد الغامدي',
      title: 'وسيط مركبات فاخرة',
      rating: 4.9,
      reviews: 156,
      location: 'الرياض',
      category: 'vehicles',
      experience: '12 سنوات',
      completedDeals: 298,
      responseTime: 'أقل من 20 دقيقة',
      phone: '+966507890123',
      email: 'abdulrahman@wasitak.com',
      specialties: ['سيارات فاخرة', 'مركبات كلاسيكية', 'دراجات نارية'],
      description: 'متخصص في المركبات الفاخرة والكلاسيكية مع شبكة واسعة من العملاء',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية', 'الألمانية'],
      workingHours: '8:00 ص - 10:00 م',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 8,
      name: 'مريم حسن العتيبي',
      title: 'وسيط عقارات سكنية',
      rating: 4.8,
      reviews: 134,
      location: 'الدمام',
      category: 'real-estate',
      experience: '9 سنوات',
      completedDeals: 267,
      responseTime: 'أقل من ساعة',
      phone: '+966508901234',
      email: 'mariam@wasitak.com',
      specialties: ['شقق', 'فلل', 'تاون هاوس', 'استوديوهات'],
      description: 'خبيرة في العقارات السكنية مع معرفة عميقة بأسعار السوق',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية'],
      workingHours: '9:00 ص - 9:00 م',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 9,
      name: 'سعد محمد الحربي',
      title: 'وسيط إلكترونيات متقدم',
      rating: 4.7,
      reviews: 189,
      location: 'جدة',
      category: 'electronics',
      experience: '7 سنوات',
      completedDeals: 345,
      responseTime: 'أقل من 45 دقيقة',
      phone: '+966509012345',
      email: 'saad@wasitak.com',
      specialties: ['أجهزة ذكية', 'ألعاب', 'كاميرات', 'سماعات'],
      description: 'متخصص في الأجهزة الإلكترونية المتقدمة والأجهزة الذكية',
      verified: true,
      premium: false,
      languages: ['العربية', 'الإنجليزية', 'الكورية'],
      workingHours: '10:00 ص - 10:00 م',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 10,
      name: 'هند عبدالله القحطاني',
      title: 'وسيط مجوهرات فاخرة',
      rating: 4.9,
      reviews: 98,
      location: 'الرياض',
      category: 'jewelry',
      experience: '6 سنوات',
      completedDeals: 156,
      responseTime: 'أقل من ساعتين',
      phone: '+966500123456',
      email: 'hind@wasitak.com',
      specialties: ['ألماس', 'زمرد', 'ياقوت', 'مجوهرات مخصصة'],
      description: 'متخصصة في المجوهرات الفاخرة والمجوهرات المخصصة',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
      workingHours: '11:00 ص - 8:00 م',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 11,
      name: 'يوسف أحمد المطيري',
      title: 'وسيط مركبات تجارية',
      rating: 4.6,
      reviews: 167,
      location: 'القصيم',
      category: 'vehicles',
      experience: '8 سنوات',
      completedDeals: 234,
      responseTime: 'أقل من ساعة',
      phone: '+966501234567',
      email: 'youssef@wasitak.com',
      specialties: ['شاحنات', 'حافلات', 'معدات ثقيلة', 'مركبات تجارية'],
      description: 'متخصص في المركبات التجارية والمعدات الثقيلة',
      verified: true,
      premium: false,
      languages: ['العربية', 'الإنجليزية'],
      workingHours: '8:00 ص - 9:00 م',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 12,
      name: 'لينا سعد الشمري',
      title: 'وسيط عقارات استثمارية',
      rating: 4.8,
      reviews: 112,
      location: 'مكة المكرمة',
      category: 'real-estate',
      experience: '11 سنوات',
      completedDeals: 298,
      responseTime: 'أقل من ساعة',
      phone: '+966502345678',
      email: 'lina@wasitak.com',
      specialties: ['عقارات استثمارية', 'مشاريع سكنية', 'أراضي', 'مكاتب'],
      description: 'خبيرة في العقارات الاستثمارية والمشاريع السكنية الكبيرة',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية', 'التركية'],
      workingHours: '9:00 ص - 8:00 م',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 13,
      name: 'عبدالعزيز محمد الزهراني',
      title: 'وسيط إلكترونيات متخصص',
      rating: 4.7,
      reviews: 203,
      location: 'الدمام',
      category: 'electronics',
      experience: '9 سنوات',
      completedDeals: 378,
      responseTime: 'أقل من 30 دقيقة',
      phone: '+966503456789',
      email: 'abdulaziz@wasitak.com',
      specialties: ['أجهزة طبية', 'أجهزة صناعية', 'أنظمة أمنية', 'أتمتة'],
      description: 'متخصص في الأجهزة الطبية والصناعية وأنظمة الأتمتة',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية', 'اليابانية'],
      workingHours: '8:00 ص - 10:00 م',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 14,
      name: 'فايزة علي العتيبي',
      title: 'وسيط مجوهرات تقليدية',
      rating: 4.8,
      reviews: 89,
      location: 'جدة',
      category: 'jewelry',
      experience: '5 سنوات',
      completedDeals: 123,
      responseTime: 'أقل من ساعتين',
      phone: '+966504567890',
      email: 'faiza@wasitak.com',
      specialties: ['مجوهرات تقليدية', 'فضة', 'نحاس', 'أحجار كريمة'],
      description: 'متخصصة في المجوهرات التقليدية والأحجار الكريمة',
      verified: true,
      premium: false,
      languages: ['العربية', 'الأردية'],
      workingHours: '10:00 ص - 7:00 م',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 15,
      name: 'مشعل عبدالرحمن القحطاني',
      title: 'وسيط مركبات كلاسيكية',
      rating: 4.9,
      reviews: 145,
      location: 'الرياض',
      category: 'vehicles',
      experience: '13 سنوات',
      completedDeals: 267,
      responseTime: 'أقل من ساعة',
      phone: '+966505678901',
      email: 'mishal@wasitak.com',
      specialties: ['سيارات كلاسيكية', 'مركبات نادرة', 'مركبات ترميم', 'قطع غيار'],
      description: 'خبير في المركبات الكلاسيكية والنادرة مع خبرة في الترميم',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية', 'الإيطالية'],
      workingHours: '9:00 ص - 9:00 م',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 16,
      name: 'نورا خالد المطيري',
      title: 'وسيط عقارات شاطئية',
      rating: 4.8,
      reviews: 134,
      location: 'الدمام',
      category: 'real-estate',
      experience: '6 سنوات',
      completedDeals: 189,
      responseTime: 'أقل من 45 دقيقة',
      phone: '+966506789012',
      email: 'nora.k@wasitak.com',
      specialties: ['عقارات شاطئية', 'شاليهات', 'فلل بحرية', 'منتجعات'],
      description: 'متخصصة في العقارات الشاطئية والمنتجعات السياحية',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية', 'الفرنسية'],
      workingHours: '10:00 ص - 8:00 م',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 17,
      name: 'بدر سعد الغامدي',
      title: 'وسيط إلكترونيات منزلية',
      rating: 4.6,
      reviews: 178,
      location: 'القصيم',
      category: 'electronics',
      experience: '7 سنوات',
      completedDeals: 312,
      responseTime: 'أقل من ساعة',
      phone: '+966507890123',
      email: 'badr@wasitak.com',
      specialties: ['أجهزة منزلية', 'تكييف', 'تلفزيونات', 'أجهزة مطبخ'],
      description: 'متخصص في الأجهزة المنزلية وأجهزة التكييف',
      verified: true,
      premium: false,
      languages: ['العربية', 'الإنجليزية'],
      workingHours: '8:00 ص - 10:00 م',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 18,
      name: 'ريماز أحمد الحربي',
      title: 'وسيط مجوهرات عصرية',
      rating: 4.7,
      reviews: 156,
      location: 'جدة',
      category: 'jewelry',
      experience: '8 سنوات',
      completedDeals: 234,
      responseTime: 'أقل من ساعتين',
      phone: '+966508901234',
      email: 'reemaz@wasitak.com',
      specialties: ['مجوهرات عصرية', 'ساعات ذكية', 'إكسسوارات', 'مجوهرات رجالية'],
      description: 'متخصصة في المجوهرات العصرية والساعات الذكية',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية', 'الكورية'],
      workingHours: '11:00 ص - 9:00 م',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 19,
      name: 'عبدالله محمد العتيبي',
      title: 'وسيط مركبات كهربائية',
      rating: 4.8,
      reviews: 123,
      location: 'الرياض',
      category: 'vehicles',
      experience: '4 سنوات',
      completedDeals: 167,
      responseTime: 'أقل من 30 دقيقة',
      phone: '+966509012345',
      email: 'abdullah@wasitak.com',
      specialties: ['سيارات كهربائية', 'هجينة', 'دراجات كهربائية', 'شحن'],
      description: 'متخصص في المركبات الكهربائية والهجينة',
      verified: true,
      premium: true,
      languages: ['العربية', 'الإنجليزية', 'الصينية'],
      workingHours: '9:00 ص - 8:00 م',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 20,
      name: 'سارة عبدالرحمن الزهراني',
      title: 'وسيط عقارات زراعية',
      rating: 4.7,
      reviews: 98,
      location: 'مكة المكرمة',
      category: 'real-estate',
      experience: '9 سنوات',
      completedDeals: 189,
      responseTime: 'أقل من ساعة',
      phone: '+966500123456',
      email: 'sara@wasitak.com',
      specialties: ['أراضي زراعية', 'مزارع', 'بيوت بلاستيكية', 'معدات زراعية'],
      description: 'متخصصة في العقارات الزراعية والمزارع',
      verified: true,
      premium: false,
      languages: ['العربية', 'الإنجليزية'],
      workingHours: '8:00 ص - 7:00 م',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    }
  ]

  const filteredBrokers = brokers.filter(broker => {
    const matchesSearch = broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         broker.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || broker.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const sortedBrokers = [...filteredBrokers].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience)
    if (sortBy === 'deals') return b.completedDeals - a.completedDeals
    return 0
  })

  const categories = [
    { value: 'all', label: 'جميع التخصصات' },
    { value: 'real-estate', label: 'العقارات' },
    { value: 'vehicles', label: 'المركبات' },
    { value: 'electronics', label: 'الإلكترونيات' },
    { value: 'jewelry', label: 'المجوهرات' },
    { value: 'general', label: 'عام' }
  ]

  const stats = {
    totalBrokers: brokers.length,
    premiumBrokers: brokers.filter(b => b.premium).length,
    verifiedBrokers: brokers.filter(b => b.verified).length,
    averageRating: (brokers.reduce((sum, b) => sum + b.rating, 0) / brokers.length).toFixed(1),
    totalDeals: brokers.reduce((sum, b) => sum + b.completedDeals, 0),
    totalReviews: brokers.reduce((sum, b) => sum + b.reviews, 0)
  }

  // Generate broker link
  const generateBrokerLink = (broker) => {
    const baseUrl = window.location.origin
    const brokerId = `broker_${broker.id}_${Date.now()}`
    const brokerName = encodeURIComponent(broker.name)
    const link = `${baseUrl}/chat?broker=true&brokerId=${brokerId}&brokerName=${brokerName}`
    
    setSelectedBroker(broker)
    setBrokerLink(link)
    setShowBrokerLinkModal(true)
  }

  // Copy broker link to clipboard
  const copyBrokerLink = async () => {
    try {
      await navigator.clipboard.writeText(brokerLink)
      alert('تم نسخ رابط الوسيط إلى الحافظة!')
    } catch (err) {
      console.error('خطأ في نسخ الرابط:', err)
      alert('خطأ في نسخ الرابط')
    }
  }

  return (
    <div className="brokers-container">
      {/* Header Section */}
      <motion.section 
        className="brokers-header"
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
      >
        <div className="header-content">
          <div className="header-main">
            <div className="page-logo">
              <img src="/logo.png" alt="وسيطك" className="logo-image" />
            </div>
            <h1>الوسطاء المعتمدون</h1>
            <p>اختر الوسيط المناسب لصفقتك من بين أفضل الوسطاء المعتمدين</p>
            
          </div>
          
          {/* Search and Filter */}
          <div className="search-filter-section">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ابحث عن وسيط أو تخصص..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-controls">
              <div className="filter-group">
                <FaFilter className="filter-icon" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="sort-group">
                <FaSort className="sort-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">الأعلى تقييماً</option>
                  <option value="experience">الأكثر خبرة</option>
                  <option value="deals">الأكثر صفقات</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Brokers Grid */}
      <motion.section 
        className="brokers-grid-section"
        initial={{opacity:0}} 
        animate={{opacity:1}} 
        transition={{duration:0.8, delay:0.2}}
      >
        <div className="brokers-grid">
          {sortedBrokers.map((broker, idx) => (
            <motion.div 
              key={broker.id} 
              className={`broker-card ${broker.premium ? 'premium' : ''}`}
              initial={{opacity:0, y:30}} 
              animate={{opacity:1, y:0}} 
              transition={{duration:0.5, delay:idx*0.1}}
              whileHover={{y:-8, scale:1.02}}
            >
              {broker.premium && <div className="premium-badge">مميز</div>}
              
              <div className="broker-header">
                <div className="broker-info">
                  <h3>{broker.name}</h3>
                  <p className="broker-title">{broker.title}</p>
                  <div className="rating-section">
                    <div className="stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.floor(broker.rating) ? 'star filled' : 'star'} 
                        />
                      ))}
                    </div>
                    <span className="rating-text">{broker.rating} ({broker.reviews} تقييم)</span>
                  </div>
                  {broker.verified && <FaCheckCircle className="verified-icon" />}
                </div>
              </div>

              <div className="broker-details">
                <div className="detail-item">
                  <FaMapMarkerAlt className="detail-icon" />
                  <span>{broker.location}</span>
                </div>
                <div className="detail-item">
                  <FaClock className="detail-icon" />
                  <span>{broker.experience} خبرة</span>
                </div>
                <div className="detail-item">
                  <FaHandshake className="detail-icon" />
                  <span>{broker.completedDeals} صفقة مكتملة</span>
                </div>
                <div className="detail-item">
                  <FaShieldAlt className="detail-icon" />
                  <span>استجابة: {broker.responseTime}</span>
                </div>
              </div>

              <div className="specialties">
                <h4>التخصصات:</h4>
                <div className="specialty-tags">
                  {broker.specialties.map((specialty, i) => (
                    <span key={i} className="specialty-tag">{specialty}</span>
                  ))}
                </div>
              </div>

              <p className="broker-description">{broker.description}</p>

              <div className="broker-languages">
                <strong>اللغات:</strong> {broker.languages.join('، ')}
              </div>

              <div className="broker-actions">
                <button className="contact-btn primary">
                  <FaPhone /> تواصل الآن
                </button>
                <button className="contact-btn secondary">
                  <FaEnvelope /> إرسال رسالة
                </button>
                <button 
                  className="contact-btn broker-link"
                  onClick={() => generateBrokerLink(broker)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <FaHandshake /> رابط الوسيط
                </button>
              </div>

              <div className="broker-footer">
                <div className="working-hours">
                  <FaClock className="footer-icon" />
                  <span>ساعات العمل: {broker.workingHours}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Broker Link Modal */}
      {showBrokerLinkModal && (
        <motion.div 
          className="modal-overlay"
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          exit={{opacity:0}}
          onClick={() => setShowBrokerLinkModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <motion.div 
            className="modal-content"
            initial={{scale:0.8, opacity:0}} 
            animate={{scale:1, opacity:1}} 
            exit={{scale:0.8, opacity:0}}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}
          >
            <div className="modal-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <FaHandshake style={{color: '#10b981'}} />
                رابط الوسيط الخاص
              </h2>
              <button 
                onClick={() => setShowBrokerLinkModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '8px'
                }}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: '18px',
                  color: '#065f46',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaShieldAlt />
                  {selectedBroker?.name}
                </h3>
                <p style={{
                  margin: '0 0 8px 0',
                  color: '#047857',
                  fontSize: '14px'
                }}>
                  {selectedBroker?.title}
                </p>
                <p style={{
                  margin: 0,
                  color: '#065f46',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  ⭐ {selectedBroker?.rating} تقييم • {selectedBroker?.completedDeals} صفقة مكتملة
                </p>
              </div>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  رابط الوسيط:
                </label>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    value={brokerLink}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      background: '#f9fafb'
                    }}
                  />
                  <button
                    onClick={copyBrokerLink}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    📋 نسخ
                  </button>
                </div>
              </div>
              
              <div style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <h4 style={{
                  margin: '0 0 8px 0',
                  color: '#92400e',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  💡 كيفية الاستخدام:
                </h4>
                <ul style={{
                  margin: 0,
                  paddingLeft: '20px',
                  color: '#92400e',
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}>
                  <li>انسخ الرابط وأرسله للعملاء</li>
                  <li>عند فتح الرابط، سيظهر اسمك كوسيط في الشات</li>
                  <li>ستظهر رتبة "وسيط" بجانب اسمك في جميع الرسائل</li>
                  <li>يمكنك إدارة المحادثات كوسيط معتمد</li>
                </ul>
              </div>
            </div>
            
            <div className="modal-footer" style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowBrokerLinkModal(false)}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  copyBrokerLink()
                  setShowBrokerLinkModal(false)
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                نسخ وإغلاق
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

    </div>
  )
}


