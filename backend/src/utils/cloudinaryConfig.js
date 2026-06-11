import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "../../config.js";

//Configuramos cloudinary con nuestras credenciales
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_api_secret,
});

//Como guardamos las imágenes
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "DayReady",
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
});

//Configurar multer
const upload = multer({ storage });

export default upload;