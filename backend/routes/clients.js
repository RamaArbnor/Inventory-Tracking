const express = require('express');
const router = express.Router();
const db = require('../database');

// Get all clients
router.get('/', (req, res) => {
  db.all('SELECT * FROM Clients', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ clients: rows });
  });
});

// Add a new client
router.post('/', (req, res) => {
  const { name, contact_info, address } = req.body;
  db.run(`INSERT INTO Clients (name, contact_info, address) VALUES (?, ?, ?)`,
    [name, contact_info, address],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ client_id: this.lastID });
    });
});

module.exports = router;
