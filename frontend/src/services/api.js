const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function fetchLatest(entityId) {
  const res = await fetch(
    `${API_URL}/api/sensor/${encodeURIComponent(entityId)}/latest`,
  )
  if (!res.ok) throw new Error('Failed to fetch latest')
  return res.json()
}

export async function fetchHistory(entityId, limit = 50, rangeMinutes = 60) {
  const params = new URLSearchParams({
    limit: String(limit),
    rangeMinutes: String(rangeMinutes),
  })
  const res = await fetch(
    `${API_URL}/api/sensor/${encodeURIComponent(entityId)}/history?${params.toString()}`,
  )
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
