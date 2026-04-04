const express = require('express');
const cors = require('cors');
const bpmRouter = require('./routes/bpm');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', bpmRouter);

app.listen(PORT, () => {
  console.log(`[SERVER] Running on http://localhost:${PORT}`);
});
