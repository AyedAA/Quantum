const express = require('express');
const cors = require('cors');

const { runClassicalModel } = require('./classical_model');
const { runQuantumDemo } = require('./quantum_model');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/run', (_req, res) => {
  const classical = runClassicalModel();
  const quantum = runQuantumDemo();

  res.json({ classical, quantum });
});

app.listen(port, () => {
  console.log(`Backend running on http://127.0.0.1:${port}`);
});
