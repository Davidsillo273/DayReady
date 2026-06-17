import customerModel from "../models/customerModels.js";
import crudUtils from "../utils/users/crudUtils.js";
import validationUtils from "../utils/auth/validationsUsersUtils.js";

const customerController = {};

customerController.getCustomers = async (req, res) => {
    try {
        const customers = await crudUtils.searchDocuments(customerModel, req.query);
        return res.status(200).json(customers);
    } catch (error) {
        console.error("Error getting customers:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

customerController.deleteCustomer = async (req, res) => {
    try {
        const deleted = await crudUtils.deleteDocumentById(customerModel, req.params.id);
        if (!deleted) return res.status(404).json({ message: "Customer not found" });

        return res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Error deleting customer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

customerController.updateCustomer = async (req, res) => {
    try {
        const { name, lastName, carnet, phone, status } = req.body;
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
        if (carnet !== undefined) updateData.carnet = carnet.trim();
        if (phone !== undefined) updateData.phone = phone.trim();
        if (status !== undefined) updateData.status = status;

        if (validationsToRun.length > 0) {
            const result = validationUtils.runValidations(validationsToRun);
            if (!result.valid) return res.status(400).json({ message: result.message });
        }

        const updatedCustomer = await customerModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });

        return res.status(200).json({ message: "Customer updated successfully", data: updatedCustomer });
    } catch (error) {
        console.error("Error updating customer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

customerController.addBalance = async (req, res) => {
    try {
        const { amount } = req.body;

        const parsedAmount = Number(amount);

        if (amount === undefined || isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ message: "Amount must be a valid number greater than 0." });
        }

        const updatedCustomer = await customerModel.findByIdAndUpdate(
            req.params.id,
            { $inc: { balance: parsedAmount } },
            { new: true }
        ).select("-password");

        if (!updatedCustomer) return res.status(404).json({ message: "Customer not found" });

        return res.status(200).json({
            message: "Balance added successfully",
            data: updatedCustomer,
        });
    } catch (error) {
        console.error("Error adding balance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default customerController;