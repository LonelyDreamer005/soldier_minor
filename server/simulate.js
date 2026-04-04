// simulate.js — sends fake BPM readings to the server every 1 second
// Usage: node simulate.js
const http = require('http');

const SERVER_HOST = 'localhost';
const SERVER_PORT = 5000;
let tick = 0;

function randomBPM() {
  // Cycle through normal, high, and low zones for demo purposes
  const cycle = Math.floor(tick / 15) % 3;
  if (cycle === 0) return Math.floor(Math.random() * 30) + 60;   // 60–90 NORMAL
  if (cycle === 1) return Math.floor(Math.random() * 30) + 101;  // 101–130 HIGH
  return Math.floor(Math.random() * 15) + 35;                    // 35–50 LOW
}

function postBPM() {
  const bpm = randomBPM();
  const body = JSON.stringify({ bpm, soldierId: 'ALPHA-01' });

  const options = {
    hostname: SERVER_HOST,
    port: SERVER_PORT,
    path: '/bpm',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const req = http.request(options, (res) => {
    process.stdout.write(`[SIM] BPM=${bpm} → ${res.statusCode}\n`);
  });

  req.on('error', (e) => {
    console.error(`[SIM] Error: ${e.message}`);
  });

  req.write(body);
  req.end();
  tick++;
}

console.log('[SIM] Simulator started. Sending BPM every 1s...');
postBPM();
setInterval(postBPM, 1000);
