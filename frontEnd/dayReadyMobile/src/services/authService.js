// Llamadas al módulo de autenticación de clientes del backend
// (backend/src/routes/auth/customers/*). El registro está partido en 4
// pasos porque así lo define el backend: cada paso guarda una cookie
// temporal que el siguiente paso necesita, así que hay que llamarlos en
// orden y con las mismas cookies (apiFetch ya manda "credentials: include").
import { apiFetch } from "../config/api";

const authService = {
  // Paso 1 del registro: manda un código de verificación al correo.
  sendVerificationCode(email) {
    return apiFetch("/auth/customers/register/sendCode", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  // Paso 2: confirma el código de 6 dígitos que llegó al correo.
  verifyCode(code) {
    return apiFetch("/auth/customers/register/verifyCode", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  // Paso 3: nombre y apellido del nuevo estudiante.
  savePersonalInfo({ name, lastName, carnet, phone, age }) {
    return apiFetch("/auth/customers/register/personalInfo", {
      method: "POST",
      body: JSON.stringify({ name, lastName, carnet, phone, age: Number(age) }),
    });
  },

  // Paso 4: define la contraseña y crea la cuenta ya con todos los datos
  // anteriores (el backend los recupera de la cookie de registro).
  setPassword(password) {
    return apiFetch("/auth/customers/register/setPassword", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  // Login: si es correcto, el backend deja la sesión en una cookie
  // httpOnly. No devuelve el perfil del cliente, por eso justo después
  // hay que pedirlo con customersService.getByEmail.
  login(email, password) {
    return apiFetch("/auth/customers/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout() {
    return apiFetch("/auth/logout", { method: "POST" });
  },

  // Recuperación de contraseña (backend/src/routes/auth/recoveryPasswordRoutes.js).
  // Igual que el registro, son 3 pasos encadenados por una cookie temporal
  // (recoveryCookie): pedir código, verificarlo y guardar la nueva clave.
  requestRecoveryCode(email) {
    return apiFetch("/auth/recovery/requestCode", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  verifyRecoveryCode(code) {
    return apiFetch("/auth/recovery/verifyCode", {
      method: "POST",
      body: JSON.stringify({ codeRequest: code }),
    });
  },

  setNewPassword(newPassword, confirmNewPassword) {
    return apiFetch("/auth/recovery/newPassword", {
      method: "POST",
      body: JSON.stringify({ newPassword, confirmNewPassword }),
    });
  },
};

export default authService;
