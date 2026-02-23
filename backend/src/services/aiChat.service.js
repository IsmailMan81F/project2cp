import OpenAI from 'openai'
import { config } from '../config/index.js'
import { getLatestReading } from './sensorData.service.js'

const openai = config.openai.apiKey ? new OpenAI({ apiKey: config.openai.apiKey }) : null

/**
 * Send a message to the AI and get a response
 * @param {string} userMessage
 * @param {object} [context] - optional sensor context
 * @returns {Promise<string>}
 */
export async function chat(userMessage, context = {}) {
  if (!openai) {
    return 'AI chat is not configured. Add OPENAI_API_KEY to your environment.'
  }

  const systemPrompt = `You are a helpful assistant for an ESP32 smart home monitoring dashboard. 
You help users understand their sensor data and suggest actions. 
Be concise and practical. ${context.latestTemp != null ? `Current temperature: ${context.latestTemp}°C` : ''}`

  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 500,
  })

  return choices[0]?.message?.content || 'No response.'
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
