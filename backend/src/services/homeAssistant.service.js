import axios from 'axios'
import { config } from '../config/index.js'

const ha = axios.create({
  baseURL: config.homeAssistant.url,
  headers: {
    Authorization: `Bearer ${config.homeAssistant.token}`,
    'Content-Type': 'application/json',
  },
})

/**
 * Fetch the current state of an entity from Home Assistant
 * @param {string} entityId - HA entity ID (e.g. sensor.esp32_temperature)
 * @returns {Promise<{ state: string, value: number, unit?: string } | null>}
 */
export async function getEntityState(entityId) {
  try {
    const { data } = await ha.get(`/api/states/${entityId}`)
    const state = data.state
    const value = parseFloat(state)
    const unit = data.attributes?.unit_of_measurement || '°C'
    if (isNaN(value)) return null
    return { state, value, unit, raw: data }
  } catch (err) {
    if (err.response?.status === 404) return null
    throw err
  }
}
