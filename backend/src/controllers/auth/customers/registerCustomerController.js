import bcryptjs from "bcryptjs";
import customerModel from "../../../models/customerModels.js";
import emailUtils from "../../../utils/auth/emailUtils.js";
import utils from "../../../utils/auth/validationsUsersUtils.js";
import customerUtils from "../../../utils/auth/customers/validationsCustomersUtils.js";

const registerCustomerController = {};

registerCustomerController.sendCode = async (req, res) => {
  const { email } = req.body;

  const emailValidation = utils.validateEmail(email);
  if (!emailValidation.valid) {
    return res.status(400).json({ message: emailValidation.message });
  }

  try {
    const exists = await customerModel.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: "A customer with this email already exists." });
    }

    const verificationCode = emailUtils.generateVerificationCode();
    const token = emailUtils.generateToken({ email: email.toLowerCase().trim(), verificationCode }, "15m");

    res.cookie("customerVerificationToken", token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    await emailUtils.sendEmail(
      email,
      "Account Verification – Day Ready",
      emailUtils.HTMLVerificationEmail(verificationCode)
    );

    return res.status(200).json({ message: "Verification code sent to your email." });
  } catch (error) {
    console.error("registerCustomerController.sendCode:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

registerCustomerController.verifyCode = async (req, res) => {
  const { code } = req.body;

  const codeValidation = utils.validateVerificationCode(code);
  if (!codeValidation.valid) {
    return res.status(400).json({ message: codeValidation.message });
  }

  try {
    const token = req.cookies.customerVerificationToken;
    if (!token) {
      return res.status(401).json({ message: "Verification session expired. Please try again." });
    }

    const decoded = emailUtils.verifyToken(token);
    if (code.toUpperCase() !== decoded.verificationCode) {
      return res.status(400).json({ message: "The verification code is incorrect." });
    }

    const verifiedToken = emailUtils.generateToken(
      { email: decoded.email, emailVerified: true },
      "30m"
    );

    res.clearCookie("customerVerificationToken");
    res.cookie("customerRegistrationToken", verifiedToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    return res.status(200).json({ message: "Email verified. Continue with the registration." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "The code has expired. Please request a new one." });
    }
    console.error("registerCustomerController.verifyCode:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

registerCustomerController.personalInfo = async (req, res) => {
  const { name, lastName, carnet, phone } = req.body;

  const validation = utils.runValidations([
    () => utils.validateName(name, "First name"),
    () => utils.validateName(lastName, "Last name"),
  ]);

  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }

  try {
    const token = req.cookies.customerRegistrationToken;
    if (!token) {
      return res.status(401).json({ message: "Registration session expired. Please verify your email again." });
    }

    const decoded = emailUtils.verifyToken(token);
    if (!decoded.emailVerified) {
      return res.status(401).json({ message: "The email has not been verified." });
    }

    const carnetValidation = customerUtils.validateCarnet(carnet);
    if (!carnetValidation.valid) {
      return res.status(400).json({ message: carnetValidation.message });
    }

    const carnetExists = await customerModel.findOne({ carnet: carnet?.trim() });
    if (carnetExists) {
      return res.status(409).json({ message: "A customer with this carnet already exists." });
    }

    const infoToken = emailUtils.generateToken(
      {
        email: decoded.email,
        emailVerified: true,
        personalInfo: {
          name: name.trim(),
          lastName: lastName.trim(),
          carnet: carnet?.trim() || null,
          phone: phone || null,
        },
      },
      "30m"
    );

    res.clearCookie("customerRegistrationToken");
    res.cookie("customerRegistrationToken", infoToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    return res.status(200).json({ message: "Information saved. Continue with the password." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please verify your email again." });
    }
    console.error("registerCustomerController.personalInfo:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

registerCustomerController.setPassword = async (req, res) => {
  const { password } = req.body;

  const passwordValidation = utils.validatePassword(password);
  if (!passwordValidation.valid) {
    return res.status(400).json({ message: passwordValidation.message });
  }

  try {
    const token = req.cookies.customerRegistrationToken;
    if (!token) {
      return res.status(401).json({ message: "Registration session expired." });
    }

    const decoded = emailUtils.verifyToken(token);

    if (!decoded.emailVerified || !decoded.personalInfo) {
      return res.status(401).json({ message: "Incomplete registration. Please start over." });
    }

    const { email, personalInfo } = decoded;

    const exists = await customerModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "A customer with this email already exists." });
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    const newCustomer = new customerModel({
      name: personalInfo.name,
      lastName: personalInfo.lastName,
      email,
      carnet: personalInfo.carnet,
      phone: personalInfo.phone,
      password: passwordHash,
      addresses: [],
      favorites: [],
      status: "active",
    });

    await newCustomer.save();
    res.clearCookie("customerRegistrationToken");

    return res.status(201).json({ message: "Customer registered successfully." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please start the registration over." });
    }
    console.error("registerCustomerController.setPassword:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export default registerCustomerController;