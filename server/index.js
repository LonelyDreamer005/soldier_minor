require('dotenv').config();
const express = require('express');
const cors = require('cors');

const telemetryRouter = require('./routes/telemetry');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', telemetryRouter);

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
