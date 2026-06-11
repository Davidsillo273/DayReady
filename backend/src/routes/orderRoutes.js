import { Router } from "express";
import orderController from "../controllers/orderController.js";

const router = Router();

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(orderController.insertOrder);

router
  .route("/:id")
  .get(orderController.getOrderById)
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

export default router;
