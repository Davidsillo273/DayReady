import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    // Referencia opcional al carrito (por si se necesita en el futuro)
    carritoComprasId: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
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
      enum: ["pendiente", "entregado", "no entregado"],
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
  },
  {
    timestamps: true,
    strict: false, // permite campos extra si llegaran
  }
);

export default model("Order", orderSchema);