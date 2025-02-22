import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getInventory, getRentals, getInventoryHistory, createClient, createInventoryItem } from '../services/api';
import CreateInventoryItem from './CreateInventoryItem';

function Rentals() {
  const [inventory, setInventory] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [inventoryHistory, setInventoryHistory] = useState([]);

  useEffect(() => {
    // Fetch inventory data from the API
    getInventory()
      .then((response) => {
        setInventory(response.data.inventory);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });

    // Fetch rental data from the API
    getRentals()
      .then((response) => {
        setRentals(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
    
    // Fetch inventory history data from the API
    getInventoryHistory()
      .then((response) => {
        setInventoryHistory(response.data.history);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div className="rentals-container">
      <h1 className="rentals-title">Produkte</h1>
      <CreateInventoryItem />
      <table className="inventory-table">
        <thead>
          <tr className="table-header">
            <th>ID</th>
            <th>Emri</th>
            <th>Pershkrimi</th>
            <th>Totali</th>
            <th>Totali Prezent</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.item_id} className="table-row">
              <td className="table-cell">{item.item_id}</td>
              <td className="table-cell">{item.name}</td>
              <td className="table-cell description-cell">{item.description}</td>
              <td className="table-cell">{item.total_quantity}</td>
              <td className="table-cell">{item.present_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="rentals-title">Qerat</h2>
      <table className="rentals-table">
        <thead>
          <tr className="table-header">
            <th>ID</th>
            <th>ID Produkt</th>
            <th>Emri i Produktit</th>
            <th>Klienti</th>
            <th>Data e Qerjes</th>
            <th>Data e Kthimit</th>
            <th>Data e Kthimit Aktuale</th>
            <th>Sasia</th>
            <th>Cmimi per Artikull</th>
          </tr>
        </thead>
        <tbody>
          {rentals.map((rental) => (
            <tr key={rental.rental_id} className="table-row">
              <td className="table-cell">{rental.rental_id}</td>
              <td className="table-cell">{rental.item_id}</td>
              <td className="table-cell">{rental.item_name}</td>
              <td className="table-cell">{rental.client_name}</td>
              <td className="table-cell">{rental.rental_date}</td>
              <td className="table-cell">{rental.expected_return_date}</td>
              <td className="table-cell">{rental.actual_return_date}</td>
              <td className="table-cell">{rental.quantity_rented}</td>
              <td className="table-cell">{rental.price_per_item}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="rentals-title">Historiku i Inventarit</h2>
      <table className="inventory-history-table">
        <thead>
          <tr className="table-header">
            <th>ID</th>
            <th>Emri</th>
            <th>Sasia e Ndryshuar</th>
            <th>Data e Transaksionit</th>
            <th>ID e Qerat</th>
          </tr>
        </thead>
        <tbody>
          {inventoryHistory.map((transaction) => (
            <tr key={transaction.transaction_id} className="table-row">
              <td className="table-cell">{transaction.transaction_id}</td>
              <td className="table-cell">{transaction.item_id}</td>
              <td className="table-cell">{transaction.change_quantity}</td>
              <td className="table-cell">{transaction.transaction_date}</td>
              <td className="table-cell">{transaction.rental_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
}

export default Rentals; 