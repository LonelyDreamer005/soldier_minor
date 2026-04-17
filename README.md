# Soldier Health Monitoring System

A secure, real-time health and location monitoring dashboard tailored for field operatives. Features live BPM & Temperature tracking and dynamic mapping capabilities.

## Features Added 🚀
- **Biometric Splitting:** Independent tracking of Heart Rate (BPM) and Body Temperature (°C).
- **Secure Authentication:** Integrated JWT-based traditional login system.
- **Live Location Mapping:** Real-time marker deployment initializing at Hyderabad coordinates using `react-leaflet`.
- **Simulated Realism:** Included a standalone mock server (`simulate.js`) that safely feeds organic test data.

## Quick Start

We use `concurrently` to execute the client, server, and simulate scripts simultaneously from a single root terminal window.

### 1. Install Dependencies
Open a terminal in the root directory and install all required packages at once:
```bash
npm run install-all
```
*(This command automatically installs dependencies for the root, `/client`, and `/server` folders. Be sure to configure your environment variables in `server/.env` if you haven't already).*

### 2. Run the Application
Start the full stack, including the frontend, backend, and simulated sensor data, using one simple command:
```bash
npm run dev:sim
```
*   **Frontend**: Starts on `http://localhost:5173`
*   **Backend**: Starts on `http://localhost:5000`
*   **Simulator**: Starts sequentially POSTing mock temperature, BPM, and GPS data to act like an active hardware sensor.

*(If you want to start the client and server without the simulator running, you can run `npm run dev` instead).*

### 4. Logging In
- With your database functional, navigate to your client URL (`http://localhost:5173`).
- **Initial Override:** Use Username: `admin` and Password: `admin`. The database securely generates and hashes this profile automatically upon initialization.

## API Reference
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/login` | Securely validates traditional JWT logins. |
| POST | `/api/telemetry` | Primary ingest pipeline for ESP32 metrics. |
| GET | `/api/latest` | Returns solitary real-time reading snapshot. |
| GET | `/api/history` | Fetches historical timeline (up to 50 ticks) for graphs. |
