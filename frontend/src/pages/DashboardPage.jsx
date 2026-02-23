import { Link } from 'react-router-dom'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <Link to="/" className="text-xl font-semibold hover:text-emerald-400 transition-colors">
          ESP32 Monitor
        </Link>
        <nav className="flex items-center gap-4">
          <span className="text-slate-400">Dashboard</span>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>

        {/* Sensor Data Section - placeholder */}
        <section className="mb-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <h3 className="font-semibold text-lg mb-4">Temperature</h3>
          <p className="text-slate-400">
            Sensor data from Home Assistant will appear here. Backend connection
            coming soon.
          </p>
          <div className="mt-4 p-4 bg-slate-900 rounded-lg font-mono text-sm">
            Waiting for data...
          </div>
        </section>

        {/* AI Chat Section - placeholder */}
        <section className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <h3 className="font-semibold text-lg mb-4">AI Suggestions</h3>
          <p className="text-slate-400 mb-4">
            Chat with the AI assistant for insights about your sensor data.
          </p>
          <div className="p-4 bg-slate-900 rounded-lg min-h-[200px] flex items-center justify-center text-slate-500">
            Chat interface coming soon...
          </div>
        </section>
      </main>
    </div>
  )
}
