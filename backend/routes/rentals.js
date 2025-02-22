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
      const updateInventory = db.prepare(`UPDATE Inventory SET present_quantity = present_quantity - ? WHERE item_id = ?`);
      const insertHistory = db.prepare(`INSERT INTO InventoryTransactions (item_id, change_quantity, rental_id) VALUES (?, ?, ?)`);

      items.forEach(({ item_id, quantity_rented }) => {
        // Insert into RentalItems table
        insertRentalItem.run(rental_id, item_id, quantity_rented);

        // Deduct rented quantity from present_quantity in Inventory
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

// Get all rental transactions with detailed information
router.get('/', (req, res) => {
  const query = `
    SELECT 
      rt.rental_id,
      rt.rental_date,
      rt.expected_return_date,
      rt.actual_return_date,
      rt.price_per_item,
      c.name AS client_name,
      ri.item_id,
      ri.quantity_rented,
      i.name AS item_name
    FROM RentalTransactions rt
    JOIN Clients c ON rt.client_id = c.client_id
    JOIN RentalItems ri ON rt.rental_id = ri.rental_id
    JOIN Inventory i ON ri.item_id = i.item_id
  `;

  db.all(query, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
