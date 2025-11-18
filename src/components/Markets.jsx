import { useEffect, useState, useMemo } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Markets() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/markets`)
        const data = await res.json()
        if (mounted) setCoins(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
    const id = setInterval(load, 10000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return coins
    return coins.filter(c => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
  }, [coins, query])

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-white">Markets</h2>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coins"
          className="bg-slate-900/60 border border-emerald-400/20 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-slate-400">Loading markets…</div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="group bg-slate-900/60 border border-emerald-400/20 rounded-xl p-4 hover:border-emerald-400/50 transition-colors">
              <div className="flex items-center gap-3">
                <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-100 font-medium">{c.name}</span>
                    <span className="text-slate-400 text-sm uppercase">{c.symbol}</span>
                  </div>
                  <div className="text-emerald-300 font-semibold">${c.current_price?.toLocaleString()}</div>
                </div>
                <div className={"text-sm " + ((c.price_change_percentage_24h ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {c.price_change_percentage_24h?.toFixed(2)}%
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default Markets
