import app from "./app.js";
import "./database.js"


async function main() {
    try {
        app.listen(4000);
        console.log("Servidor escuchando en el puerto 4000");
        //Todo funciona
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
    }
}

main();