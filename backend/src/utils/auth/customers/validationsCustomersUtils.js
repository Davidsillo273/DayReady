const customerUtils = {};

customerUtils.validateCarnet = (carnet) => {
  if (!carnet || typeof carnet !== "string" || carnet.trim() === "") {
    return { valid: false, message: "Carnet is required." };
  }
  if (carnet.trim().length < 3) {
    return { valid: false, message: "Carnet must be at least 3 characters long." };
  }
  if (carnet.trim().length > 20) {
    return { valid: false, message: "Carnet must not exceed 20 characters." };
  }
  if (!/^[a-zA-Z0-9-]+$/.test(carnet.trim())) {
    return { valid: false, message: "Carnet must contain only letters, numbers, or hyphens." };
  }
  return { valid: true };
};

customerUtils.validateAge = (age) => {
  const parsed = Number(age);
  if (age === undefined || age === null || age === "" || !Number.isInteger(parsed)) {
    return { valid: false, message: "Age must be a whole number." };
  }
  if (parsed < 12 || parsed > 99) {
    return { valid: false, message: "Age must be between 12 and 99." };
  }
  return { valid: true };
};

customerUtils.validatePhone = (phone) => {
  if (!phone || typeof phone !== "string" || phone.trim() === "") {
    return { valid: false, message: "Phone is required." };
  }
  if (!/^[0-9-\s+]{7,15}$/.test(phone.trim())) {
    return { valid: false, message: "Invalid phone number." };
  }
  return { valid: true };
};

export default customerUtils;