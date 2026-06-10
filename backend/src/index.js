import app from "./app.js";
import "./database.js"

async function main() {
    try {
        app.listen(4000);
        console.log("Server on port 4000");
    } catch (error) {
        console.error("Error listening to server:", error);
    }
}

main();