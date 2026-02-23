# ESP32 Monitor

Full-stack web app to monitor ESP32 sensors via Home Assistant. Displays temperature data and provides an AI assistant for smart home insights.

## Current Status

**Frontend** — React + Vite + Tailwind. Landing page and dashboard.

**Backend** — Node.js + Express. Home Assistant sync, sensor API, AI chat.

## Run

**Frontend:**
```bash
cd frontend && npm install && npm run dev
```
Then open http://localhost:5173.

**Backend:**
1. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` (PostgreSQL).
2. Create DB: `createdb esp32_monitor`
3. Migrate: `cd backend && npm run db:migrate`
4. Start: `npm run dev`

## Structure

```
project-website/
├── frontend/     React app
└── backend/      Express API
```
