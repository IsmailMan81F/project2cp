import "dotenv/config";

const corsOrigins = JSON.parse(process.env.CORS_ORIGIN);


export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  databaseUrl: process.env.DATABASE_URL,
  corsOrigin: corsOrigins,
  homeAssistant: {
    url: process.env.HOME_ASSISTANT_URL || "http://localhost:8123",
    token: process.env.HOME_ASSISTANT_TOKEN,
    sensorEntityIds: [
      process.env.TEMPERATURE_ENTITY_ID,
      process.env.HUMIDITY_ENTITY_ID,
    ],
  },
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || "openrouter/auto",
  },
};
