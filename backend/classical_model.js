const fs = require('fs');
const path = require('path');

const { formatMetric } = require('./utils');

function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').trim();
  const lines = raw.split(/\r?\n/);
  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = Number(values[index]);
    });
    return row;
  });
}

function mulberry32(seed) {
  let t = seed;
  return function rng() {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(array, seed = 42) {
  const out = [...array];
  const rng = mulberry32(seed);

  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }

  return out;
}

function euclideanDistance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

function knnPredict(trainFeatures, trainLabels, sample, k = 3) {
  const distances = trainFeatures.map((row, index) => ({
    label: trainLabels[index],
    distance: euclideanDistance(row, sample)
  }));

  distances.sort((a, b) => a.distance - b.distance);
  const top = distances.slice(0, k);

  const votes = top.reduce(
    (acc, item) => {
      acc[item.label] += 1;
      return acc;
    },
    { 0: 0, 1: 0 }
  );

  return votes[1] >= votes[0] ? 1 : 0;
}

function runClassicalModel() {
  const dataPath = path.join(__dirname, '..', 'data', 'sample.csv');
  const rows = parseCsv(dataPath);
  const shuffled = shuffle(rows, 42);

  const splitIndex = Math.floor(shuffled.length * 0.7);
  const trainRows = shuffled.slice(0, splitIndex);
  const testRows = shuffled.slice(splitIndex);

  const toFeatures = (row) => [
    row.biomarker_a,
    row.biomarker_b,
    row.gene_variant_score,
    row.age
  ];

  const trainFeatures = trainRows.map(toFeatures);
  const trainLabels = trainRows.map((row) => row.disease_risk);

  let correct = 0;
  testRows.forEach((row) => {
    const predicted = knnPredict(trainFeatures, trainLabels, toFeatures(row), 3);
    if (predicted === row.disease_risk) {
      correct += 1;
    }
  });

  const accuracy = correct / testRows.length;
  return { accuracy: formatMetric(accuracy, 2) };
}

module.exports = { runClassicalModel };
