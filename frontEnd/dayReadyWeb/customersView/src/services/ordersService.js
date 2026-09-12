// Llamadas a /orders (backend/src/routes/orderRoutes.js). El modelo Order
// no guarda el id del cliente, sólo "customerName"/"customerContact" en
// texto libre, así que el historial se arma trayendo todas las órdenes y
// filtrando en el cliente por el correo de quien inició sesión (ver
// OrdersView.jsx). Es el mismo criterio que ya usa la app móvil.
const API_BASE_URL = 'http://localhost:4000/api';

export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error('No se pudieron cargar los pedidos');
  }

  return response.json();
};

export const createOrder = async ({ customerName, customerContact, items, total }) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      customerName,
      customerContact,
      items,
      total,
      estadoPago: true, // en la storefront se "paga" antes de crear la orden
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo crear el pedido');
  }

  return data.order;
};
