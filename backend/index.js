import app from "./app.js";
import "./database.js"

async function main() {
    try {
        // Render (y otros hostings) asignan el puerto por la variable PORT.
        const port = process.env.PORT || 4000;
        app.listen(port);
        console.log(`Server on port ${port}`);
    } catch (error) {
        console.error("Error listening to server:", error);
    }
}

main();