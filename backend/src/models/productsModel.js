/*
    Campos:
        image
        name
        description
        price
        category
        type
        quantity
        supplierId
*/

import { Schema, model } from "mongoose";

const productsSchema = new Schema(
    {
        image: {
            type: String,
        },
        public_id: {
            type: String,
        },
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
        },
        category: {
            type: String,
        },
        type: {
            type: String,
        },
        quantity: {
            type: Number,
        },
        supplierId: {
            type: Schema.Types.ObjectId,
            ref: "suppliers",
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("products", productsSchema);