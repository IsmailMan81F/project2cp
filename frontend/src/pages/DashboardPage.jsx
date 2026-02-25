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
import { fetchLatest, fetchHistory, sendChat } from '../services/api.js'

const REFRESH_INTERVAL_MS = 10000

// Replace with your actual entity IDs
const TEMPERATURE_ENTITY_ID = 'sensor.esp32_dht22_temperature'
const HUMIDITY_ENTITY_ID = 'sensor.esp32_dht22_humidity'

export default function DashboardPage() {
  const [latestTemp, setLatestTemp] = useState(null)
  const [latestHumidity, setLatestHumidity] = useState(null)
  const [historyTemp, setHistoryTemp] = useState([])
  const [historyHumidity, setHistoryHumidity] = useState([])
  const [error, setError] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatError, setChatError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        setError(null)
        const [
          latestTempData,
          latestHumidityData,
          historyTempData,
          historyHumidityData,
        ] = await Promise.all([
          fetchLatest(TEMPERATURE_ENTITY_ID),
          fetchLatest(HUMIDITY_ENTITY_ID),
          fetchHistory(TEMPERATURE_ENTITY_ID, 50),
          fetchHistory(HUMIDITY_ENTITY_ID, 50),
        ])
        setLatestTemp(latestTempData)
        setLatestHumidity(latestHumidityData)
        setHistoryTemp(historyTempData)
        setHistoryHumidity(historyHumidityData)
      } catch (err) {
        setError(err.message)
      }
    }
    load()
    const id = setInterval(load, REFRESH_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  const chartDataTemp = historyTemp
    .map((r) => ({
      time: new Date(r.timestamp).toLocaleTimeString(),
      value: r.value,
      full: new Date(r.timestamp),
    }))
    .sort((a, b) => a.full - b.full)

  const chartDataHumidity = historyHumidity
    .map((r) => ({
      time: new Date(r.timestamp).toLocaleTimeString(),
      value: r.value,
      full: new Date(r.timestamp),
    }))
    .sort((a, b) => a.full - b.full)

  async function handleSendChat(e) {
    e.preventDefault()
    const text = chatInput.trim()
    if (!text) return
    const userMessage = { role: 'user', content: text }
    setChatMessages((prev) => [...prev, userMessage])
    setChatInput('')
    setChatLoading(true)
    setChatError(null)
    try {
      const { reply } = await sendChat(text)
      const aiMessage = { role: 'assistant', content: reply }
      setChatMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      setChatError(err.message || 'Failed to send message')
    } finally {
      setChatLoading(false)
    }
  }

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

        {/* Current values */}
        <section className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <h3 className="font-semibold text-lg mb-4">Temperature</h3>
            {error && (
              <p className="text-red-400 mb-4">{error}</p>
            )}
            {latestTemp ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-emerald-400">
                    {latestTemp.value.toFixed(1)}
                  </span>
                  <span className="text-2xl text-slate-400">
                    {latestTemp.unit}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Last updated:{' '}
                  {new Date(latestTemp.timestamp).toLocaleString()} · refreshes
                  every {REFRESH_INTERVAL_MS / 1000}s
                </p>
              </>
            ) : !error ? (
              <p className="text-slate-400">Loading...</p>
            ) : null}
          </div>

          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <h3 className="font-semibold text-lg mb-4">Humidity</h3>
            {latestHumidity ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-sky-400">
                    {latestHumidity.value.toFixed(1)}
                  </span>
                  <span className="text-2xl text-slate-400">
                    {latestHumidity.unit}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Last updated:{' '}
                  {new Date(latestHumidity.timestamp).toLocaleString()} · refreshes
                  every {REFRESH_INTERVAL_MS / 1000}s
                </p>
              </>
            ) : !error ? (
              <p className="text-slate-400">Loading...</p>
            ) : null}
          </div>
        </section>

        {/* History graphs */}
        <section className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <h3 className="font-semibold text-lg mb-4">Temperature History</h3>
            {chartDataTemp.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartDataTemp}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                      }}
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
          </div>

          <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
            <h3 className="font-semibold text-lg mb-4">Humidity History</h3>
            {chartDataHumidity.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartDataHumidity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#38bdf8"
                      strokeWidth={2}
                      dot={{ fill: '#38bdf8', r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-slate-500 py-8 text-center">No history yet</p>
            )}
          </div>
        </section>

        <section className="p-6 rounded-xl bg-slate-800/50 border border-slate-700">
          <h3 className="font-semibold text-lg mb-4">AI Suggestions</h3>
          <p className="text-slate-400 mb-4">
            Chat with the AI assistant for insights about your sensor data.
          </p>
          <div className="p-4 bg-slate-900 rounded-lg min-h-[260px] flex flex-col rounded-lg">
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1">
              {chatMessages.length === 0 && !chatError && (
                <p className="text-slate-500 text-sm">
                  Ask something like: &quot;Is my current temperature comfortable?&quot;
                </p>
              )}
              {chatMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white ml-auto'
                      : 'bg-slate-800 text-slate-100 mr-auto'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {chatError && (
                <p className="text-red-400 text-sm">{chatError}</p>
              )}
            </div>
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask the assistant..."
                className="flex-1 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={chatLoading}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-sm font-medium"
              >
                {chatLoading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
