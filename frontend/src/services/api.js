const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function fetchLatest() {
  const res = await fetch(`${API_URL}/api/sensor/latest`)
  if (!res.ok) throw new Error('Failed to fetch latest')
  return res.json()
}

export async function fetchHistory(limit = 50) {
  const res = await fetch(`${API_URL}/api/sensor/history?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export async function sendChat(message) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json() // { reply }
}
