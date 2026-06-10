import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import dayReadyLogo from '../../imgs/DayReadyLogo.png';
import backgroundImage from '../../imgs/backGroundLogin.png';

export default function RegisterUser() {

  // Para cuando esté la API
  // const registerCustomer = async (datos) => {
  //   const response = await fetch('https://tu-api.com/registro', {
  //     method: 'POST',
  //     body: JSON.stringify(datos),
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  //   return response.json();
  // };

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');

  const [formData, setFormData] = useState({
    names: '',
    lastNames: '',
    email: '',
    password: '',
    phone: '',
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  // --- PASO 1: Validar correo y enviar código ---
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      setErrors({ email: 'El correo es requerido' });
      return;
    }

    setLoading(true);
    try {

      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Código enviado a:', formData.email);
      setStep(2);
    } catch (error) {
      console.error('Error al enviar código:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- PASO 2: Verificar el código ---
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setErrors({ code: 'Ingresa el código' });
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Código verificado:', verificationCode);
      setStep(3);
    } catch (error) {
      console.error('Error al verificar código:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- PASO 3: Registro final ---
  const handleInsertData = async (e) => {
    e.preventDefault();

    // Validación final
    const newErrors = {};
    if (!formData.names.trim()) newErrors.names = 'Requerido';
    if (!formData.lastNames.trim()) newErrors.lastNames = 'Requerido';
    if (!formData.password) newErrors.password = 'Requerida';
    if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (!formData.phone.trim()) newErrors.phone = 'Requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 500);
  };

  // --- PASO 4: Aceptar Términos y Registro Final ---
  // const handleFinalRegistration = async (e) => {
  //   e.preventDefault();
  //   if (!formData.terms) {
  //     setErrors({ terms: 'Debes aceptar los términos' });
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await registerCustomer(formData);
  //     navigate('/');
  //   } catch (error) {
  //     console.error('Error al registrar usuario:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleFinalRegistration = async (e) => {
    e.preventDefault();
    if (!formData.terms) {
      setErrors({ terms: 'Debes aceptar los términos' });
      return;
    }

    setLoading(true);
    try {
      // Simulamos que el servidor responde con éxito en 1.5 segundos
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Datos enviados:", formData);
      navigate('/'); // Ahora sí te mandará al Login
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`
      }}
    >
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">

          <div className="text-center">
            <img src={dayReadyLogo} alt="Day Ready Logo" className="w-64 h-auto mx-auto object-contain" />
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm font-medium">
              {step === 1 && "Ingresa tu correo para comenzar"}
              {step === 2 && "Ingresa tu código para verificar tu cuenta"}
              {step === 3 && "Ingresa tus datos para finalizar el registro"}
              {step === 4 && "Acepta los términos y condiciones para continuar"}
            </p>
          </div>

          {/* ---- INTERFAZ PASO 1 ---- */}
          {step === 1 && (
            <form onSubmit={handleSendCode}>
              <InputField
                label="Correo electrónico"
                type="email"
                placeholder="nombreusuario@ejemplo.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
              >
                {loading ? <LoadingSpinner /> : 'Enviar código'}
              </button>
            </form>
          )}

          {/* ---- INTERFAZ PASO 2 ---- */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode}>
              <p className="text-xs text-gray-500 mb-4 text-center">
                Código enviado a <strong>{formData.email}</strong>
              </p>
              <InputField
                label="Código de verificación"
                type="text"
                placeholder="Ej. 123456"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  setErrors({});
                }}
                error={errors.code}
                required
              />
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg"
                >
                  {loading ? <LoadingSpinner /> : 'Verificar'}
                </button>
              </div>
            </form>
          )}

          {/* ---- INTERFAZ PASO 3 ---- */}
          {step === 3 && (
            <form onSubmit={handleInsertData}>
              <InputField
                label="Nombres"
                type="text"
                name="names"
                placeholder="Ej. David Eduardo"
                value={formData.names}
                onChange={handleChange}
                error={errors.names}
                required
              />
              <InputField
                label="Apellidos"
                type="text"
                name="lastNames"
                placeholder="Ej. Pérez García"
                value={formData.lastNames}
                onChange={handleChange}
                error={errors.lastNames}
                required
              />
              <InputField
                label="Teléfono"
                type="tel"
                name="phone"
                placeholder="Ej. 1234-5678"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />
              <InputField
                label="Contraseña"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg"
              >
                {loading ? <LoadingSpinner /> : 'Siguiente'}
              </button>
            </form>
          )}

          {/* ---- INTERFAZ PASO 4: TÉRMINOS Y CONDICIONES ---- */}
          {step === 4 && (
            <form onSubmit={handleFinalRegistration}>
              <div className="mt-4 mb-6">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={(e) => {
                      setFormData({ ...formData, terms: e.target.checked });
                      if (errors.terms) setErrors({ ...errors, terms: null });
                    }}
                    className="form-checkbox h-4 w-4 text-green-500 focus:ring-green-400 border-gray-300 rounded mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Acepto los{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
                      términos y condiciones
                    </a>
                  </span>
                </label>

                {/* Mensaje de error si intentan avanzar sin aceptar */}
                {errors.terms && (
                  <p className="text-red-500 text-xs mt-2 ml-6">{errors.terms}</p>
                )}
              </div>

              {/* Botones de navegación */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg flex items-center justify-center transition disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner /> : 'Finalizar registro'}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div className="mt-6 text-center">
              <span className="text-gray-600 text-xs">¿Ya tienes cuenta? </span>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-orange-400 hover:text-orange-500 text-xs font-medium"
              >
                Iniciar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}