import employeeModel from "../models/employeeModels.js";
import crudUtils from "../utils/users/crudUtils.js";
import validationUtils from "../utils/auth/validationsUsersUtils.js";

const employeeController = {};

employeeController.getEmployees = async (req, res) => {
    try {
        const employees = await crudUtils.searchDocuments(employeeModel, req.query);
        return res.status(200).json(employees);
    } catch (error) {
        console.error("Error getting employees:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

employeeController.deleteEmployee = async (req, res) => {
    try {
        const deleted = await crudUtils.deleteDocumentById(employeeModel, req.params.id);
        if (!deleted) return res.status(404).json({ message: "Employee not found" });

        return res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

employeeController.updateEmployee = async (req, res) => {
    try {
        const { name, lastName, phone, local, status } = req.body;
        const updateData = {};
        const validationsToRun = [];

        if (name !== undefined) {
            validationsToRun.push(() => validationUtils.validateName(name, "Name"));
            updateData.name = name.trim();
        }
        if (lastName !== undefined) {
            validationsToRun.push(() => validationUtils.validateName(lastName, "Last name"));
            updateData.lastName = lastName.trim();
        }
        if (phone !== undefined) updateData.phone = phone.trim();
        if (local !== undefined) updateData.local = local.trim();
        if (status !== undefined) updateData.status = status;

        if (validationsToRun.length > 0) {
            const result = validationUtils.runValidations(validationsToRun);
            if (!result.valid) return res.status(400).json({ message: result.message });
        }

        const updatedEmployee = await employeeModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!updatedEmployee) return res.status(404).json({ message: "Employee not found" });

        return res.status(200).json({ message: "Employee updated successfully", data: updatedEmployee });
    } catch (error) {
        console.error("Error updating employee:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default employeeController;