import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    // Referencia opcional al carrito (por si se necesita en el futuro)
    carritoComprasId: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: false,
    },
    // Cliente que hizo el pedido (lo usa la app móvil para el historial
    // y para validar quién puede valorar un producto). Es opcional para no
    // romper las órdenes que la web crea sin cliente asociado.
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: "Customers",
      required: false,
    },
    // Datos del cliente
    customerName: {
      type: String,
      required: true,
    },
    customerContact: {
      type: String,
      default: "",
    },
    // Lista de productos
    items: [
      {
        // Referencia al producto: con ella se descuenta el stock al crear
        // la orden y se devuelve si la orden se cancela.
        productId: { type: mongoose.Types.ObjectId, ref: "products" },
        // Si se compró desde el menú del día, el stock que se descuenta (y
        // se devuelve al cancelar) es el de ese menú, no el del producto.
        menuId: { type: mongoose.Types.ObjectId, ref: "dailyMenu" },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }, // precio unitario
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    // Estado de pago
    estadoPago: {
      type: Boolean,
      default: false,
    },
    // Estado de entrega
    estado: {
      type: String,
      enum: ["pendiente", "entregado", "no entregado", "cancelado"],
      default: "pendiente",
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    horaCreacion: {
      type: String,
    },
    horaEntrega: {
      type: String,
    },
    horaRecogida: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false, // permite campos extra si llegaran
  }
);

export default model("Order", orderSchema);