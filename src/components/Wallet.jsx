import { useEffect, useState } from 'react'

function Wallet() {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const connect = async () => {
    setError('')
    try {
      if (!window.ethereum) {
        setError('MetaMask not detected')
        return
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAddress(accounts[0])
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on?.('accountsChanged', (acc) => setAddress(acc?.[0] || ''))
    }
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="bg-slate-900/60 border border-emerald-400/20 rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-white text-xl font-semibold">Wallet</h3>
          <p className="text-slate-400">Connect a non-custodial wallet to view your address.</p>
          {address && (
            <p className="mt-2 text-emerald-300 font-mono break-all">{address}</p>
          )}
          {error && (
            <p className="mt-2 text-red-400">{error}</p>
          )}
        </div>
        <button onClick={connect} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold">
          {address ? 'Connected' : 'Connect MetaMask'}
        </button>
      </div>
    </section>
  )
}

export default Wallet
