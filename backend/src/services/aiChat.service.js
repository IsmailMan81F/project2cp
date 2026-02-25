import axios from 'axios'
import { config } from '../config/index.js'
import { getLatestReading } from './sensorData.service.js'

const openRouterClient = config.openRouter.apiKey
  ? axios.create({
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        Authorization: `Bearer ${config.openRouter.apiKey}`,
        'Content-Type': 'application/json',
      },
    })
  : null

/**
 * Send a message to the AI and get a response
 * @param {string} userMessage
 * @param {object} [context] - optional sensor context
 * @returns {Promise<string>}
 */
export async function chat(userMessage, context = {}) {
  if (!openRouterClient) {
    return 'AI chat is not configured. Add OPENROUTER_API_KEY to your environment.'
  }

  const systemPrompt = `You are a helpful assistant for an ESP32 smart home monitoring dashboard. 
You help users understand their sensor data and suggest actions. 
Be concise and practical. ${context.latestTemp != null ? `Current temperature: ${context.latestTemp}°C` : ''}`

  const { data } = await .post('/chat/completions', {
    model: config.openRouter.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 500,
  })

  return data.choices?.[0]?.message?.content?.trim() || 'No response.'
}

/**
 * Get AI response with sensor context
 * @param {string} userMessage
 * @param {string} [entityId]
 * @returns {Promise<string>}
 */
export async function chatWithContext(userMessage, entityId) {
  let context = {}
  if (entityId) {
    const latest = await getLatestReading(entityId)
    if (latest) context.latestTemp = latest.value
  }
  return chat(userMessage, context)
}
