export default function Blog() {
  return (
    <section className="section">
      <h1>المدونة</h1>
      <div className="grid">
        <article className="card">
          <h2>نصائح للتجارة الآمنة</h2>
          <p className="muted">إرشادات للتعامل عبر الإنترنت بثقة.</p>
        </article>
        <article className="card">
          <h2>ما هو الضمان المالي؟</h2>
          <p className="muted">كيف يحميك نظام الضمان من الاحتيال.</p>
        </article>
        <article className="card">
          <h2>تحديثات منصة وسيطك</h2>
          <p className="muted">ميزات جديدة وتحسينات مستمرة.</p>
        </article>
      </div>
    </section>
  )
}


