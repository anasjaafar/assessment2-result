const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../../data/items.json');

let cachedStats = null;
let lastUpdated = null;

function calculateStats(items) {
  if (!items.length) {
    return { total: 0, averagePrice: 0 };
  }
  const total = items.length;
  const averagePrice = items.reduce((sum, i) => sum + i.price, 0) / total;
  return { total, averagePrice };
}

function refreshCache() {
  fs.readFile(DATA_PATH, 'utf-8', (err, raw) => {
    if (err) {
      console.error('Failed to read data file:', err);
      return;
    }
    try {
      const items = JSON.parse(raw);
      cachedStats = calculateStats(items);
      lastUpdated = new Date();
      console.log(`[Cache refreshed at ${lastUpdated.toISOString()}]`);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
    }
  });
}

fs.watch(DATA_PATH, { persistent: false }, (eventType) => {
  if (eventType === 'change') {
    console.log('Data file changed, refreshing cache...');
    refreshCache();
  }
});

refreshCache();

// GET /api/stats
router.get('/', (req, res, next) => {
  if (!cachedStats) {
    fs.readFile(DATA_PATH, 'utf-8', (err, raw) => {
      if (err) return next(err);
      const items = JSON.parse(raw);
      const stats = calculateStats(items);
      return res.json({ ...stats, lastUpdated: new Date() });
    });
  } else {
    res.json({ ...cachedStats, lastUpdated });
  }
});

module.exports = router;