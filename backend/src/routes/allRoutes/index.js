import { Router } from "express";
import adminRoutes from "../adminRoutes.js";
import suppliersRoutes from "../suppliersRoutes.js";
import productsRoutes from "../productsRoutes.js";
import cartRoutes from "../cartRoutes.js";
import orderRoutes from "../orderRoutes.js";
// Aquí importamos todas las rutas de cada módulo

const router = Router();

//Nombres de los endpoints
router.use("/admin", adminRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/products", productsRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);

export default router;

