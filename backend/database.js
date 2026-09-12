import mongoose from "mongoose";
import { config } from "./config.js";

// Si la primera conexión falla (ej. un corte de red momentáneo hacia
// Atlas), sin este .catch() la promesa rechazada queda sin manejar y
// tumba TODO el servidor de Express, no solo la base de datos. Con el
// catch, el error igual se ve en consola pero el proceso sigue vivo y
// mongoose sigue reintentando conectarse solo.
mongoose.connect(config.db.URI).catch((err) => {
    console.error("No se pudo conectar a la base de datos:", err.message);
});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("DB is connected");
})

connection.on("disconnected", () => {
    console.log("DB is disconnected");
});

connection.on("error", (err) => {
    console.log("Error connecting to the database:", err);
});