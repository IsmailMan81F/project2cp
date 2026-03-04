import { Router } from 'express'
import { chatWithContext } from '../services/aiChat.service.js'
import { config } from '../config/index.js'

const router = Router()
const entityIds = config.homeAssistant.sensorEntityIds

router.post('/', async (req, res, next) => {
  try {
    const { message } = req.body
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' })
    }
    const reply = await chatWithContext(message.trim(), entityIds)
    res.json({ reply })
  } catch (err) {
    next(err)
    console.log(err)
  }
})

export default router
