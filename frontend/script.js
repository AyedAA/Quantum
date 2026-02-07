const runButton = document.getElementById('runBtn');
const resultBox = document.getElementById('result');

const API_BASE = 'http://127.0.0.1:5000';

function renderResult(data) {
  const accuracy = data.classical?.accuracy;
  const quantum = data.quantum || {};

  let quantumLines = '';
  Object.keys(quantum).forEach((state) => {
    quantumLines += `<li>${state} -> ${quantum[state]}</li>`;
  });

  resultBox.innerHTML = `
    <p><strong>Classical AI Accuracy:</strong> ${accuracy}</p>
    <p><strong>Quantum Output:</strong></p>
    <ul>${quantumLines}</ul>
  `;
}

async function runAnalysis() {
  runButton.disabled = true;
  runButton.textContent = 'Running...';
  resultBox.innerHTML = '<p>Running classical and quantum steps...</p>';

  try {
    const response = await fetch(`${API_BASE}/run`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    const data = await response.json();
    renderResult(data);
  } catch (error) {
    resultBox.innerHTML = '<p>Could not run analysis. Check if backend is running.</p>';
  } finally {
    runButton.disabled = false;
    runButton.textContent = 'Run Analysis';
  }
}

runButton.addEventListener('click', runAnalysis);
