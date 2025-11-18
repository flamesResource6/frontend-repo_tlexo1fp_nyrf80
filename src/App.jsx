import Hero from './components/Hero'
import Markets from './components/Markets'
import Wallet from './components/Wallet'

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
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
