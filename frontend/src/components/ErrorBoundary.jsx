import React from 'react'
import { FaExclamationTriangle, FaRedo, FaHome, FaBug, FaShieldAlt } from 'react-icons/fa'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    
    // Log error with more context
    console.error('🚨 خطأ في التطبيق:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    })

    // Send error to analytics if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      })
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }))
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId, retryCount } = this.state
      
      return (
        <div className="error-boundary" style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div className="error-container" style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(45deg, #ff6b6b, #feca57)',
              borderRadius: '50%',
              opacity: 0.1,
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="error-icon" style={{
                fontSize: '80px',
                color: '#ff6b6b',
                marginBottom: '20px',
                animation: 'pulse 2s infinite'
              }}>
                <FaExclamationTriangle />
              </div>
              
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#2d3748',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>
                عذراً، حدث خطأ غير متوقع
              </h1>
              
              <p style={{
                fontSize: '16px',
                color: '#718096',
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                نعتذر عن هذا الخطأ. يرجى إعادة تحميل الصفحة أو المحاولة مرة أخرى.
              </p>

              {retryCount > 0 && (
                <div style={{
                  background: '#fef5e7',
                  border: '1px solid #f6ad55',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '24px',
                  fontSize: '14px',
                  color: '#744210'
                }}>
                  محاولة إعادة المحاولة: {retryCount}
                </div>
              )}
              
              <div className="error-actions" style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '32px'
              }}>
                <button 
                  className="retry-btn"
                  onClick={this.handleRetry}
                  style={{
                    background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 28px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(66, 153, 225, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 15px rgba(66, 153, 225, 0.3)'
                  }}
                >
                  <FaRedo />
                  المحاولة مرة أخرى
                </button>
                
                <button 
                  className="reload-btn"
                  onClick={this.handleReload}
                  style={{
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 28px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(72, 187, 120, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 15px rgba(72, 187, 120, 0.3)'
                  }}
                >
                  <FaRedo />
                  إعادة تحميل الصفحة
                </button>
                
                <button 
                  className="home-btn"
                  onClick={this.handleGoHome}
                  style={{
                    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 28px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(237, 137, 54, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(237, 137, 54, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 15px rgba(237, 137, 54, 0.3)'
                  }}
                >
                  <FaHome />
                  العودة للرئيسية
                </button>
              </div>

              <div style={{
                background: '#f7fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4a5568'
                }}>
                  <FaShieldAlt />
                  معرف الخطأ: {errorId}
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#718096'
                }}>
                  إذا استمر هذا الخطأ، يرجى إرسال معرف الخطأ لفريق الدعم
                </p>
              </div>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="error-details" style={{
                  background: '#1a202c',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}>
                  <summary style={{
                    cursor: 'pointer',
                    marginBottom: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FaBug />
                    تفاصيل الخطأ (للمطورين)
                  </summary>
                  <div style={{ marginBottom: '12px' }}>
                    <strong>الخطأ:</strong>
                    <pre style={{ 
                      background: '#2d3748', 
                      padding: '8px', 
                      borderRadius: '4px',
                      overflow: 'auto',
                      margin: '8px 0'
                    }}>
                      {error && error.toString()}
                    </pre>
                  </div>
                  <div>
                    <strong>معلومات المكون:</strong>
                    <pre style={{ 
                      background: '#2d3748', 
                      padding: '8px', 
                      borderRadius: '4px',
                      overflow: 'auto',
                      margin: '8px 0'
                    }}>
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </div>
          </div>
          
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
