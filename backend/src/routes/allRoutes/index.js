import { Router } from "express";
import suppliersRoutes from "../suppliersRoutes.js";
import productsRoutes from "../productsRoutes.js";
// Aquí importamos todas las rutas de cada módulo
const router = Router();

//Nombres de los endpoints
router.use("/suppliers", suppliersRoutes);
router.use("/products", productsRoutes);

export default router;

