import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import dayReadyLogo from '../../imgs/DayReadyLogo.png';
import backgroundImage from '../../imgs/backGroundLogin.png';

const BASE_URL = 'http://localhost:4000/api';

export default function RegisterCustomer() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastName: '',
    carnet: '',
    phone: '',
    password: '',
    terms: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
    if (errors.general) setErrors({ ...errors, general: null });
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
      const response = await fetch(`${BASE_URL}/auth/customers/register/sendCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      setStep(2);
    } catch (error) {
      console.error('Error al enviar código:', error);
      setErrors({ general: 'No se pudo conectar con el servidor.' });
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
      const response = await fetch(`${BASE_URL}/auth/customers/register/verifyCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      setStep(3);
    } catch (error) {
      console.error('Error al verificar código:', error);
      setErrors({ general: 'No se pudo conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  // --- PASO 3: Información personal ---
  const handlePersonalInfo = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'Requerido';
    if (!formData.carnet.trim()) newErrors.carnet = 'Requerido';
    if (!formData.phone.trim()) newErrors.phone = 'Requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/customers/register/personalInfo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          carnet: formData.carnet,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      setStep(4);
    } catch (error) {
      console.error('Error al guardar información personal:', error);
      setErrors({ general: 'No se pudo conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  // --- PASO 4: Contraseña, términos y registro final ---
  const handleFinalRegistration = async (e) => {
    e.preventDefault();

    if (!formData.password) {
      setErrors({ password: 'La contraseña es requerida' });
      return;
    }
    if (!formData.terms) {
      setErrors({ terms: 'Debes aceptar los términos' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/customers/register/setPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: formData.password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      navigate('/');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setErrors({ general: 'No se pudo conectar con el servidor.' });
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
              {step === 3 && "Ingresa tus datos personales"}
              {step === 4 && "Crea tu contraseña y acepta los términos"}
            </p>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            </div>
          )}

          {/* ---- PASO 1 ---- */}
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

          {/* ---- PASO 2 ---- */}
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

          {/* ---- PASO 3 ---- */}
          {step === 3 && (
            <form onSubmit={handlePersonalInfo}>
              <InputField
                label="Nombres"
                type="text"
                name="name"
                placeholder="Ej. David Eduardo"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />
              <InputField
                label="Apellidos"
                type="text"
                name="lastName"
                placeholder="Ej. Pérez García"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              <InputField
                label="Carnet"
                type="text"
                name="carnet"
                placeholder="Ej. AB123456"
                value={formData.carnet}
                onChange={handleChange}
                error={errors.carnet}
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

              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg"
                >
                  {loading ? <LoadingSpinner /> : 'Siguiente'}
                </button>
              </div>
            </form>
          )}

          {/* ---- PASO 4: CONTRASEÑA Y TÉRMINOS ---- */}
          {step === 4 && (
            <form onSubmit={handleFinalRegistration}>
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

                {errors.terms && (
                  <p className="text-red-500 text-xs mt-2 ml-6">{errors.terms}</p>
                )}
              </div>

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
