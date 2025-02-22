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
  const present_quantity = total_quantity; // Initialize present_quantity to total_quantity

  // Insert the new inventory item
  db.run(`INSERT INTO Inventory (name, description, total_quantity, present_quantity) VALUES (?, ?, ?, ?)`,
    [name, description, total_quantity, present_quantity],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });

      // Log this addition in InventoryTransactions
      const item_id = this.lastID; // Get the ID of the newly created item
      db.run(`INSERT INTO InventoryTransactions (item_id, change_quantity, rental_id) VALUES (?, ?, ?)`,
        [item_id, present_quantity, null], // No rental_id since it's a new item
        function(err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ item_id: this.lastID });
        });
    });
});

module.exports = router;
