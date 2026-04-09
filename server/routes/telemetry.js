const express = require('express');
const router = express.Router();

const MAX_HISTORY = 50;
const readings = []; // { bpm, temperature, location: { lat, lng }, timestamp, soldierId }

// POST /telemetry — receive from ESP32 or simulator
router.post(['/telemetry', '/bpm'], (req, res) => {
  const { bpm, temperature, location, timestamp, soldierId = 'ALPHA-01' } = req.body;

  // Validation
  if (bpm && (typeof bpm !== 'number' || bpm < 30 || bpm > 200)) {
    return res.status(400).json({ error: 'Invalid BPM' });
  }
  if (temperature && (typeof temperature !== 'number' || temperature < 20 || temperature > 50)) {
    return res.status(400).json({ error: 'Invalid Temperature' });
  }
  if (location && (typeof location.lat !== 'number' || typeof location.lng !== 'number')) {
    return res.status(400).json({ error: 'Invalid Location' });
  }

  const reading = {
    bpm: bpm || (readings.length > 0 ? readings[readings.length - 1].bpm : 70),
    temperature: temperature || (readings.length > 0 ? readings[readings.length - 1].temperature : 36.6),
    location: location || (readings.length > 0 ? readings[readings.length - 1].location : { lat: 28.6139, lng: 77.2090 }),
    timestamp: timestamp || new Date().toISOString(),
    soldierId,
  };

  readings.push(reading);
  if (readings.length > MAX_HISTORY) readings.shift();

  console.log(`[TELEMETRY] ${reading.soldierId} updated at ${reading.timestamp}`);
  return res.status(200).json({ success: true, reading });
});

// GET /latest — return most recent reading
router.get('/latest', (req, res) => {
  if (readings.length === 0) {
    return res.status(200).json({ data: null });
  }
  return res.status(200).json({ data: readings[readings.length - 1] });
});

// GET /history — return last 50 readings
router.get('/history', (req, res) => {
  return res.status(200).json({ data: readings });
});

module.exports = router;
