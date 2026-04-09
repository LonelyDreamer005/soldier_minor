# IoT Soldier Health Monitoring System: Detailed Project Explanation

This document provides a technical breakdown of the "Soldier Health Monitoring Dashboard" project, covering its architecture, features, and recent implementation steps.

## 1. Project Overview
The system is a full-stack IoT solution designed to monitor the real-time health and position of soldiers. It consists of three primary layers:
1.  **Hardware (ESP32)**: Collects sensor data (BPM, etc.) and sends it to the server.
2.  **Backend (Node.js/Express)**: Receives, processes, and stores telemetry data and user sessions.
3.  **Frontend (React)**: A highly visual, real-time dashboard for tactical oversight.

---

## 2. Core Features & Functionality

### 🩺 Biometric Monitoring
- **Heart Rate (BPM)**: Tracks pulse in real-time. The system categorizes readings into `NORMAL` (60-100), `HIGH` (>100), and `LOW` (<60) with dynamic color-coded UI indicators.
- **Body Temperature**: Monitors soldier temperature to detect heat stroke or fever.
- **Data History**: Maintains a circular buffer of the last 50 readings for trend analysis.

### 📍 GPS Tracking
- **Live Mapping**: Integrated [Leaflet](https://leafletjs.org/) map showing the soldier's current latitude and longitude.
- **Tactical UI**: The map uses a custom dark/tactical filter to match the rest of the dashboard aesthetics.
- **Movement Simulation**: The system can simulate realistic walking paths (currently set in Hyderabad, India).

### 🔐 Security & Authentication
- **JWT-Based Auth**: Secure session management using JSON Web Tokens.
- **Protected Routes**: The dashboard is inaccessible without a valid login.
- **Password Hashing**: User credentials (stored in MongoDB) are secured using `bcryptjs`.
- **Admin Seeding**: For initial setup, the system automatically creates an `admin` account (Password: `admin`) if no users exist in the database.

---

## 3. Technical Implementation Details

### Backend Architecture (`/server`)
- **Express Server**: Handles all API requests.
- **Telemetry Routes**: A unified `/api/telemetry` (and backward-compatible `/bpm`) endpoint receives data from hardware via HTTP POST.
- **Database (MongoDB)**: Transitions from in-memory storage to persistent user data.
- **Simulate Service**: A standalone `simulate.js` script mimics hardware inputs for development testing.

### Frontend Architecture (`/client`)
- **React + Vite**: Built for high performance and fast development.
- **Component breakdown**:
    - `LiveStatusCard`: Large numerical display for current BPM/Temp.
    - `BPMGraph`: Visualizes pulse trends using **Recharts**.
    - `MapComponent`: Real-time location tracking using **Leaflet**.
    - `Login`: Custom-styled credential entry page.
- **Polling Logic**: The frontend polls the server every 1 second for the latest data, ensuring a "live" feel without complex WebSocket overhead.

---

## 4. Recent Modifications (The "What Exactly Was Done" Section)

Recently, the project underwent a significant refactor to streamline security and hardware readiness:

1.  **Removal of Google OAuth**:
    *   Originally, a Google Login option was planned/implemented.
    *   **Decision**: This was removed to simplify the authentication flow and remove external dependencies.
    *   **Action**: Stripped all `react-google-login` / `google-auth-library` code and replaced it with a custom-built Username/Password system.

2.  **Unified Telemetry API**:
    *   Combined individual BPM and GPS routes into a single robust telemetry handler.
    *   Added validation to ensure only valid health data (BPM 30-200, Temp 20-50) is accepted.

3.  **Enhanced Simulation**:
    *   Updated the simulator to generate "human-like" data fluctuations (slowly rising temperature during movement, jittery GPS coordinates, etc.).

4.  **UI Refinement**:
    *   Split the combined status card into separate, dedicated cards for **Heart Rate** and **Temperature** for better readability.
    *   Implemented "Glow Status" effects: The cards pulse with color (Red/Green/Blue) based on the soldier's health status.

---

## 5. How to Run the Project

1.  **Start the Backend**:
    *   Go to `/server`, run `npm install`.
    *   Set up `.env` with `MONGO_URI` and `JWT_SECRET`.
    *   Run `npm start`.
2.  **Start the Simulation** (Optional):
    *   In `/server`, run `node simulate.js`.
3.  **Start the Frontend**:
    *   Go to `/client`, run `npm install`.
    *   Run `npm run dev`.
4.  **Login**: Use `admin` / `admin` to access the dashboard.
