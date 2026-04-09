require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const telemetryRouter = require('./routes/telemetry');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/soldier_health';

app.use(cors());
app.use(express.json());

// Connect to Database
mongoose.connect(MONGODB_URI)
  .then(() => console.log('[SERVER] Connected to MongoDB via Mongoose'))
  .catch(err => console.error('[SERVER] MongoDB connection error:', err));

app.use('/api', telemetryRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
