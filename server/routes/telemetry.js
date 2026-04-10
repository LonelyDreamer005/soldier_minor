const express = require('express');
const router = express.Router();
const Telemetry = require('../models/Telemetry');

const MAX_HISTORY = 50;

// POST /telemetry — receive from ESP32 or simulator
router.post(['/telemetry', '/bpm'], async (req, res) => {
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

  try {
    const reading = new Telemetry({
      bpm: bpm || 70,
      temperature: temperature || 36.6,
      location: location || { lat: 17.3850, lng: 78.4867 },
      timestamp: timestamp || new Date(),
      soldierId,
    });

    await reading.save();

    // Emit real-time update via Socket.io
    if (req.io) {
      req.io.emit('telemetryUpdate', reading);
    }

    console.log(`[TELEMETRY] ${reading.soldierId} stored and emitted at ${reading.timestamp}`);
    return res.status(200).json({ success: true, reading });
  } catch (error) {
    console.error('[TELEMETRY] Save Error:', error);
    return res.status(500).json({ error: 'Failed to save telemetry' });
  }
});

// GET /latest — return most recent reading
router.get('/latest', async (req, res) => {
  const { soldierId = 'ALPHA-01' } = req.query;
  try {
    const latest = await Telemetry.findOne({ soldierId }).sort({ timestamp: -1 });
    return res.status(200).json({ data: latest });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch latest data' });
  }
});

// GET /history — return last 50 readings
router.get('/history', async (req, res) => {
  const { soldierId = 'ALPHA-01' } = req.query;
  try {
    const history = await Telemetry.find({ soldierId })
      .sort({ timestamp: -1 })
      .limit(MAX_HISTORY);
    // Return in chronological order
    return res.status(200).json({ data: history.reverse() });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;

