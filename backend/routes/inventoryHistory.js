const express = require('express');
const router = express.Router();
const db = require('../database');

// Get inventory transaction history
router.get('/', (req, res) => {
  db.all('SELECT * FROM InventoryTransactions ORDER BY transaction_date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ history: rows });
  });
});

module.exports = router;
