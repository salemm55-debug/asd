export default function Support() {
  return (
    <section className="section">
      <h1>الدعم</h1>
      <p>تواصل معنا عبر الواتساب 920004242 أو البريد <a href="mailto:wasitak@gov.sa">wasitak@gov.sa</a>.</p>
      <form style={{display:'grid',gap:10,maxWidth:420}} onSubmit={(e)=>e.preventDefault()}>
        <input placeholder="اسمك" style={{padding:10,border:'1px solid #c6e4da',borderRadius:8}} />
        <input placeholder="بريدك" style={{padding:10,border:'1px solid #c6e4da',borderRadius:8}} />
        <textarea placeholder="رسالتك" rows="4" style={{padding:10,border:'1px solid #c6e4da',borderRadius:8}} />
        <button style={{padding:'10px 14px',borderRadius:8,border:'1px solid #0b5c45',background:'#0d6a4f',color:'#fff'}}>إرسال</button>
      </form>
    </section>
  )
}


