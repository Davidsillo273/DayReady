import dailyMenuModel from "../models/dailyMenuModel.js";

const dailyMenuController = {};

dailyMenuController.getMenus = async (req, res) => {
    try {
        const menus = await dailyMenuModel.find().populate("productId", "name image category");
        return res.status(200).json(menus);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

dailyMenuController.getMenuById = async (req, res) => {
    try {
        const menu = await dailyMenuModel.findById(req.params.id).populate("productId", "name image category");

        if (!menu) {
            return res.status(404).json({ message: "Menu not found" });
        }

        return res.status(200).json(menu);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

dailyMenuController.insertMenu = async (req, res) => {
    try {
        let { name, description, price, stock, dayOfWeek, productId, image } = req.body;

        name        = name?.trim();
        description = description?.trim();
        dayOfWeek   = dayOfWeek?.trim();

        if (!name || !description || !price || !stock || !dayOfWeek || !productId) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        if (name.length < 2) {
            return res.status(400).json({ message: "Name too short" });
        }

        if (Number(price) <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        if (Number(stock) < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" });
        }

        const newMenu = new dailyMenuModel({
            name,
            description,
            price,
            stock,
            dayOfWeek,
            productId,
            image,
        });

        await newMenu.save();

        return res.status(201).json({ message: "Menu saved" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

dailyMenuController.updateMenu = async (req, res) => {
    try {
        let { name, description, price, stock, dayOfWeek, productId, image } = req.body;

        name        = name?.trim();
        description = description?.trim();
        dayOfWeek   = dayOfWeek?.trim();

        if (name && name.length < 2) {
            return res.status(400).json({ message: "Name too short" });
        }

        if (price && Number(price) <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        if (stock && Number(stock) < 0) {
            return res.status(400).json({ message: "Stock cannot be negative" });
        }

        const menuFound = await dailyMenuModel.findById(req.params.id);

        if (!menuFound) {
            return res.status(404).json({ message: "Menu not found" });
        }

        await dailyMenuModel.findByIdAndUpdate(
            req.params.id,
            { name, description, price, stock, dayOfWeek, productId, image },
            { new: true }
        );

        return res.status(200).json({ message: "Menu updated" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

dailyMenuController.deleteMenu = async (req, res) => {
    try {
        const menuFound = await dailyMenuModel.findById(req.params.id);

        if (!menuFound) {
            return res.status(404).json({ message: "Menu not found" });
        }

        await dailyMenuModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({ message: "Menu deleted" });
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

dailyMenuController.getMenuByDay = async (req, res) => {
    try {
        const { dayOfWeek } = req.params;

        const menus = await dailyMenuModel
            .find({ dayOfWeek })
            .populate("productId", "name image category");

        if (menus.length === 0) {
            return res.status(404).json({ message: "No menus found for this day" });
        }

        return res.status(200).json(menus);
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default dailyMenuController;