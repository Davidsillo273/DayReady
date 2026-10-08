import mongoose from "mongoose";
import dns from "dns";
import { config } from "./config.js";

// En algunas PCs Windows Node toma 127.0.0.1 como DNS y ese servidor
// rechaza la consulta SRV de "mongodb+srv://" (querySrv ECONNREFUSED).
// En ese caso se usan DNS p�blicos para poder resolver Atlas.
if (dns.getServers().every((s) => s.startsWith("127.") || s === "::1")) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

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