const utils = {};

utils.validateEmail = (email) => {
  if (!email || typeof email !== "string" || email.trim() === "") {
    return { valid: false, message: "Email is required." };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: "Invalid email format." };
  }
  return { valid: true };
};

utils.validateVerificationCode = (code) => {
  if (!code || typeof code !== "string" || code.trim() === "") {
    return { valid: false, message: "Verification code is required." };
  }
  if (code.trim().length !== 6) {
    return { valid: false, message: "Verification code must be 6 characters long." };
  }
  return { valid: true };
};

utils.validatePassword = (password) => {
  if (!password || typeof password !== "string" || password.trim() === "") {
    return { valid: false, message: "Password is required." };
  }
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number." };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character." };
  }
  return { valid: true };
};

utils.validateName = (value, fieldName = "Field") => {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return { valid: false, message: `${fieldName} is required.` };
  }
  if (value.trim().length < 2) {
    return { valid: false, message: `${fieldName} must be at least 2 characters long.` };
  }
  if (value.trim().length > 50) {
    return { valid: false, message: `${fieldName} must not exceed 50 characters.` };
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) {
    return { valid: false, message: `${fieldName} must contain only letters.` };
  }
  return { valid: true };
};

utils.runValidations = (validationFns) => {
  for (const fn of validationFns) {
    const result = fn();
    if (!result.valid) return result;
  }
  return { valid: true };
};

export default utils;