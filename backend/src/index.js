import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { startSyncJob } from './jobs/syncHomeAssistant.job.js'

const app = express()

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())

app.use('/api', routes)

app.use(errorHandler)

startSyncJob()

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`)
})
