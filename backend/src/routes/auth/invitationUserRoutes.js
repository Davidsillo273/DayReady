import express from "express";
import inviteAdminController from "../../controllers/auth/admins/inviteAdminController.js";
import inviteEmployeeController from "../../controllers/auth/employees/inviteEmployeeController.js";
import acceptInvitationController from "../../controllers/auth/acceptInvitationController.js";

const router = express.Router();
router.post("/admins", inviteAdminController.sendInvitation);
router.post("/employees", inviteEmployeeController.sendInvitation);
router.get("/validate", acceptInvitationController.validateInvitation);
router.post("/complete", acceptInvitationController.completeRegistration);

export default router;