# ESP32 Monitor — Backend

Node.js + Express API. Connects to Home Assistant for sensor data and provides AI chat.

## Setup

1. Copy `.env.example` to `.env` and fill in values.
2. Create the database: `createdb esp32_monitor`
3. Run migrations: `npm run db:migrate`
4. Install and start: `npm install && npm run dev`

## Endpoints

- `GET /api/health` — Health check
- `GET /api/sensor/latest` — Latest temperature reading
- `GET /api/sensor/history?from=&to=&limit=` — Historical readings
- `POST /api/chat` — AI chat (body: `{ "message": "..." }`)
