import { Router } from "express";
import cartController from "../controllers/cartController.js";

const router = Router();

router
    .route("/")
    .get(cartController.getAllCarts)
    .post(cartController.insertCart);

router
    .route("/:id")
    .get(cartController.getCartById)
    .put(cartController.updateCart)
    .delete(cartController.deleteCart);

export default router;