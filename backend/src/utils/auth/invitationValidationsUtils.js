const inviteUtils = {};

inviteUtils.validatePhone = (phone) => {
  if (!phone || typeof phone !== "string" || phone.trim() === "") {
    return { valid: false, message: "Phone is required." };
  }
  const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
  if (!phoneRegex.test(phone.trim())) {
    return { valid: false, message: "Invalid phone format." };
  }
  return { valid: true };
};

inviteUtils.validateLocal = (local) => {
  if (!local || typeof local !== "string" || local.trim() === "") {
    return { valid: false, message: "Local is required." };
  }
  if (local.trim().length < 2) {
    return { valid: false, message: "Local must be at least 2 characters long." };
  }
  if (local.trim().length > 50) {
    return { valid: false, message: "Local must not exceed 50 characters." };
  }
  return { valid: true };
};

export default inviteUtils;