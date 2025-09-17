import { NavLink, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { applyTheme, getStoredTheme } from './theme'
import { useSessionData } from './hooks/useDatabase'
import { 
  FaHome, FaStar, FaUsers, FaHandshake, FaComments, FaRocket,
  FaCrown, FaGem, FaTrophy, FaMedal, FaAward, FaGlobe,
  FaShieldAlt, FaBolt, FaMagic, FaFire, FaHeart,
  FaPhone, FaEnvelope, FaMoneyBillWave, FaTicketAlt
} from 'react-icons/fa'
import './App.css'
import './styles/enhanced.css'
import './styles/mobile.css'

function App() {
  const [theme, setTheme] = useState(getStoredTheme())
  const [userId] = useState(() => {
    // Generate or get existing user ID
    let id = localStorage.getItem('userId')
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('userId', id)
    }
    return id
  })
  const [nickname, setNickname] = useSessionData('nickname', '', userId)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { applyTheme(theme) }, [theme])
  useEffect(() => {
    function onNicknameUpdate() {
      // This will be handled by the useSessionData hook
    }
    window.addEventListener('nickname-update', onNicknameUpdate)
    return () => window.removeEventListener('nickname-update', onNicknameUpdate)
  }, [])

  function handleLogout() {
    setNickname('')
    window.dispatchEvent(new Event('nickname-update'))
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">
          <button className="menu-button" aria-label="القائمة" onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </button>
          <div className="brand-logo">
            <div className="logo-icon">
              <FaShieldAlt />
            </div>
            <div className="brand-text">
              <strong>وسيطك</strong>
              <span>WASITAK</span>
            </div>
          </div>
        </div>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            <FaHome className="nav-icon" />
            الرئيسية
          </NavLink>
          <NavLink to="/broker-request" onClick={() => setMenuOpen(false)}>
            <FaHandshake className="nav-icon" />
            طلب وسيط
          </NavLink>
          <NavLink to="/testimonials" onClick={() => setMenuOpen(false)}>
            <FaTrophy className="nav-icon" />
            آراء العملاء
          </NavLink>
          <NavLink to="/brokers" onClick={() => setMenuOpen(false)}>
            <FaUsers className="nav-icon" />
            الوسطاء
          </NavLink>
          <NavLink to="/pricing" onClick={() => setMenuOpen(false)}>
            <FaGem className="nav-icon" />
            الأسعار
          </NavLink>
          <NavLink to="/features" onClick={() => setMenuOpen(false)}>
            <FaStar className="nav-icon" />
            الميزات
          </NavLink>
        </nav>
        <div className="header-actions">
          {nickname ? <span className="badge">مرحباً، {nickname}</span> : null}
          <a className="icon-button" href="https://x.com" target="_blank" rel="noreferrer" aria-label="منصة X">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M18.243 2H21l-6.57 7.5L22 22h-6.757l-5.3-6.92L3.757 22H1l7.128-8.14L2 2h6.757l4.87 6.345L18.243 2Zm-1.18 18h1.763L7.058 4H5.296l11.768 16Z" fill="currentColor"/>
            </svg>
          </a>
          <a className="icon-button" href="https://wa.me/920004242" target="_blank" rel="noreferrer" aria-label="واتساب">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.5 0 .2 5.29.2 11.84c0 2.09.55 4.11 1.59 5.9L0 24l6.42-1.66a11.78 11.78 0 0 0 5.63 1.43h.01c6.55 0 11.85-5.29 11.85-11.84 0-3.17-1.24-6.15-3.39-8.45ZM12.06 21.2h-.01a9.96 9.96 0 0 1-5.07-1.39l-.36-.21-3.81.99 1.02-3.71-.24-.38a9.95 9.95 0 0 1-1.54-5.35c0-5.51 4.49-9.99 10.01-9.99 2.68 0 5.19 1.04 7.08 2.93a9.9 9.9 0 0 1 2.92 7.06c0 5.51-4.49 9.99-10 9.99Zm5.49-7.46c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.69.15-.2.3-.8.98-.99 1.18-.18.2-.36.23-.66.08-.3-.15-1.25-.46-2.38-1.47-.88-.77-1.47-1.72-1.64-2.02-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.69-1.67-.95-2.29-.25-.6-.51-.52-.69-.53h-.59c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.11 3.21 5.1 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.79-.73 2.04-1.43.25-.69.25-1.28.18-1.41-.07-.13-.26-.2-.55-.35Z" fill="currentColor"/>
            </svg>
          </a>
          {nickname ? (
            <button className="theme-toggle" aria-label="تسجيل الخروج" onClick={handleLogout}>خروج</button>
          ) : null}
          <button className="theme-toggle" aria-label="تبديل النمط" onClick={() => setTheme(theme==='light'?'dark':'light')}>
            {theme==='light' ? 'ليلي' : 'نهاري'}
          </button>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="trust">
          <div className="trust-badges">
          </div>
        </div>
        <div className="footer-links">
          <div className="col">
            <NavLink to="/features">الميزات</NavLink>
            <NavLink to="/pricing">الأسعار</NavLink>
            <NavLink to="/testimonials">آراء العملاء</NavLink>
          </div>
          <div className="col">
            <NavLink to="/about">من نحن</NavLink>
            <NavLink to="/partners">الشركاء</NavLink>
            <NavLink to="/careers">الوظائف</NavLink>
          </div>
          <div className="col">
            <NavLink to="/faq">الأسئلة الشائعة</NavLink>
            <NavLink to="/support">الدعم</NavLink>
            <NavLink to="/contact">اتصل بنا</NavLink>
            <NavLink to="/compensation">التعويض</NavLink>
          </div>
          <div className="col">
            <NavLink to="/terms">الشروط والأحكام</NavLink>
            <NavLink to="/privacy">السياسة والخصوصية</NavLink>
            <NavLink to="/usage">اتفاقية الاستخدام</NavLink>
          </div>
        </div>
        <div className="contact">
          <div className="contact-info">
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>920004242</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:wasitak@gov.sa">wasitak@gov.sa</a>
            </div>
            <div className="contact-item">
              <FaGlobe className="contact-icon" />
              <span>المملكة العربية السعودية</span>
            </div>
          </div>
        </div>
        <div className="copy">
          <div className="copy-content">
            <p>© جميع الحقوق محفوظة منصة وسيطك 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
