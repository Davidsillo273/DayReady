// Validaciones de formularios. Se copian las mismas reglas que ya usa el
// backend en backend/src/utils/auth/validationsUsersUtils.js y
// validationsCustomersUtils.js, para avisarle al estudiante el error antes
// de mandar la petición (evita viajes de red innecesarios y mensajes de
// error confusos si el backend rechaza el dato).
export function validateEmail(email) {
  if (!email || !email.trim()) return "El correo es obligatorio.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "El formato del correo no es válido.";
  return null;
}

export function validatePassword(password) {
  if (!password) return "La contraseña es obligatoria.";
  if (password.length < 8) return "Debe tener al menos 8 caracteres.";
  if (!/[A-Z]/.test(password)) return "Debe incluir al menos una mayúscula.";
  if (!/[0-9]/.test(password)) return "Debe incluir al menos un número.";
  if (!/[^a-zA-Z0-9]/.test(password)) return "Debe incluir al menos un carácter especial.";
  return null;
}

export function validateName(value, fieldName = "Este campo") {
  if (!value || !value.trim()) return `${fieldName} es obligatorio.`;
  if (value.trim().length < 2) return `${fieldName} debe tener al menos 2 caracteres.`;
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())) return `${fieldName} sólo puede tener letras.`;
  return null;
}

export function validateCarnet(carnet) {
  if (!carnet || !carnet.trim()) return "El carnet es obligatorio.";
  if (carnet.trim().length < 3) return "El carnet debe tener al menos 3 caracteres.";
  if (!/^[a-zA-Z0-9-]+$/.test(carnet.trim())) return "El carnet sólo puede tener letras, números o guiones.";
  return null;
}

export function validateVerificationCode(code) {
  if (!code || code.trim().length !== 6) return "El código debe tener 6 caracteres.";
  return null;
}

export function validatePhone(phone) {
  if (!phone || !phone.trim()) return "El teléfono es obligatorio.";
  if (!/^[0-9-\s+]{7,15}$/.test(phone.trim())) return "El teléfono no es válido.";
  return null;
}

export function validateAge(age) {
  const text = String(age ?? "").trim();
  if (!text) return "La edad es obligatoria.";
  if (!/^\d+$/.test(text)) return "La edad debe ser un número entero positivo.";
  const value = Number(text);
  if (value < 12 || value > 99) return "La edad debe estar entre 12 y 99 años.";
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Confirma tu contraseña.";
  if (password !== confirmPassword) return "Las contraseñas no coinciden.";
  return null;
}

// Cantidad a comprar: entero, mayor que 0 y sin pasarse del stock.
export function validateQuantity(quantity, stock) {
  if (!Number.isInteger(quantity) || quantity < 1) return "La cantidad debe ser mayor que 0.";
  if (stock !== undefined && quantity > stock) {
    return stock > 0 ? `Sólo quedan ${stock} disponibles.` : "Este producto está agotado.";
  }
  return null;
}

export function validateCardNumber(cardNumber) {
  const digits = (cardNumber || "").replace(/\s/g, "");
  if (!digits) return "El número de tarjeta es obligatorio.";
  if (!/^\d{16}$/.test(digits)) return "La tarjeta debe tener 16 dígitos.";
  return null;
}

// Formato MM/AA y que la tarjeta no esté vencida.
export function validateExpiry(expiry) {
  if (!expiry) return "La fecha de vencimiento es obligatoria.";
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!match) return "Usa el formato MM/AA.";
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return "El mes debe estar entre 01 y 12.";
  const now = new Date();
  if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
    return "La tarjeta está vencida.";
  }
  return null;
}

export function validateCvc(cvc) {
  if (!cvc) return "El CVC es obligatorio.";
  if (!/^\d{3}$/.test(cvc)) return "El CVC debe tener 3 dígitos.";
  return null;
}

export function validateRating(rating) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return "Elige de 1 a 5 estrellas.";
  return null;
}

export function validateComment(comment) {
  if (!comment || !comment.trim()) return "El comentario es obligatorio.";
  if (comment.trim().length < 3) return "El comentario debe tener al menos 3 caracteres.";
  if (comment.trim().length > 500) return "El comentario no puede pasar de 500 caracteres.";
  return null;
}
