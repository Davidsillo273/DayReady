import { Router } from "express";
import dailyMenuController from "../controllers/dailyMenuController.js";

const router = Router();

router
    .route("/")
    .get(dailyMenuController.getMenus)
    .post(dailyMenuController.insertMenu);


router.route("/day/:dayOfWeek").get(dailyMenuController.getMenuByDay);

router
    .route("/:id")
    .get(dailyMenuController.getMenuById)
    .put(dailyMenuController.updateMenu)
    .delete(dailyMenuController.deleteMenu);

export default router;