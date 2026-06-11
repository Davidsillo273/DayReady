import { Router } from "express";
import adminController from "../controllers/adminController.js";

const router = Router();

router
    .route("/")
    .get(adminController.getAllAdmins)
    .post(adminController.insertAdmin);

router
    .route("/:id")
    .get(adminController.getAdminById)
    .put(adminController.updateAdmin)
    .delete(adminController.deleteAdmin);

export default router;
