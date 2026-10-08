import { Router } from "express";
import reviewController from "../controllers/reviewController.js";

const router = Router();

router.route("/").post(reviewController.upsertReview);
router.route("/summary").get(reviewController.getSummary);
router.route("/eligibility").get(reviewController.getEligibility);
router.route("/product/:productId").get(reviewController.getByProduct);
router.route("/:id").delete(reviewController.deleteReview);

export default router;
