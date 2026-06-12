import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import LoadingSpinner from '../../components/LoadingSpinner';
import backgroundImage from '../../imgs/backGroundLogin.png';

const BASE_URL = 'http://localhost:4000/api';

export default function RecoveryPass({ loginPath = '/' }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // --- PASO 1: Solicitar código de recuperación ---
  const handleRequestCode = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email.trim()) newErrors.email = 'El correo es requerido';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El correo no es válido';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/recovery/requestCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      setErrors({});
      setStep(2);
    } catch (error) {
      console.error('Error al solicitar código:', error);
      setErrors({ general: 'No se pudo conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  // --- PASO 2: Verificar código ---
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setErrors({ code: 'Ingresa el código' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/recovery/verifyCode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ codeRequest: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      setErrors({});
      setStep(3);
    } catch (error) {
      console.error('Error al verificar código:', error);
      setErrors({ general: 'No se pudo conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  // --- PASO 3: Establecer nueva contraseña ---
  const handleNewPassword = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!newPassword) newErrors.newPassword = 'La contraseña es requerida';
    if (!confirmNewPassword) newErrors.confirmNewPassword = 'Confirma tu contraseña';
    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Las contraseñas no coinciden';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
Hola2056_
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/recovery/newPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword, confirmNewPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      setErrors({});
      setSuccess(true);
    } catch (error) {
      console.error('Error al actualizar la contraseña:', error);
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
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">

          {/* Título */}
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
            Recuperar Contraseña
          </h1>

          {/* Subtítulo */}
          <p className="text-center text-gray-600 text-sm mb-6">
            {step === 1 && 'Introduce tu correo electrónico para recibir un código de verificación'}
            {step === 2 && 'Ingresa el código que enviamos a tu correo'}
            {step === 3 && !success && 'Crea tu nueva contraseña'}
          </p>

          {/* Error general */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            </div>
          )}

          {/* Mensaje de éxito final */}
          {success ? (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
              <p className="text-green-700 text-sm text-center font-medium">
                ✓ Tu contraseña ha sido actualizada correctamente
              </p>
            </div>
          ) : (
            <>
              {/* ---- PASO 1: CORREO ---- */}
              {step === 1 && (
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <InputField
                    label="Correo electrónico"
                    type="email"
                    placeholder="usuario@instituto.edu.sv"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    error={errors.email}
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? <LoadingSpinner /> : 'Enviar código >'}
                  </button>
                </form>
              )}

              {/* ---- PASO 2: CÓDIGO DE VERIFICACIÓN ---- */}
              {step === 2 && (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <p className="text-xs text-gray-500 text-center -mt-2">
                    Código enviado a <strong>{email}</strong>
                  </p>

                  <InputField
                    label="Código de verificación"
                    type="text"
                    placeholder="Ej. 123456"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      if (errors.code) setErrors({ ...errors, code: null });
                    }}
                    error={errors.code}
                    required
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-2/3 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? <LoadingSpinner /> : 'Verificar >'}
                    </button>
                  </div>
                </form>
              )}

              {/* ---- PASO 3: NUEVA CONTRASEÑA ---- */}
              {step === 3 && (
                <form onSubmit={handleNewPassword} className="space-y-4">
                  <InputField
                    label="Nueva contraseña"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword) setErrors({ ...errors, newPassword: null });
                    }}
                    error={errors.newPassword}
                    required
                  />

                  <InputField
                    label="Confirmar contraseña"
                    type="password"
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      if (errors.confirmNewPassword) setErrors({ ...errors, confirmNewPassword: null });
                    }}
                    error={errors.confirmNewPassword}
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? <LoadingSpinner /> : 'Actualizar contraseña >'}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Link de volver al login */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate(loginPath)}
              className="text-orange-400 hover:text-orange-500 text-sm font-medium inline-flex items-center gap-1"
            >
              <span>&lt;</span>
              Volver al inicio de sesión
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
