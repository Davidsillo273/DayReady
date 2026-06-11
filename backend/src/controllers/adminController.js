import adminModel from "../models/adminModels.js";

const adminController = {};

adminController.getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    return res.status(200).json(admins);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

adminController.getAdminById = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json(admin);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

adminController.insertAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const newAdmin = new adminModel({ email, password });
    await newAdmin.save();
    return res.status(201).json({ message: "Admin created", admin: newAdmin });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

adminController.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await adminModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({ message: "Admin updated", admin: updatedAdmin });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

adminController.deleteAdmin = async (req, res) => {
  try {
    const admin = await adminModel.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    return res.status(200).json({ message: "Admin deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default adminController;
