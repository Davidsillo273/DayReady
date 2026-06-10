import { Router } from "express";
import adminRoutes from "../adminRoutes.js";
import suppliersRoutes from "../suppliersRoutes.js";
import productsRoutes from "../productsRoutes.js";
// Aquí importamos todas las rutas de cada módulo

import adminRoutes from "../adminRoutes.js";
const router = Router();

//Nombres de los endpoints
router.use("/admin", adminRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/products", productsRoutes);

export default router;

