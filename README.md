# Soldier Health Monitoring System

Real-time BPM dashboard for ESP32 + DFRobot SEN0203 heart rate sensor.

## Quick Start

### 1. Backend
```bash
cd server
npm install
node index.js          # starts on http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev            # starts on http://localhost:5173
```

### 3. Mock Simulator (no hardware needed)
```bash
cd server
node simulate.js       # sends fake BPM readings every 1s
```

### 4. ESP32 Hardware
- Edit `esp32/heart_monitor.ino` — set your WiFi SSID/password and server IP
- Flash via Arduino IDE with ESP32 board package installed
- Pin: SEN0203 signal → GPIO 34

## Project Structure
```
minor/
├── server/
│   ├── index.js          # Express app (port 5000)
│   ├── simulate.js       # Mock BPM sender
│   └── routes/bpm.js     # POST /bpm, GET /latest, GET /history
├── client/
│   └── src/
│       ├── components/   # Header, SoldierCard, LiveStatusCard, BPMGraph, AlertsPanel
│       ├── data/soldiers.js  # ← edit soldier info here
│       └── App.jsx
└── esp32/
    └── heart_monitor.ino
```

## Adding More Soldiers
Edit `client/src/data/soldiers.js` and add entries. The backend already accepts `soldierId` in POST body.

## API Reference
| Method | Route | Description |
|---|---|---|
| POST | `/bpm` | Receive BPM `{ bpm: number, soldierId?: string }` |
| GET | `/latest` | Latest reading |
| GET | `/history` | Last 50 readings |