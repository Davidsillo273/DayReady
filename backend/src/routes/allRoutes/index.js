import { Router } from "express";
import suppliersRoutes from "../suppliersRoutes.js";
import productsRoutes from "../productsRoutes.js";
import adminRoutes from "../adminRoutes.js";
import employeeRoutes from "../employeeRoutes.js";
import customerRoutes from "../customerRoutes.js";

//auths
import registerAdminRoutes from "../auth/admins/registerAdminRoutes.js";
import registerCustomerRoutes from "../auth/customers/registerCustomerRoutes.js";
import registerEmployeeRoutes from "../auth/employees/registerEmployeeRoutes.js";
import loginAdminRoutes from "../auth/admins/loginAdminRoutes.js";
import loginCustomerRoutes from "../auth/customers/loginCustomerRoutes.js";
import loginEmployeeRoutes from "../auth/employees/loginEmployeeRoutes.js";
import recoveryPasswordRoutes from "../auth/recoveryPasswordRoutes.js";
import logoutRoutes from "../auth/logoutRoutes.js";
// Aquí importamos todas las rutas de cada módulo
const router = Router();

//Nombres de los endpoints
router.use("/suppliers", suppliersRoutes);
router.use("/products", productsRoutes);
router.use("/admins", adminRoutes);
router.use("/employees", employeeRoutes);
router.use("/customers", customerRoutes);
router.use("/auth/admins/register", registerAdminRoutes);
router.use("/auth/customers/register", registerCustomerRoutes);
router.use("/auth/employees/register", registerEmployeeRoutes);
router.use("/auth/admins/login", loginAdminRoutes);
router.use("/auth/customers/login", loginCustomerRoutes);
router.use("/auth/employees/login", loginEmployeeRoutes);
router.use("/auth/recovery", recoveryPasswordRoutes);
router.use("/auth/logout", logoutRoutes);
export default router;