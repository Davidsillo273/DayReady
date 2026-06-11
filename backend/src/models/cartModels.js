/*
    Campos:
        clienteId
        item:
            productoId
            cantidad
            subtotal
        total
        status
*/

import mongoose, {Schema, model} from "mongoose"

const cartSchema = new Schema({
    customerId: {
        type: mongoose.Types.ObjectId,
        ref: "clientes"
    },
    items: [
        {
            productoId: {
                type: mongoose.Types.ObjectId,
                ref: "productos"
            },
            cantidad: {type: Number},
            subtotal: {type: Number}
        }
    ],
    total: {type: Number},
    descuentos: {type: Number, default: 0},
    totalFinal: {type: Number},
    status: {type: String}
},{
    timestamps: true,
    strict: false
})

export default model("Cart", cartSchema)