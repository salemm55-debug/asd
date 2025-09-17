export default function Contact() {
  return (
    <section className="section">
      <h1>اتصل بنا</h1>
      <p className="muted">يسعدنا تواصلكم. اختر الطريقة المناسبة.</p>
      <div className="grid">
        <div className="card">
          <h2>الدعم</h2>
          <p>الهاتف: 920004242</p>
          <p>البريد: <a href="mailto:wasitak@gov.sa">wasitak@gov.sa</a></p>
        </div>
        <div className="card">
          <h2>واتساب</h2>
          <p><a href="https://wa.me/920004242" target="_blank" rel="noreferrer">راسلنا عبر واتساب</a></p>
        </div>
        <div className="card">
          <h2>منصة X</h2>
          <p><a href="https://x.com" target="_blank" rel="noreferrer">تابع آخر الأخبار</a></p>
        </div>
      </div>
    </section>
  )
}


