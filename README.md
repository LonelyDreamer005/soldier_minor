# Soldier Health Monitoring System

A secure, real-time health and location monitoring dashboard tailored for field operatives. Features Google OAuth integration, live BPM & Temperature tracking, and dynamic mapping capabilities.

## Features Added 🚀
- **Biometric Splitting:** Independent tracking of Heart Rate (BPM) and Body Temperature (°C).
- **Secure Authentication:** Integrated JWT-based traditional login and Google OAuth via `@react-oauth/google`.
- **Live Location Mapping:** Real-time marker deployment initializing at Hyderabad coordinates using `react-leaflet`.
- **Simulated Realism:** Included a standalone mock server (`simulate.js`) that safely feeds organic test data.

## Quick Start

### 1. Backend Server Setup
Navigate into the server directory and configure your environment variables first.
```bash
cd server
npm install
# You can update .env with real secrets here
npm run dev        # Uses nodemon (starts on http://localhost:5000)
```
> **Note:** If you run using `node index.js`, your server won't auto-reload on code changes!

### 2. Frontend Client Setup
Keep the backend running, then open an additional terminal:
```bash
cd client
npm install
npm run dev        # Uses Vite (starts on http://localhost:5173)
```

### 3. Running the Simulator 
Open a third terminal instance. Ensure your backend server is already running, then execute:
```bash
cd server
npm run simulate   # OR node simulate.js
```
*This script sequentially POSTs mock temperature, BPM, and GPS data into your database, acting like an active hardware sensor.*

### 4. Logging In
- With your database functional, navigate to your client URL (`http://localhost:5173`).
- **Initial Override:** Use Username: `admin` and Password: `admin`. The database securely generates and hashes this profile automatically upon initialization.
- **Google OAuth:** Configure your unique Client ID inside `client/.env` (`VITE_GOOGLE_CLIENT_ID`) to activate 1-click Google integrations.

## API Reference
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Securely validates traditional JWT logins. |
| POST | `/api/auth/google` | Consumes tokens for third-party Oauth access. |
| POST | `/api/telemetry` | Primary ingest pipeline for ESP32 metrics. |
| GET | `/api/latest` | Returns solitary real-time reading snapshot. |
| GET | `/api/history` | Fetches historical timeline (up to 50 ticks) for graphs. |
