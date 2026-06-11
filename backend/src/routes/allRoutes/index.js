import { Router } from "express";
import suppliersRoutes from "../suppliersRoutes.js";
import productsRoutes from "../productsRoutes.js";

//auths
import registerAdminRoutes from "../auth/admins/registerAdminRoutes.js";
import registerCustomerRoutes from "../auth/customers/registerCustomerRoutes.js";
import registerEmployeeRoutes from "../auth/employees/registerEmployeeRoutes.js";
// Aquí importamos todas las rutas de cada módulo
const router = Router();

//Nombres de los endpoints
router.use("/suppliers", suppliersRoutes);
router.use("/products", productsRoutes);
router.use("/auth/admins/register", registerAdminRoutes);
router.use("/auth/customers/register", registerCustomerRoutes);
router.use("/auth/employees/register", registerEmployeeRoutes);
export default router;

