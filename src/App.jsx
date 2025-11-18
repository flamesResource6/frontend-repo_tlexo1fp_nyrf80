import Hero from './components/Hero'
import Markets from './components/Markets'
import Wallet from './components/Wallet'
import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-white font-bold">Neo Exchange</div>
        <nav className="flex items-center gap-4">
          <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300">Dashboard</Link>
        </nav>
      </header>
      <Hero />
      <div className="border-t border-emerald-400/10" />
      <Markets />
      <Wallet />
      <footer className="py-10 text-center text-slate-500 border-t border-emerald-400/10">
        Built for a minimal, futuristic vibe • Charcoal + Green
      </footer>
    </div>
  )
}

export default App
