const express = require('express');
const router = express.Router();

const MAX_HISTORY = 50;
const readings = []; // { bpm, timestamp, soldierId }

// POST /bpm — receive from ESP32
router.post('/bpm', (req, res) => {
  const { bpm, timestamp, soldierId = 'ALPHA-01' } = req.body;

  if (typeof bpm !== 'number' || bpm < 30 || bpm > 200) {
    return res.status(400).json({ error: 'BPM must be a number between 30 and 200' });
  }

  const reading = {
    bpm,
    timestamp: timestamp || new Date().toISOString(),
    soldierId,
  };

  readings.push(reading);
  if (readings.length > MAX_HISTORY) readings.shift();

  console.log(`[BPM] ${reading.soldierId} → ${bpm} BPM at ${reading.timestamp}`);
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
