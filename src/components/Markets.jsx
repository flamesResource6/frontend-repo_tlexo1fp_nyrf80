import { useEffect, useState, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function MiniChart({ coinId }) {
  const [series, setSeries] = useState([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/coin/${coinId}/history?days=7`)
        const data = await res.json()
        if (mounted) setSeries(data.prices || [])
      } catch (e) {
        // ignore
      }
    }
    load()
  }, [coinId])

  if (!series.length) return null

  const labels = series.map(p => new Date(p[0]).toLocaleDateString())
  const values = series.map(p => p[1])

  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            data: values,
            fill: true,
            borderColor: 'rgba(16,185,129,1)',
            backgroundColor: 'rgba(16,185,129,0.1)',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 0,
          },
        ],
      }}
      options={{
        responsive: true,
        elements: { point: { radius: 0 } },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
      }}
      height={40}
    />
  )
}

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
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-slate-100 font-medium truncate">{c.name}</span>
                    <span className="text-slate-400 text-sm uppercase">{c.symbol}</span>
                  </div>
                  <div className="text-emerald-300 font-semibold">${Number(c.current_price)?.toLocaleString()}</div>
                </div>
                <div className={"text-sm " + ((c.price_change_percentage_24h ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                  {Number(c.price_change_percentage_24h ?? 0).toFixed(2)}%
                </div>
              </div>
              <div className="mt-3">
                <MiniChart coinId={c.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default Markets
