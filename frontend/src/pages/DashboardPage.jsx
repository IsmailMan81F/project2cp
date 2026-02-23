import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { fetchLatest, fetchHistory } from '../services/api.js'

const REFRESH_INTERVAL_MS = 3000

export default function DashboardPage() {
  const [latest, setLatest] = useState(null)
  const [history, setHistory] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setError(null)
        const [latestData, historyData] = await Promise.all([
          fetchLatest(),
          fetchHistory(50),
        ])
        setLatest(latestData)
        setHistory(historyData)
      } catch (err) {
        setError(err.message)
      }
    }
    load()
    const id = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const chartData = history.map((r) => ({
    time: new Date(r.timestamp).toLocaleTimeString(),
    value: r.value,
    full: new Date(r.timestamp),
  })).sort((a, b) => a.full - b.full)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <Link
          to="/"
          className="text-xl font-semibold hover:text-emerald-400 transition-colors"
        >
          ESP32 Monitor
        </Link>
        <nav className="flex items-center gap-4">
          <span className="text-slate-400">Dashboard</span>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>

        <section className="mb-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <h3 className="font-semibold text-lg mb-4">Temperature</h3>
          {error && (
            <p className="text-red-400 mb-4">{error}</p>
          )}
          {latest ? (
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-emerald-400">
                {latest.value.toFixed(1)}
              </span>
              <span className="text-2xl text-slate-400">{latest.unit}</span>
            </div>
          ) : !error ? (
            <p className="text-slate-400">Loading...</p>
          ) : null}
          {latest && (
            <p className="mt-2 text-sm text-slate-500">
              Last updated: {new Date(latest.timestamp).toLocaleString()} · refreshes every {REFRESH_INTERVAL_MS / 1000}s
            </p>
          )}
        </section>

        <section className="mb-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <h3 className="font-semibold text-lg mb-4">History</h3>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-500 py-8 text-center">No history yet</p>
          )}
        </section>

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
