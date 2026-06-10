/*
    Campos:
        name
        phone
        correoElectronico
        image
        direccion
        estado
*/

import { Schema, model } from "mongoose";

const suppliersSchema = new Schema(
    {
        name: {
            type: String,
        },
        phone: {
            type: String,
        },
        correoElectronico: {
            type: String,
        },
        image: {
            type: String,
        },
        public_id: {
            type: String,
        },
        direccion: {
            type: String,
        },
        estado: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("suppliers", suppliersSchema);