import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../../config.js";

const processLogin = async (Model, email, password, role) => {

    const userFound = await Model.findOne({ email: email.toLowerCase().trim() });

    if (!userFound) {
        return { error: true, status: 404, message: "User not found" };
    }

    if (userFound.status === "inactive" || userFound.status === "banned") {
        return { error: true, status: 403, message: "This account is not active" };
    }

    if (userFound.timeOut && userFound.timeOut > Date.now()) {
        return { error: true, status: 403, message: "Account blocked due to multiple failed attempts" };
    }

    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
        userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;

        if (userFound.loginAttempts >= 5) {
            userFound.timeOut = Date.now() + 15 * 60 * 1000;
            userFound.loginAttempts = 0;
            await userFound.save();

            return { error: true, status: 403, message: "Too many failed attempts. Account blocked for 15 minutes." };
        }

        await userFound.save();
        return { error: true, status: 401, message: "Incorrect email or password" };
    }

    userFound.loginAttempts = 0;
    userFound.timeOut = null;
    await userFound.save();

    const tokenPayload = {
        id: userFound._id,
        role,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || config.JWT.secret, { expiresIn: "30d" });

    return { error: false, status: 200, token, message: "Login successful" };
};

export default processLogin;