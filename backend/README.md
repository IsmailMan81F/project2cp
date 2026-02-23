# Backend

Express API with Prisma and PostgreSQL. Syncs sensor data from Home Assistant every minute, stores readings, exposes REST endpoints and AI chat.

**Tech:** Node.js, Express, Prisma, PostgreSQL, axios, node-cron, OpenAI.

**Setup:** Copy `.env.example` to `.env`, set `DATABASE_URL`. Create DB `esp32_monitor`, run `npm run db:migrate`, then `npm run dev`.

**Endpoints:** `GET /api/health` | `GET /api/sensor/latest` | `GET /api/sensor/history?from=&to=&limit=` | `POST /api/chat` (body: `{ "message": "..." }`)
