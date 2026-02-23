import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <h1 className="text-xl font-semibold">ESP32 Monitor</h1>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors"
        >
          Open Dashboard
        </Link>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Monitor Your ESP32 Sensors
        </h2>
        <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Connect your ESP32 to Home Assistant and visualize temperature data in
          real time. Get AI-powered insights for your smart home.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-semibold text-lg transition-colors"
        >
          Get Started
        </Link>
      </main>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="text-3xl mb-4">📊</div>
          <h3 className="font-semibold text-lg mb-2">Real-time Data</h3>
          <p className="text-slate-400">
            View live temperature readings from your ESP32 sensor via Home
            Assistant.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="font-semibold text-lg mb-2">AI Assistant</h3>
          <p className="text-slate-400">
            Chat with an AI that understands your sensor data and home setup.
          </p>
        </div>
        <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <div className="text-3xl mb-4">📈</div>
          <h3 className="font-semibold text-lg mb-2">History & Graphs</h3>
          <p className="text-slate-400">
            Track trends over days, weeks, and months (coming soon).
          </p>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-500 text-sm">
        ESP32 Monitor — Team Project
      </footer>
    </div>
  )
}
