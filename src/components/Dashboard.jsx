import { useEffect, useMemo, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}

function CreatePortfolio({ onCreated }) {
  const [name, setName] = useState('My Wallet')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address: address || null })
      })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const data = await res.json()
      onCreated?.(data)
      setName('')
      setAddress('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleCreate} className="bg-slate-900/60 border border-emerald-400/20 rounded-xl p-4 space-y-3">
      <h3 className="text-white font-semibold">Create Portfolio</h3>
      <Field label="Name">
        <input value={name} onChange={(e)=>setName(e.target.value)} required className="w-full px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
      </Field>
      <Field label="Address (optional)">
        <input value={address} onChange={(e)=>setAddress(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
      </Field>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold disabled:opacity-50">
        {loading ? 'Creating…' : 'Create'}
      </button>
    </form>
  )
}

function TxForm({ pid, type, onDone }) {
  const [coinId, setCoinId] = useState('bitcoin')
  const [symbol, setSymbol] = useState('btc')
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/${pid}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, coin_id: coinId, symbol, amount: Number(amount), tx_hash: txHash || null })
      })
      if (!res.ok) throw new Error('Failed to record transaction')
      onDone?.()
      setAmount('')
      setTxHash('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-900/60 border border-emerald-400/20 rounded-xl p-4 space-y-3">
      <h4 className="text-slate-200 font-medium capitalize">{type}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Coin ID">
          <input value={coinId} onChange={e=>setCoinId(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700" />
        </Field>
        <Field label="Symbol">
          <input value={symbol} onChange={e=>setSymbol(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700" />
        </Field>
        <Field label="Amount">
          <input value={amount} onChange={e=>setAmount(e.target.value)} type="number" step="any" required className="w-full px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700" />
        </Field>
        <Field label="Tx Hash (optional)">
          <input value={txHash} onChange={e=>setTxHash(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700" />
        </Field>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={loading} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-400/30 font-semibold disabled:opacity-50">
        {loading ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}

function Dashboard() {
  const [portfolios, setPortfolios] = useState([])
  const [selected, setSelected] = useState('')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)

  const backendWarning = useMemo(() => !import.meta.env.VITE_BACKEND_URL, [])

  const loadPortfolios = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/portfolio`)
      const data = await res.json()
      setPortfolios(data)
      if (data.length && !selected) setSelected(data[0].id)
    } catch (e) {
      // noop
    }
  }

  const loadSummary = async (pid) => {
    if (!pid) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/portfolio/${pid}/summary`)
      const data = await res.json()
      setSummary(data)
    } catch (e) {
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPortfolios()
  }, [])

  useEffect(() => {
    if (selected) loadSummary(selected)
  }, [selected])

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <a href="/" className="text-emerald-400 hover:text-emerald-300">Home</a>
        </div>

        {backendWarning && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-4 py-3 rounded-lg">
            Tip: Set VITE_BACKEND_URL for production. Using localhost fallback now.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/60 border border-emerald-400/20 rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-3">
                <select value={selected} onChange={(e)=>setSelected(e.target.value)} className="px-3 py-2 rounded bg-slate-800 text-slate-100 border border-slate-700">
                  <option value="">Select portfolio…</option>
                  {portfolios.map(p => (
                    <option key={p.id} value={p.id}>{p.name}{p.address ? ` • ${p.address.slice(0,6)}…` : ''}</option>
                  ))}
                </select>
                <button onClick={()=>loadSummary(selected)} className="px-3 py-2 rounded bg-slate-800 text-emerald-300 border border-emerald-400/30">Refresh</button>
              </div>
              <div className="mt-4">
                {loading ? (
                  <p className="text-slate-400">Loading…</p>
                ) : summary ? (
                  <div>
                    <div className="text-slate-300 text-sm">Total Balance</div>
                    <div className="text-3xl font-bold text-white">${Number(summary.total_value||0).toLocaleString(undefined,{maximumFractionDigits:2})}</div>
                    <div className="mt-4">
                      <h4 className="text-slate-200 font-semibold mb-2">Holdings</h4>
                      {summary.holdings?.length ? (
                        <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden">
                          {summary.holdings.map((h, i) => (
                            <div key={i} className="grid grid-cols-5 gap-2 px-3 py-2 text-slate-200 bg-slate-900/40">
                              <div className="col-span-2 uppercase text-slate-300">{h.symbol}</div>
                              <div className="text-right">{h.amount}</div>
                              <div className="text-right text-emerald-300">${Number(h.price).toLocaleString()}</div>
                              <div className="text-right font-semibold">${Number(h.value).toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400">No holdings yet.</p>
                      )}
                    </div>
                    <div className="mt-6">
                      <h4 className="text-slate-200 font-semibold mb-2">Recent Transactions</h4>
                      {summary.transactions?.length ? (
                        <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden">
                          {summary.transactions.map((t, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 text-slate-200 bg-slate-900/40">
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.type==='deposit' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>{t.type}</span>
                                <span className="uppercase text-slate-300">{t.symbol}</span>
                              </div>
                              <div className="font-mono">{t.amount}</div>
                              <div className="text-slate-400 text-xs">{t.timestamp ? new Date(t.timestamp).toLocaleString() : ''}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400">No transactions yet.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400">Select a portfolio to view summary.</p>
                )}
              </div>
            </div>

            {selected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <button onClick={()=>setShowDeposit(v=>!v)} className="w-full mb-3 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold">Deposit</button>
                  {showDeposit && <TxForm pid={selected} type="deposit" onDone={()=>{ setShowDeposit(false); loadSummary(selected) }} />}
                </div>
                <div>
                  <button onClick={()=>setShowWithdraw(v=>!v)} className="w-full mb-3 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-400/30 font-semibold">Withdraw</button>
                  {showWithdraw && <TxForm pid={selected} type="withdrawal" onDone={()=>{ setShowWithdraw(false); loadSummary(selected) }} />}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <CreatePortfolio onCreated={() => loadPortfolios()} />
            <div className="bg-slate-900/60 border border-emerald-400/20 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2">Portfolios</h3>
              <div className="space-y-2">
                {portfolios.length ? portfolios.map(p => (
                  <button key={p.id} onClick={()=>setSelected(p.id)} className={`w-full text-left px-3 py-2 rounded border ${selected===p.id ? 'border-emerald-400/60 text-emerald-300 bg-slate-800' : 'border-emerald-400/20 text-slate-300 bg-slate-900/40'}`}>
                    <div className="font-medium">{p.name}</div>
                    {p.address && <div className="text-xs text-slate-400">{p.address}</div>}
                  </button>
                )) : <p className="text-slate-400">No portfolios yet.</p>}
              </div>
            </div>
          </div>
        </div>

        <footer className="py-10 text-center text-slate-500">Balance • Transactions • Deposit • Withdraw</footer>
      </div>
    </div>
  )
}

export default Dashboard
