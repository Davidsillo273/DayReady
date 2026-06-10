import { Router } from "express";
import productsController from "../controllers/productsController.js";
import upload from "../utils/cloudinaryConfig.js";

const router = Router();

router
    .route("/")
    .get(productsController.getProducts)
    .post(upload.single("image"), productsController.insertProduct);

router.route("/search").post(productsController.searchByName);

router.route("/category/:category").get(productsController.getByCategory);

router
    .route("/:id")
    .get(productsController.getProductById)
    .put(upload.single("image"), productsController.updateProduct)
    .delete(productsController.deleteProduct);

export default router;