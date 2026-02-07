const path = require('path');
const { spawnSync } = require('child_process');
const { normalizeCounts } = require('./utils');

function runPython(scriptPath, shots) {
  const localPython = path.join(__dirname, '.venv', 'Scripts', 'python.exe');
  const candidates = [
    { cmd: localPython, args: [scriptPath, String(shots)] },
    { cmd: 'python', args: [scriptPath, String(shots)] },
    { cmd: 'py', args: ['-3', scriptPath, String(shots)] }
  ];

  let lastRun = null;
  for (const candidate of candidates) {
    const run = spawnSync(candidate.cmd, candidate.args, { encoding: 'utf8' });
    if (!run.error && run.status === 0) {
      return run;
    }
    lastRun = run;
  }

  return lastRun;
}

function runQuantumDemo(shots = 1024) {
  const scriptPath = path.join(__dirname, 'quantum_demo.py');
  const run = runPython(scriptPath, shots);

  if (run.error || run.status !== 0) {
    const details = (run.stderr || run.error?.message || '').trim();
    return {
      error: 'Quantum demo failed. Install qiskit in backend/.venv.',
      details
    };
  }

  try {
    const counts = JSON.parse(run.stdout.trim());
    return normalizeCounts(counts, shots);
  } catch (error) {
    return {
      error: 'Quantum demo returned invalid output.',
      details: String(error.message || error)
    };
  }
}

module.exports = { runQuantumDemo };
