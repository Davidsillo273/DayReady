import { Router } from "express";
import adminRoutes from "../adminRoutes.js";
// Aquí importamos todas las rutas de cada módulo

import adminRoutes from "../adminRoutes.js";
const router = Router();

//Nombres de los endpoints
router.use("/admin", adminRoutes);

export default router;

