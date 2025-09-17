import { motion } from 'framer-motion'
import { FaGavel, FaShieldAlt, FaHandshake, FaMoneyBillWave, FaBan, FaUserSlash, FaFileContract, FaCheckCircle, FaExclamationTriangle, FaLock } from 'react-icons/fa'

export default function Terms() {
  return (
    <div className="terms-container">
      <motion.section 
        className="terms-section" 
        initial={{opacity:0, y:30}} 
        animate={{opacity:1, y:0}} 
        transition={{duration:0.8}}
        aria-labelledby="terms-title"
      >
        <div className="terms-header">
          <div className="header-icon">
            <FaGavel className="main-icon" />
            <div className="icon-glow"></div>
          </div>
          <h1 id="terms-title">الشروط والأحكام</h1>
          <p className="terms-subtitle">الشروط والأحكام العامة لاستخدام منصة وسيطك</p>
          <p className="muted">آخر تحديث: يناير 2025</p>
        </div>

        <div className="terms-content" style={{direction: 'rtl', textAlign: 'right'}}>
          <motion.div 
            className="terms-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.2}}
          >
            <div className="card-header">
              <FaFileContract className="card-icon" />
              <h2>طبيعة الخدمة</h2>
            </div>
            <div className="card-content">
              <div className="terms-item">
                <FaCheckCircle className="terms-icon" />
                <div className="terms-text">
                  <strong>منصة وسيطك وسيط تقني:</strong> تعمل منصة وسيطك كوسيط تقني لربط البائع والمشتري والوسطاء المعتمدين، وتوفر بيئة آمنة ومحمية لإتمام الصفقات.
                </div>
              </div>
              <div className="terms-item">
                <FaCheckCircle className="terms-icon" />
                <div className="terms-text">
                  <strong>الخدمات المقدمة:</strong> تقدم المنصة خدمات الوساطة الآمنة، حماية المدفوعات، التحقق من الهوية، وإدارة الصفقات من البداية حتى النهاية.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="terms-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.4}}
          >
            <div className="card-header">
              <FaShieldAlt className="card-icon" />
              <h2>الالتزامات القانونية</h2>
            </div>
            <div className="card-content">
              <div className="terms-item">
                <FaExclamationTriangle className="terms-icon" />
                <div className="terms-text">
                  <strong>الالتزام بالأنظمة:</strong> يجب على جميع المستخدمين الالتزام بالأنظمة واللوائح المعمول بها في الدولة، بما في ذلك قوانين التجارة الإلكترونية وحماية المستهلك.
                </div>
              </div>
              <div className="terms-item">
                <FaExclamationTriangle className="terms-icon" />
                <div className="terms-text">
                  <strong>الامتثال للقوانين:</strong> يلتزم المستخدمون بجميع القوانين المحلية والدولية المتعلقة بالتجارة الإلكترونية والمدفوعات الرقمية.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="terms-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.6}}
          >
            <div className="card-header">
              <FaMoneyBillWave className="card-icon" />
              <h2>إدارة المدفوعات</h2>
            </div>
            <div className="card-content">
              <div className="terms-item">
                <FaLock className="terms-icon" />
                <div className="terms-text">
                  <strong>حفظ المبالغ:</strong> تحفظ جميع المبالغ المالية لدى الوسيط في حسابات آمنة ومحمية حتى إتمام الصفقة بنجاح وتأكيد كلا الطرفين.
                </div>
              </div>
              <div className="terms-item">
                <FaLock className="terms-icon" />
                <div className="terms-text">
                  <strong>ضمان الأموال:</strong> جميع الأموال محمية بضمانات مصرفية وتأمينية لضمان استردادها في حالة عدم إتمام الصفقة.
                </div>
              </div>
              <div className="terms-item">
                <FaLock className="terms-icon" />
                <div className="terms-text">
                  <strong>الرسوم والعمولات:</strong> تطبق رسوم وعمولات محددة مسبقاً على الخدمات، ويتم إشعار المستخدمين بها قبل إتمام أي صفقة.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="terms-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:0.8}}
          >
            <div className="card-header">
              <FaBan className="card-icon" />
              <h2>المحظورات والقيود</h2>
            </div>
            <div className="card-content">
              <div className="terms-item">
                <FaExclamationTriangle className="terms-icon" />
                <div className="terms-text">
                  <strong>السلع المحظورة:</strong> يمنع منعاً باتاً تداول السلع أو الخدمات المخالفة للقوانين أو المزيفة أو التي تنتهك حقوق الملكية الفكرية.
                </div>
              </div>
              <div className="terms-item">
                <FaExclamationTriangle className="terms-icon" />
                <div className="terms-text">
                  <strong>الأنشطة المحظورة:</strong> يحظر استخدام المنصة لأي أنشطة غير قانونية أو مخالفة للأخلاق العامة أو التي تضر بالآخرين.
                </div>
              </div>
              <div className="terms-item">
                <FaExclamationTriangle className="terms-icon" />
                <div className="terms-text">
                  <strong>الغش والتلاعب:</strong> يحظر أي محاولة للغش أو التلاعب في النظام أو استغلال الثغرات الأمنية.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="terms-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:1.0}}
          >
            <div className="card-header">
              <FaUserSlash className="card-icon" />
              <h2>إدارة الحسابات</h2>
            </div>
            <div className="card-content">
              <div className="terms-item">
                <FaExclamationTriangle className="terms-icon" />
                <div className="terms-text">
                  <strong>حق الإيقاف:</strong> يحق للمنصة إيقاف أو تعليق أي حساب يسيء الاستخدام أو ينتهك هذه الشروط والأحكام.
                </div>
              </div>
              <div className="terms-item">
                <FaExclamationTriangle className="terms-icon" />
                <div className="terms-text">
                  <strong>التحقيق والمراجعة:</strong> تحتفظ المنصة بحقها في التحقيق في أي نشاط مشبوه واتخاذ الإجراءات المناسبة.
                </div>
              </div>
              <div className="terms-item">
                <FaExclamationTriangle className="terms-icon" />
                <div className="terms-text">
                  <strong>الاستئناف:</strong> يمكن للمستخدمين المتضررين تقديم استئناف ضد قرار الإيقاف خلال 30 يوماً من تاريخ القرار.
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="terms-card"
            initial={{opacity:0, y:20}} 
            animate={{opacity:1, y:0}} 
            transition={{duration:0.6, delay:1.2}}
          >
            <div className="card-header">
              <FaHandshake className="card-icon" />
              <h2>حل النزاعات</h2>
            </div>
            <div className="card-content">
              <div className="dispute-resolution">
                <div className="resolution-step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>التواصل المباشر</h3>
                    <p>محاولة حل النزاع من خلال التواصل المباشر بين الأطراف</p>
                  </div>
                </div>
                <div className="resolution-step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>الوساطة</h3>
                    <p>اللجوء إلى فريق الوساطة في المنصة لحل النزاع</p>
                  </div>
                </div>
                <div className="resolution-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>التحكيم</h3>
                    <p>في حالة عدم التوصل لحل، يتم اللجوء للتحكيم أو القضاء</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="terms-footer"
          initial={{opacity:0}} 
          animate={{opacity:1}} 
          transition={{duration:0.8, delay:1.4}}
        >
          <div className="footer-content">
            <div className="footer-info">
              <p><strong>آخر تحديث:</strong> يناير 2025</p>
              <p><strong>الإصدار:</strong> 2.1</p>
            </div>
            <div className="footer-note">
              <p>هذه الشروط والأحكام قابلة للتحديث. سيتم إشعار المستخدمين بأي تغييرات جوهرية.</p>
              <p>للاستفسارات القانونية، يرجى التواصل مع فريق الشؤون القانونية</p>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  )
}


