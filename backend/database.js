const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./inventory.db');

// Create tables if they don't exist
db.serialize(() => {
  // Clients
  db.run(`
    CREATE TABLE IF NOT EXISTS Clients (
      client_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_info TEXT,
      address TEXT
    )
  `);

  // Inventory
  db.run(`
    CREATE TABLE IF NOT EXISTS Inventory (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      total_quantity INTEGER NOT NULL
    )
  `);

  // RentalTransactions
  db.run(`
    CREATE TABLE IF NOT EXISTS RentalTransactions (
      rental_id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER,
      rental_date TEXT NOT NULL,
      expected_return_date TEXT NOT NULL,
      actual_return_date TEXT,
      price_per_item REAL NOT NULL,
      FOREIGN KEY (client_id) REFERENCES Clients(client_id)
    )
  `);

  // RentalItems (if multiple item types per rental)
  db.run(`
    CREATE TABLE IF NOT EXISTS RentalItems (
      rental_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      rental_id INTEGER,
      item_id INTEGER,
      quantity_rented INTEGER NOT NULL,
      FOREIGN KEY (rental_id) REFERENCES RentalTransactions(rental_id),
      FOREIGN KEY (item_id) REFERENCES Inventory(item_id)
    )
  `);

  // InventoryTransactions (History)
  db.run(`
    CREATE TABLE IF NOT EXISTS InventoryTransactions (
      transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER,
      change_quantity INTEGER NOT NULL,
      transaction_date TEXT DEFAULT (datetime('now')),
      rental_id INTEGER,
      FOREIGN KEY (item_id) REFERENCES Inventory(item_id),
      FOREIGN KEY (rental_id) REFERENCES RentalTransactions(rental_id)
    )
  `);

  // (Optional) Users for authentication
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT
    )
  `);
});

module.exports = db;
