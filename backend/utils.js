function formatMetric(value, digits = 2) {
  return Number(value.toFixed(digits));
}

function normalizeCounts(counts, shots) {
  const sortedKeys = Object.keys(counts).sort();
  const normalized = {};

  sortedKeys.forEach((key) => {
    normalized[key] = Number((counts[key] / shots).toFixed(3));
  });

  return normalized;
}

module.exports = {
  formatMetric,
  normalizeCounts
};
