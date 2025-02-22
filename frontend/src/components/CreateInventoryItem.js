import React, { useState } from 'react';
import { createInventoryItem } from '../services/api';
import './CreateInventoryItem.css'; // Import CSS for styling

function CreateInventoryItem() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false); // State to manage modal visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const newItem = {
      name,
      description,
      total_quantity: totalQuantity,
    };

    createInventoryItem(newItem)
      .then((response) => {
        alert(`Item created with ID: ${response.data.item_id}`);
        // Reset form fields
        setName('');
        setDescription('');
        setTotalQuantity(0);
        setIsOpen(false); // Close modal after successful creation
      })
      .catch((err) => {
        setError('Error creating item: ' + err.message);
      });
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="open-modal-button">Shto produkte ne inventar</button>
      
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Shto produkte ne inventar</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div>
                <label>Emri:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Pershkrim:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label>Sasia:</label>
                <input
                  type="number"
                  value={totalQuantity}
                  onChange={(e) => setTotalQuantity(Number(e.target.value))}
                  required
                />
              </div>
              <button type="submit">Krijo Produkt</button>
              <button type="button" onClick={() => setIsOpen(false)}>Mbyll</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateInventoryItem; 