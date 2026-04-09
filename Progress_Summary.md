# Project Progress Summary: IoT Soldier Health Monitoring Dashboard

Here is a comprehensive summary of all the tasks completed so far to build the IoT dashboard.

## 1. Backend Infrastructure Configured
- **Dependencies Installed**: Node.js, `express`, and `cors`.
- **Server Entry Point (`server/index.js`)**: Configured an Express application to run on port 5000, supporting Cross-Origin Resource Sharing (CORS) and JSON payloads.
- **API Endpoints (`server/routes/bpm.js`)**: 
  - `POST /bpm`: Validates incoming BPM readings (must be between 30 and 200). It adds the reading to a circular in-memory buffer (retaining the last 50 readings) with a timestamp.
  - `GET /latest`: Returns the most recently recorded reading.
  - `GET /history`: Returns the entire array of the last 50 readings.
- **Hardware Mocking (`server/simulate.js`)**: Created a simulator that fires POST requests every 1 second, intelligently cycling between 'NORMAL', 'HIGH', and 'LOW' heart-rate states to help test the system UI without the physical ESP32 connected.

## 2. Frontend Foundation Scaffolded
- **React + Vite Setup (`client`)**: Initialized a fast React environment using Vite (`npx create-vite`).
- **Dependencies**: Added `recharts` for charting.
- **CORS proxy**: Configured `vite.config.js` to proxy `/latest`, `/history`, and `/bpm` from the Vite dev server (port 5173) to the Express backend (port 5000), avoiding CORS errors during local development.

## 3. UI/UX and Theming Implemented
- **Design System (`client/src/index.css`)**: Established a custom, dark military aesthetic without using heavier CSS frameworks. Added glowing shadow variables mapped to statuses (`--green-glow`, `--red-glow`, etc.).
- **Typography Integration**: Linked Google Fonts (`Share Tech Mono`, `Rajdhani`, `Orbitron`).
- **Responsive Layout**: Designed a CSS Grid layout that collapses to a single column on mobile screens.

## 4. Frontend Components Built
- `Header.jsx`: Shows "SOLDIER HEALTH MONITORING SYSTEM" along with a synchronized clock.
- `SoldierCard.jsx`: Displays static soldier data (using a `soldiers.js` registry array containing Pvt. Arjun Mehta, making it easy to list more soldiers).
- `LiveStatusCard.jsx`: Features the primary, large BPM number along with a dynamic status badge. The text and border automatically transition colors based on the heart rate (Green/NORMAL, Red/HIGH, Blue/LOW, Grey/NO_SIGNAL).
- `BPMGraph.jsx`: Integrates `recharts` to render the history of the last 50 readings, featuring dashed reference lines explicitly placed at 50 BPM and 100 BPM levels.
- `AlertsPanel.jsx`: Triggers alerts on elevated or suppressed heart rates, holding the 10 most recent anomalies and formatting times using relative values (e.g., "30s ago").

## 5. View Logic & Polling (`App.jsx`)
- Put together asynchronous Javascript polling functionality that executes `fetch('/latest')` every 1000 milliseconds and `fetch('/history')` every 3000 milliseconds.
- Computes whether there is a connection drop (3 failed network requests) and reveals a "⚠ CONNECTION LOST" safety banner.
- Computes alerts dynamically on the frontend whenever it enters a new heart-rate state block.

## 6. Embedded Hardware Setup Completed
- **Arduino Sketch (`esp32/heart_monitor.ino`)**: Created a C++ blueprint using `WiFi.h` and `HTTPClient.h` libraries.
- The loop parses an analog PIN (`GPIO 34`) corresponding to a DFRobot SEN0203 sensor, converting the voltage value cleanly into a 30-200 BPM int, and sends it directly via `HTTPClient HTTP POST` requests to the Node.js server loop.

## 7. Hardware Integration Flexibility (Arduino / Python)
- **Agnostic Receiver Architecture**: The Node.js dashboard acts strictly as a passive receiver. It doesn't care how the physical hardware works or how the analysis is done.
- **Easy Team Handoff**: The team currently in possession of the physical IoT device (running basic Arduino and Python analysis scripts) **does not need to alter their core logic at all.**
- **Single Integration Step**: All they need to do is add a standard `HTTP POST` request to their existing Arduino or Python code to send the finalized BPM number to `http://<backend-ip>:5000/bpm` using the simple JSON payload structure: `{"bpm": 75, "soldierId": "ALPHA-01"}`.

## 9. Phase 2: Multi-Parameter Expansion (GPS & Temperature)
- **Telemetry System Upgrade**: Expanded the data schema to include `temperature` (Body/Environment) and `location` (Live latitude/longitude GPS data).
- **Backend Refactoring (`server/routes/telemetry.js`)**:
  - Replaced the single-param BPM route with a unified `/api/telemetry` endpoint.
  - Implemented backward compatibility for the original `/bpm` route.
- **Advanced Simulation**: Updated the simulator to generate realistic GPS walking paths (starting in New Delhi) and fluctuating body temperatures (fever/exertion simulation).
- **Frontend Live Dashboard Expansion**:
  - **Map Integration**: Added a high-performance Leaflet-based Map component that displays the soldier's position in real-time with automatic centering and marker tracking.
  - **Biometrics Grid**: Redesigned the `LiveStatusCard` to show both BPM and Temperature in a clean, high-tech grid.
  - **Dynamic Theming**: Added "Tactical Dark" styling to the map using CSS filters to match the military aesthetic.
- **Vite Proxy Update**: Configured the client to point to the new `/api` routes on the backend.

## 11. Phase 3: Security & UI Refinement
- **Authentication & Access Control**:
  - Implemented secure JWT-based authentication for traditional Username/Password login.
  - Secured the dashboard using JWT-based session management and React Router protected routes.
  - Connected the backend to MongoDB (Mongoose) for persistent user storage and credential management (with bcrypt hashing).
- **Dashboard UI Optimization**:
  - Refactored the telemetry grid: Split Heart Rate (BPM) and Body Temperature into two independent, visually distinct cards for improved tactical oversight.
  - Enhanced responsive behavior and status-based dynamic glow effects.
- **Mission Location Update**:
  - Shifted default map and simulation coordinates to Hyderabad, India (`17.3850, 78.4867`).
- **Configuration Management**:
  - Centralized environment variables using `.env` for both frontend (Vite) and backend (Express).

## 12. Current Project State
The project has reached **Phase 3 Maturity**:
1. **Authenticated Access**: Users must log in via credentials to access the dashboard.
2. **Modular Telemetry**: Heart rate, temperature, and GPS are tracked via independent, high-performance components.
3. **Database Integration**: User profiles and telemetry (transitioning) are managed via MongoDB.
4. **Ready for Hardware**: The system is fully prepared to switch from simulation to real ESP32 sensor data with minimal configuration.

