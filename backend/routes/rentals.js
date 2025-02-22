const express = require('express');
const router = express.Router();
const db = require('../database');

// Create new rental transaction
router.post('/', (req, res) => {
  const { client_id, rental_date, expected_return_date, price_per_item, items } = req.body;
  // 'items' should be an array of objects: [{ item_id, quantity_rented }]

  db.run(
    `INSERT INTO RentalTransactions (client_id, rental_date, expected_return_date, price_per_item) VALUES (?, ?, ?, ?)`,
    [client_id, rental_date, expected_return_date, price_per_item],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      const rental_id = this.lastID;

      // Process each item in the rental
      const insertRentalItem = db.prepare(`INSERT INTO RentalItems (rental_id, item_id, quantity_rented) VALUES (?, ?, ?)`);
      const updateInventory = db.prepare(`UPDATE Inventory SET total_quantity = total_quantity - ? WHERE item_id = ?`);
      const insertHistory = db.prepare(`INSERT INTO InventoryTransactions (item_id, change_quantity, rental_id) VALUES (?, ?, ?)`);

      items.forEach(({ item_id, quantity_rented }) => {
        // Insert into RentalItems table
        insertRentalItem.run(rental_id, item_id, quantity_rented);

        // Deduct rented quantity from Inventory
        updateInventory.run(quantity_rented, item_id);

        // Log this movement in InventoryTransactions (record as negative)
        insertHistory.run(item_id, -quantity_rented, rental_id);
      });

      // Finalize prepared statements
      insertRentalItem.finalize();
      updateInventory.finalize();
      insertHistory.finalize();

      res.json({ rental_id });
    }
  );
});

module.exports = router;
