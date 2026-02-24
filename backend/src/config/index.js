import 'dotenv/config'

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  homeAssistant: {
    url: process.env.HOME_ASSISTANT_URL || 'http://localhost:8123',
    token: process.env.HOME_ASSISTANT_TOKEN,
    sensorEntityId: process.env.SENSOR_ENTITY_ID || 'sensor.esp32_temperature',
  },
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'openrouter/auto',
  },
}
