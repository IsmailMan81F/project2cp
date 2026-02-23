import { Router } from 'express'
import { chatWithContext } from '../services/aiChat.service.js'
import { config } from '../config/index.js'

const router = Router()
const entityId = config.homeAssistant.sensorEntityId

router.post('/', async (req, res, next) => {
  try {
    const { message } = req.body
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' })
    }
    const reply = await chatWithContext(message.trim(), entityId)
    res.json({ reply })
  } catch (err) {
    next(err)
  }
})

export default router
