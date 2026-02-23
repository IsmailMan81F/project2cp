import { Router } from 'express'
import sensorRoutes from './sensor.routes.js'
import chatRoutes from './chat.routes.js'
import healthRoutes from './health.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/sensor', sensorRoutes)
router.use('/chat', chatRoutes)

export default router
