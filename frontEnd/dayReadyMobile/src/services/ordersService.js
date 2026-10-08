// Pedidos (backend/src/routes/orderRoutes.js). Cada orden guarda el id del
// cliente y el id de cada producto: con eso el backend descuenta el stock
// al crearla, lo devuelve si se cancela, y arma el historial del cliente.
import { apiFetch } from "../config/api";

const ordersService = {
  getByCustomer(customerId) {
    return apiFetch(`/orders/customer/${customerId}`);
  },

  getById(orderId) {
    return apiFetch(`/orders/${orderId}`);
  },

  create({ customerId, customerName, customerContact, items, total, horaRecogida }) {
    return apiFetch("/orders", {
      method: "POST",
      body: JSON.stringify({
        customerId,
        customerName,
        customerContact,
        items, // [{ productId, name, quantity, price }]
        total,
        horaRecogida,
        estadoPago: true, // en la app se paga antes de crear la orden
      }),
    });
  },

  // Sólo funciona con pedidos "pendiente"; el backend devuelve el stock.
  cancel(orderId) {
    return apiFetch(`/orders/${orderId}/cancel`, { method: "PATCH" });
  },
};

export default ordersService;
