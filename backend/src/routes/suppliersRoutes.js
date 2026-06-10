import { Router } from "express";
import suppliersController from "../controllers/suppliersController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = Router();

router
    .route("/")
    .get(suppliersController.getSuppliers)
    .post(upload.single("image"), suppliersController.insertSupplier);

router.route("/search").post(suppliersController.searchByName);

router.route("/active").get(suppliersController.getActiveSuppliers);

router
    .route("/:id")
    .get(suppliersController.getSupplierById)
    .put(upload.single("image"), suppliersController.updateSupplier)
    .delete(suppliersController.deleteSupplier);

export default router;