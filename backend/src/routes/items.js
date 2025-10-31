const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data (intentionally sync to highlight blocking issue)
async function readData() {
  const raw = await fs.readFile(DATA_PATH);
  return JSON.parse(raw);
}

// GET /api/items
router.get('/', async(req, res, next) => {
  try {
    const data = await readData();
    const { limit, page, q } = req.query;
    console.log('Query params:', req.query)
    let results = data;

    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    const parsedLimit = parseInt(limit) || 10;
    const parsedPage = parseInt(page) || 1;
    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = startIndex + parsedLimit;

    results = results.slice(startIndex, endIndex);

    res.json({
      items: results,
      total: data.length,
      page: parsedPage,
      limit: parsedLimit
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async(req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;