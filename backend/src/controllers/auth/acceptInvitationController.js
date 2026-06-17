import bcryptjs from "bcryptjs";
import adminModel from "../../models/adminModels.js";
import employeeModel from "../../models/employeeModels.js";
import emailUtils from "../../utils/auth/invitationUtils.js";
import utils from "../../utils/auth/invitationValidationsUtils.js";
import validationUtils from "../../utils/auth/validationsUsersUtils.js";

const ROLES_MODELS = {
    admin: adminModel,
    employee: employeeModel,
};

const acceptInvitationController = {};

acceptInvitationController.validateInvitation = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Invitation token is required." });
    }

    try {
        const decoded = emailUtils.verifyToken(token);

        if (!decoded.invited || !ROLES_MODELS[decoded.role]) {
            return res.status(400).json({ message: "Invalid invitation token." });
        }

        const targetModel = ROLES_MODELS[decoded.role];
        const exists = await targetModel.findOne({ email: decoded.email });
        if (exists) {
            return res.status(409).json({ message: "This invitation has already been used." });
        }

        return res.status(200).json({
            message: "Valid invitation.",
            data: {
                email: decoded.email,
                role: decoded.role,
                name: decoded.personalInfo.name,
                lastName: decoded.personalInfo.lastName,
            },
        });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "This invitation has expired. Please request a new one." });
        }
        console.error("acceptInvitationController.validateInvitation:", error);
        return res.status(400).json({ message: "Invalid or corrupted invitation token." });
    }
};

acceptInvitationController.completeRegistration = async (req, res) => {
    const { token, password } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Invitation token is required." });
    }

    const passwordValidation = validationUtils.validatePassword(password);
    if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.message });
    }

    try {
        const decoded = emailUtils.verifyToken(token);

        if (!decoded.invited || !ROLES_MODELS[decoded.role]) {
            return res.status(400).json({ message: "Invalid invitation token." });
        }

        const targetModel = ROLES_MODELS[decoded.role];
        const exists = await targetModel.findOne({ email: decoded.email });
        if (exists) {
            return res.status(409).json({ message: "This invitation has already been used." });
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        const newUser = new targetModel({
            name: decoded.personalInfo.name,
            lastName: decoded.personalInfo.lastName,
            email: decoded.email,
            phone: decoded.personalInfo.phone,
            password: passwordHash,
            local: decoded.personalInfo.local,
            status: "active",
        });

        await newUser.save();

        return res.status(201).json({ message: `${decoded.role === "admin" ? "Administrator" : "Employee"} registered successfully.` });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "This invitation has expired. Please request a new one." });
        }
        console.error("acceptInvitationController.completeRegistration:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

export default acceptInvitationController;