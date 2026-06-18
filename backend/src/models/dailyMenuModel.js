/*
    Fields:
        name
        description
        price
        stock
        dayOfWeek
        productId  (ref to products)
        image
*/

import { Schema, model } from "mongoose";

const dailyMenuSchema = new Schema(
    {
        name: {
            type: String,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
        },
        stock: {
            type: Number,
        },
        dayOfWeek: {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("dailyMenu", dailyMenuSchema);