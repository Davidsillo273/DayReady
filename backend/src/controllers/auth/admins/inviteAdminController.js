import adminModel from "../../../models/adminModels.js";
import emailUtils from "../../../utils/auth/invitationUtils.js";
import utils from "../../../utils/auth/validationsUsersUtils.js";
import inviteUtils from "../../../utils/auth/invitationValidationsUtils.js";
import { config } from "../../../../config.js";

const inviteAdminController = {};

inviteAdminController.sendInvitation = async (req, res) => {
  const { email, name, lastName, phone, local } = req.body;

  const validation = utils.runValidations([
    () => utils.validateEmail(email),
    () => utils.validateName(name, "First name"),
    () => utils.validateName(lastName, "Last name"),
    () => inviteUtils.validatePhone(phone),
    () => inviteUtils.validateLocal(local),
  ]);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    const exists = await adminModel.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ message: "An administrator with this email already exists." });
    }

    const invitationToken = emailUtils.generateToken(
      {
        email: normalizedEmail,
        role: "admin",
        invited: true,
        personalInfo: {
          name: name.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
          local: local.trim(),
        },
      },
      "24h"
    );

    const invitationLink = `${config.frontendUrl}/admin/accept-invitation?token=${invitationToken}`;

    await emailUtils.sendEmail(
      email,
      "You've been invited to DayReady",
      emailUtils.HTMLInvitationEmail(invitationLink, "Administrator")
    );

    return res.status(200).json({ message: "Invitation sent successfully." });
  } catch (error) {
    console.error("inviteAdminController.sendInvitation:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default inviteAdminController;