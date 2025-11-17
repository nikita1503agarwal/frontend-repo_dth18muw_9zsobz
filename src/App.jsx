import { useEffect, useState } from 'react'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-rose-900/50 to-black" />
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center" />
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            FMRENTALPRESTIGE
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-rose-100/90">
            Noleggio auto di lusso a Verona e Lago di Garda. Servizio premium, consegna in hotel o aeroporto, assistenza 24/7.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#prenota" className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-lg shadow-rose-600/30 transition">Prenota ora</a>
            <a href="#flotta" className="px-5 py-3 bg-black/60 hover:bg-black text-white font-semibold rounded-lg border border-white/10 transition">Vedi flotta</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Fleet() {
  const cars = [
    { name: 'Ferrari Portofino', img: 'https://images.unsplash.com/photo-1606665810406-7002cc81a9a1?q=80&w=1400&auto=format&fit=crop' },
    { name: 'Lamborghini Huracán', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1400&auto=format&fit=crop' },
    { name: 'Porsche 911', img: 'https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1400&auto=format&fit=crop' },
    { name: 'Range Rover Vogue', img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1400&auto=format&fit=crop' },
  ]
  return (
    <section id="flotta" className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">La nostra flotta</h2>
        <p className="text-rose-200/80">Modelli disponibili su richiesta</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cars.map((c) => (
          <div key={c.name} className="group bg-gradient-to-b from-neutral-900 to-black border border-white/10 rounded-xl overflow-hidden">
            <div className="aspect-video overflow-hidden">
              <img src={c.img} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <p className="text-white font-semibold">{c.name}</p>
              <span className="text-amber-400 text-sm">Luxury</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch(`${backendUrl}/api/reviews`).then(r => r.json()).then(d => setItems(d.items || [])).catch(() => {})
  }, [])

  const stars = (n) => '★★★★★☆☆☆☆☆'.slice(5 - Math.min(5, Math.max(1, n)), 10 - Math.min(5, Math.max(1, n)))

  return (
    <section className="bg-black/40 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Recensioni</h2>
        {items.length === 0 ? (
          <p className="text-rose-100/80">Saremo felici di pubblicare qui le vostre recensioni. ⭐⭐⭐⭐⭐</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((r) => (
              <div key={r._id} className="bg-neutral-900/70 border border-white/10 rounded-xl p-5">
                <p className="text-amber-400 text-lg font-semibold">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</p>
                <p className="text-white mt-2">{r.commento}</p>
                <p className="text-rose-200/70 mt-3 text-sm">— {r.nome}{r.fonte ? ` • ${r.fonte}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function BookingForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(null)
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const res = await fetch(`${backendUrl}/api/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) setSuccess(data.code)
    } catch (err) {
      setSuccess('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="prenota" className="max-w-7xl mx-auto px-6 py-16">
      <div className="bg-neutral-900/70 border border-white/10 rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-white mb-6">Richiesta Prenotazione</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input name="nome" placeholder="Nome" className="input" required />
          <input name="cognome" placeholder="Cognome" className="input" required />
          <input type="email" name="email" placeholder="Email" className="input" required />
          <input name="telefono" placeholder="Telefono / WhatsApp" className="input" required />
          <input name="auto" placeholder="Auto desiderata (es. Ferrari Portofino)" className="input" required />
          <input name="ritiro_data" placeholder="Ritiro - data/ora" className="input" required />
          <input name="riconsegna_data" placeholder="Riconsegna - data/ora" className="input" required />
          <input name="ritiro_luogo" placeholder="Luogo ritiro (Verona, VRN, Lago di Garda)" className="input" required />
          <input name="riconsegna_luogo" placeholder="Luogo riconsegna" className="input" required />
          <input name="sorgente" placeholder="Sorgente (sito, instagram, tiktok)" className="input" />
          <textarea name="messaggio" placeholder="Note" className="input md:col-span-2" rows={4} />
          <button disabled={loading} className="md:col-span-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition">
            {loading ? 'Invio...' : 'Invia richiesta'}
          </button>
        </form>
        {success && success !== 'error' && (
          <p className="text-amber-400 mt-4">Grazie! Codice richiesta: {success}. Ti contatteremo a breve.</p>
        )}
        {success === 'error' && (
          <p className="text-rose-300 mt-4">Si è verificato un errore. Riprova.</p>
        )}
      </div>
    </section>
  )
}

function EasyCheckIn() {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState(null)

  const handleCheck = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${backendUrl}/api/checkin/${code}`, { method: 'POST' })
      const data = await res.json()
      setStatus(data.success ? 'Check-in completato ✅' : 'Codice non trovato')
    } catch {
      setStatus('Errore di rete')
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="bg-gradient-to-br from-black to-neutral-900 border border-amber-500/30 rounded-2xl p-6">
        <h2 className="text-3xl font-bold text-white mb-4">Easy Check-in</h2>
        <p className="text-rose-100/80 mb-4">Inserisci il codice della prenotazione per confermare l'arrivo.</p>
        <form onSubmit={handleCheck} className="flex gap-3 max-w-xl">
          <input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Codice prenotazione (es. FM-20240101120000)" className="input flex-1" required />
          <button className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition">Conferma</button>
        </form>
        {status && <p className="text-white mt-4">{status}</p>}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/60">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white font-semibold">FMRENTALPRESTIGE</p>
        <div className="flex items-center gap-3 text-white/80">
          <a href="https://www.tiktok.com" target="_blank" className="hover:text-white">TikTok</a>
          <a href="https://www.instagram.com" target="_blank" className="hover:text-white">Instagram</a>
          <a href="https://www.facebook.com" target="_blank" className="hover:text-white">Facebook</a>
        </div>
        <p className="text-rose-200/70 text-sm">Verona • Lago di Garda</p>
      </div>
    </footer>
  )
}

function App() {
  useEffect(() => {
    document.body.classList.add('bg-neutral-950')
  }, [])

  return (
    <div className="min-h-screen text-rose-50">
      <Hero />
      <Fleet />
      <BookingForm />
      <EasyCheckIn />
      <Reviews />
      <Footer />

      {/* Styles for inputs */}
      <style>{`
        .input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: white; padding: 0.75rem 1rem; border-radius: 0.75rem; outline: none; }
        .input::placeholder { color: rgba(255,255,255,0.6); }
        .input:focus { border-color: rgb(244 63 94); box-shadow: 0 0 0 3px rgba(244,63,94,0.25); }
      `}</style>
    </div>
  )
}

export default App
