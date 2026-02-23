import { Router } from 'express'
import { prisma } from '../db/index.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', database: 'connected' })
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected' })
  }
})

export default router
