const express = require('express');
const router = express.Router();
const db = require('../database');

// List all inventory items
router.get('/', (req, res) => {
  db.all('SELECT * FROM Inventory', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ inventory: rows });
  });
});

// Add new inventory item
router.post('/', (req, res) => {
  const { name, description, total_quantity } = req.body;
  db.run(`INSERT INTO Inventory (name, description, total_quantity) VALUES (?, ?, ?)`,
    [name, description, total_quantity],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ item_id: this.lastID });
    });
});

module.exports = router;
