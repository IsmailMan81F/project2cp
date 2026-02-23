import { getEntityState } from '../services/homeAssistant.service.js'
import { createReading } from '../services/sensorData.service.js'
import { config } from '../config/index.js'

const entityId = config.homeAssistant.sensorEntityId

async function sync() {
  if (!config.homeAssistant.token) {
    console.warn('Home Assistant token not set, skipping sync')
    return
  }
  try {
    const state = await getEntityState(entityId)
    if (!state) return
    await createReading({
      entityId,
      value: state.value,
      unit: state.unit || '°C',
      rawData: state.raw,
    })
  } catch (err) {
    console.error('Sync error:', err.message)
  }
}

const SYNC_INTERVAL_MS = 3000

export function startSyncJob() {
  sync()
  setInterval(sync, SYNC_INTERVAL_MS)
}
