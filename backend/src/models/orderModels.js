import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    carritoComprasId: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    estadoPago: {
      type: Boolean,
      default: false,
    },
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
    strict: false,
  }
);

export default model("Order", orderSchema);
