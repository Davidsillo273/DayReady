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

export default customerUtils;