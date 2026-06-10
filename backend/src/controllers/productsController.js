import { v2 as cloudinary } from "cloudinary";
import productsModel from "../models/productsModel.js";

// Array de métodos
const productsController = {};

//Obtener todos los productos
productsController.getProducts = async (req, res) => {
    try {
        const products = await productsModel.find();
        return res.status(200).json(products);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Obtener un producto por ID
productsController.getProductById = async (req, res) => {
    try {
        const product = await productsModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json(product);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Crear un producto
productsController.insertProduct = async (req, res) => {
    try {
        //Solicitar los datos
        let { name, description, price, category, type, quantity, supplierId } =
            req.body;

        //Sanitizar
        name = name?.trim();
        description = description?.trim();
        category = category?.trim();
        type = type?.trim();

        //Validar campos requeridos
        if (!name || !description || !price || !category || !type || !quantity) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        if (name.length < 2) {
            return res.status(400).json({ message: "Name too short" });
        }

        if (Number(price) <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        if (Number(quantity) < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }

        //Armar el nuevo producto
        const newProduct = new productsModel({
            name,
            description,
            price,
            category,
            type,
            quantity,
            supplierId,
            image: req.file ? req.file.path : null,
            public_id: req.file ? req.file.filename : null,
        });

        //Guardar en la base de datos
        await newProduct.save();

        return res.status(201).json({ message: "Product saved" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Actualizar un producto
productsController.updateProduct = async (req, res) => {
    try {
        //Solicitar los datos
        let { name, description, price, category, type, quantity, supplierId } =
            req.body;

        //Sanitizar
        name = name?.trim();
        description = description?.trim();
        category = category?.trim();
        type = type?.trim();

        //Validaciones
        if (name && name.length < 2) {
            return res.status(400).json({ message: "Name too short" });
        }

        if (price && Number(price) <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        if (quantity && Number(quantity) < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }

        //Buscar el producto actual
        const productFound = await productsModel.findById(req.params.id);

        if (!productFound) {
            return res.status(404).json({ message: "Product not found" });
        }

        //Armar los datos a actualizar
        const updatedData = {
            name,
            description,
            price,
            category,
            type,
            quantity,
            supplierId,
        };

        //Si viene imagen nueva, eliminar la anterior y subir la nueva
        if (req.file) {
            if (productFound.public_id) {
                await cloudinary.uploader.destroy(productFound.public_id);
            }
            updatedData.image = req.file.path;
            updatedData.public_id = req.file.filename;
        }

        //Guardar en la base de datos
        await productsModel.findByIdAndUpdate(req.params.id, updatedData, {
            new: true,
        });

        return res.status(200).json({ message: "Product updated" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Eliminar un producto
productsController.deleteProduct = async (req, res) => {
    try {
        //Buscar el producto
        const productFound = await productsModel.findById(req.params.id);

        if (!productFound) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Eliminar imagen de Cloudinary si existe
        if (productFound.public_id) {
            await cloudinary.uploader.destroy(productFound.public_id);
        }

        //Eliminar de la base de datos
        await productsModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Product deleted" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//Por nombre
productsController.searchByName = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const products = await productsModel.find({
            name: { $regex: name, $options: "i" },
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        return res.status(200).json(products);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Por categoría
productsController.getByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const products = await productsModel.find({
            category: { $regex: category, $options: "i" },
        });

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this category" });
        }

        return res.status(200).json(products);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default productsController;