const http = require('http');

const SERVER_HOST = 'localhost';
const SERVER_PORT = 5000;
let tick = 0;

// Starting position: Hyderabad
let lat = 17.5388;
let lng = 78.3854;

function randomBPM() {
  const cycle = Math.floor(tick / 15) % 3;
  if (cycle === 0) return Math.floor(Math.random() * 20) + 70;   // 70–90 NORMAL
  if (cycle === 1) return Math.floor(Math.random() * 30) + 110;  // 110–140 HIGH
  return Math.floor(Math.random() * 15) + 45;                    // 45–60 LOW
}

function randomTemp() {
  // Normal body temp is 36.5–37.5
  // Simulate slight increase during "high BPM" cycle
  const cycle = Math.floor(tick / 15) % 3;
  let base = 36.6;
  if (cycle === 1) base = 38.2; // Fever/Exertion
  return parseFloat((base + (Math.random() * 0.5)).toFixed(1));
}

function updateLocation() {
  // Simulate slow movement (roughly walking speed)
  lat += (Math.random() - 0.5) * 0.0005;
  lng += (Math.random() - 0.5) * 0.0005;
  return { lat, lng };
}

function postTelemetry() {
  const bpm = randomBPM();
  const temperature = randomTemp();
  const location = updateLocation();

  const body = JSON.stringify({
    bpm,
    temperature,
    location,
    soldierId: 'ALPHA-01'
  });

  const options = {
    hostname: SERVER_HOST,
    port: SERVER_PORT,
    path: '/api/telemetry',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const req = http.request(options, (res) => {
    // Silent success, only log errors or state changes
    if (res.statusCode !== 200) {
      console.error(`[SIM] Failed to post: ${res.statusCode}`);
    }
  });

  req.on('error', (e) => {
    console.error(`[SIM] Error: ${e.message}`);
  });

  req.write(body);
  req.end();

  if (tick % 5 === 0) {
    console.log(`[SIM] Tick ${tick}: BPM=${bpm}, Temp=${temperature}°C, Pos=${lat.toFixed(4)},${lng.toFixed(4)}`);
  }
  tick++;
}

console.log('[SIM] Advanced Telemetry Simulator started...');
postTelemetry();
setInterval(postTelemetry, 1000);
