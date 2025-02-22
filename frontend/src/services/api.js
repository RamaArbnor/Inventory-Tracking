import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const getClients = () => axios.get(`${API_BASE}/clients`);
export const createClient = (data) => axios.post(`${API_BASE}/clients`, data);

export const getInventory = () => axios.get(`${API_BASE}/inventory`);
export const createInventoryItem = (data) => axios.post(`${API_BASE}/inventory`, data);

export const getRentals = () => axios.get(`${API_BASE}/rentals`);
export const createRental = (data) => axios.post(`${API_BASE}/rentals`, data);
export const updateRental = (id, data) => axios.put(`${API_BASE}/rentals/${id}`, data);

export const getInventoryHistory = () => axios.get(`${API_BASE}/inventory-history`);
