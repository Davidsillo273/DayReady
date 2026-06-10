import { v2 as cloudinary } from "cloudinary";
import suppliersModel from "../models/suppliersModel.js";

const suppliersController = {};

//Obtener todos los proveedores
suppliersController.getSuppliers = async (req, res) => {
    try {
        const suppliers = await suppliersModel.find();
        return res.status(200).json(suppliers);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Obtener un proveedor por ID
suppliersController.getSupplierById = async (req, res) => {
    try {
        const supplier = await suppliersModel.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        return res.status(200).json(supplier);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Crear un proveedor
suppliersController.insertSupplier = async (req, res) => {
    try {
        //Solicitar los datos
        let { name, phone, correoElectronico, direccion, estado } = req.body;

        //Sanitizar
        name = name?.trim();
        phone = phone?.trim();
        correoElectronico = correoElectronico?.trim();
        direccion = direccion?.trim();

        //Validar campos requeridos
        if (!name || !phone || !correoElectronico || !direccion) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        if (name.length < 2) {
            return res.status(400).json({ message: "Name too short" });
        }

        //Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correoElectronico)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Armar el nuevo proveedor
        const newSupplier = new suppliersModel({
            name,
            phone,
            correoElectronico,
            direccion,
            estado: estado !== undefined ? estado : true,
            image: req.file ? req.file.path : null,
            public_id: req.file ? req.file.filename : null,
        });

        //Guardar en la base de datos
        await newSupplier.save();

        return res.status(201).json({ message: "Supplier saved" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Actualizar un proveedor
suppliersController.updateSupplier = async (req, res) => {
    try {
        //Solicitar los datos
        let { name, phone, correoElectronico, direccion, estado } = req.body;

        //#2- Sanitizar
        name = name?.trim();
        phone = phone?.trim();
        correoElectronico = correoElectronico?.trim();
        direccion = direccion?.trim();

        //Validaciones
        if (name && name.length < 2) {
            return res.status(400).json({ message: "Name too short" });
        }

        if (correoElectronico) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correoElectronico)) {
                return res.status(400).json({ message: "Invalid email format" });
            }
        }

        //Buscar el proveedor actual
        const supplierFound = await suppliersModel.findById(req.params.id);

        if (!supplierFound) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        //Armar los datos a actualizar
        const updatedData = {
            name,
            phone,
            correoElectronico,
            direccion,
            estado,
        };

        //Si viene imagen nueva, eliminar la anterior y subir la nueva
        if (req.file) {
            if (supplierFound.public_id) {
                await cloudinary.uploader.destroy(supplierFound.public_id);
            }
            updatedData.image = req.file.path;
            updatedData.public_id = req.file.filename;
        }

        //Guardar en la base de datos
        await suppliersModel.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
        });

        return res.status(200).json({ message: "Supplier updated" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Eliminar un proveedor
suppliersController.deleteSupplier = async (req, res) => {
    try {
        //Buscar el proveedor
        const supplierFound = await suppliersModel.findById(req.params.id);

        if (!supplierFound) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        //Eliminar imagen de cloudinary si existe
        if (supplierFound.public_id) {
            await cloudinary.uploader.destroy(supplierFound.public_id);
        }

        //Eliminar de la base de datos
        await suppliersModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Supplier deleted" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Buscar por nombre
suppliersController.searchByName = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const suppliers = await suppliersModel.find({
            name: { $regex: name, $options: "i" },
        });

        if (suppliers.length === 0) {
            return res.status(404).json({ message: "No suppliers found" });
        }

        return res.status(200).json(suppliers);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Solo proveedores activos
suppliersController.getActiveSuppliers = async (req, res) => {
    try {
        const suppliers = await suppliersModel.find({ estado: true });

        return res.status(200).json(suppliers);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default suppliersController;