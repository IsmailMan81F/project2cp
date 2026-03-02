# ESP32 Monitor  

Full-stack app: ESP32 sensors via Home Assistant, temperature display, AI assistant. Frontend (React, Vite, Tailwind). Backend (Express, Prisma, PostgreSQL). Landing page, dashboard, sensor API, chat API.

**Run frontend:** `cd frontend && npm install && npm run dev` (http://localhost:5173)

**Run backend:** `cp backend/.env.example backend/.env`, set `DATABASE_URL`, `createdb esp32_monitor`, `cd backend && npm run db:migrate && npm run dev`
