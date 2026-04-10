const mongoose = require('mongoose');

const telemetrySchema = new mongoose.Schema({
  soldierId: { type: String, required: true, index: true },
  bpm: { type: Number, required: true },
  temperature: { type: Number, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  timestamp: { type: Date, default: Date.now, index: true }
});

// Create a compound index for efficient querying of latest data for a specific soldier
telemetrySchema.index({ soldierId: 1, timestamp: -1 });

module.exports = mongoose.model('Telemetry', telemetrySchema);
