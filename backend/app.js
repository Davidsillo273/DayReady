import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import allRoutes from "./src/routes/allRoutes/index.js";

const app = express();

// Middlewares
app.use(cors({
    origin: [
        "http://localhost:5173", "http://localhost:5174", "http://localhost:3000",
        // Puertos donde corre "npx expo start --web" (la app móvil en el
        // navegador). En un celular o emulador real no hace falta esto
        // porque CORS sólo lo aplican los navegadores, pero al probar la
        // versión web de Expo sí se necesita.
        "http://localhost:8081", "http://localhost:8082", "http://localhost:19006",
    ],
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

const api = process.env.API_URL || "/api";

//Todas las rutas se encuentran en: ./routes/index.js
app.use(api, allRoutes);

export default app;