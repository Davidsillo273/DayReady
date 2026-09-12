// Llamadas a /customers (backend/src/routes/customerRoutes.js). No existe
// un endpoint "/me", así que el perfil del cliente logueado se busca
// filtrando por correo (igual que hace la búsqueda de admin).
const API_BASE_URL = 'http://localhost:4000/api';

export const getCustomerByEmail = async (email) => {
  const response = await fetch(`${API_BASE_URL}/customers?email=${encodeURIComponent(email)}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('No se pudo obtener el perfil del cliente');
  }

  const customers = await response.json();
  return customers[0] || null;
};

export const updateCustomer = async (customerId, changes) => {
  const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(changes),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo actualizar el perfil');
  }

  return data.data;
};
