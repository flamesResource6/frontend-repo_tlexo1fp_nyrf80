import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/vi0ijCQQJTRFc8LA/scene.splinecode" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col items-start">
        <div className="backdrop-blur-sm bg-slate-900/30 border border-emerald-400/20 rounded-2xl p-6 shadow-lg">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Neo Exchange
          </h1>
          <p className="mt-4 text-slate-200 max-w-xl">
            A clean, futuristic crypto platform with live prices, real logos, and a simple wallet connect.
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
    </section>
  )
}

export default Hero
