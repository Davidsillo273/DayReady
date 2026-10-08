/*
    Campos:
        productId
        customerId
        customerName
        rating (1 a 5)
        comment
*/

import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema(
    {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "products",
            required: true,
        },
        customerId: {
            type: mongoose.Types.ObjectId,
            ref: "Customers",
            required: true,
        },
        customerName: {
            type: String,
            trim: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            maxlength: 500,
        },
    },
    {
        timestamps: true,
    }
);

// Un cliente deja una sola valoración por producto (si vuelve a opinar,
// se actualiza la que ya tenía).
reviewSchema.index({ productId: 1, customerId: 1 }, { unique: true });

export default model("Reviews", reviewSchema);
