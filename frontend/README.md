# ESP32 Monitor — Frontend

React-based frontend for the ESP32 Monitor project. This application provides a landing page and dashboard for visualizing sensor data from an ESP32 device connected via Home Assistant, with planned AI-assisted insights.

## Tech Stack

- **React 19** — UI framework
- **Vite 7** — Build tool and dev server
- **Tailwind CSS 4** — Utility-first styling
- **React Router 7** — Client-side routing

## Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx    — Marketing landing page with hero and feature sections
│   └── DashboardPage.jsx  — Dashboard view (sensor data and AI chat placeholders)
├── App.jsx                — Root component and route configuration
├── main.jsx               — Application entry point
└── index.css              — Global styles and Tailwind imports
```

## Implemented Features

**Landing Page**
- Header with navigation to dashboard
- Hero section with primary call-to-action
- Feature overview (real-time data, AI assistant, history and graphs)
- Footer

**Dashboard**
- Header with link back to landing page
- Temperature section placeholder (ready for backend integration)
- AI chat section placeholder (ready for backend integration)

**Configuration**
- Two routes: `/` (landing) and `/dashboard`
- Tailwind CSS configured via PostCSS
- Dark theme baseline (slate palette)

## Development

```bash
npm install
npm run dev
```

Runs the development server at `http://localhost:5173`.

## Build

```bash
npm run build
```

Outputs optimized static assets to the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing.

## Planned Integration

- Backend API for live sensor data (Home Assistant)
- WebSocket for real-time updates
- AI chat interface and API integration
- Charts and historical data visualization
