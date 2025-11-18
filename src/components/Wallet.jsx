import { useEffect, useState } from 'react'
import { Wallet, LogIn } from 'lucide-react'
import UniversalProvider from '@walletconnect/universal-provider'

function WalletSection() {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [wcReady, setWcReady] = useState(false)
  const [wcProvider, setWcProvider] = useState(null)

  // Initialize WalletConnect Universal Provider
  useEffect(() => {
    (async () => {
      try {
        const provider = await UniversalProvider.init({
          projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo',
          metadata: {
            name: 'Neo Exchange',
            description: 'Futuristic crypto platform',
            url: window.location.origin,
            icons: ['https://avatars.githubusercontent.com/u/37784886?s=200&v=4']
          }
        })
        setWcProvider(provider)
        setWcReady(true)
      } catch (e) {
        console.warn('WalletConnect init failed:', e)
      }
    })()
  }, [])

  const connectMetaMask = async () => {
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

  const connectWalletConnect = async () => {
    setError('')
    try {
      if (!wcProvider) {
        setError('WalletConnect not ready')
        return
      }
      const { accounts } = await wcProvider.connect({
        optionalNamespaces: {
          eip155: {
            methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
            chains: ['eip155:1', 'eip155:137', 'eip155:42161'],
            events: ['chainChanged', 'accountsChanged']
          }
        }
      })
      setAddress(accounts?.[0] || '')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="bg-slate-900/60 border border-emerald-400/20 rounded-xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-xl font-semibold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" /> Wallet
            </h3>
            <p className="text-slate-400">Connect a non-custodial wallet to view your address.</p>
            {address && (
              <p className="mt-2 text-emerald-300 font-mono break-all">{address}</p>
            )}
            {error && (
              <p className="mt-2 text-red-400">{error}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={connectMetaMask} className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold flex items-center gap-2">
              <LogIn className="w-4 h-4" /> MetaMask
            </button>
            <button onClick={connectWalletConnect} disabled={!wcReady} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-400/30 font-semibold disabled:opacity-50">
              WalletConnect
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WalletSection
