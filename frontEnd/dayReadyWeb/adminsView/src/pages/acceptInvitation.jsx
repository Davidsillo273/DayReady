import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';
import dayReadyLogo from '../imgs/DayReadyLogo.png';
import backgroundImage from '../imgs/backGroundLogin.png';

const BASE_URL = 'http://localhost:4000/api';

export default function AcceptInvitation({ loginPath = '/' }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [checking, setChecking] = useState(true);
  const [invitationValid, setInvitationValid] = useState(false);
  const [invitedUser, setInvitedUser] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const validateInvitation = async () => {
      if (!token) {
        setErrors({ general: 'Enlace de invitación inválido.' });
        setChecking(false);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/users/validate?token=${token}`, {
          method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
          setErrors({ general: data.message });
          setChecking(false);
          return;
        }

        setInvitedUser(data.data);
        setInvitationValid(true);
      } catch (error) {
        console.error('Error al validar invitación:', error);
        setErrors({ general: 'No se pudo conectar con el servidor.' });
      } finally {
        setChecking(false);
      }
    };

    validateInvitation();
  }, [token]);

  // --- Completar registro con la contraseña ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!password) newErrors.password = 'La contraseña es requerida';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    if (!terms) newErrors.terms = 'Debes aceptar los términos';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/users/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate(loginPath), 2000);
    } catch (error) {
      console.error('Error al completar registro:', error);
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

          {checking ? (
            <div className="py-10 text-center">
              <LoadingSpinner />
              <p className="text-gray-500 text-sm mt-4">Verificando invitación...</p>
            </div>
          ) : !invitationValid ? (
            <div className="py-6 text-center">
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate(loginPath)}
                className="text-orange-400 hover:text-orange-500 text-sm font-medium"
              >
                Volver al inicio de sesión
              </button>
            </div>
          ) : success ? (
            <div className="py-6 text-center">
              <div className="p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                <p className="text-green-700 text-sm font-medium">
                  ✓ Registro completado. Redirigiendo al inicio de sesión...
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-gray-800 font-semibold">
                  ¡Hola, {invitedUser?.name}!
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Crea tu contraseña para completar tu registro
                </p>
              </div>

              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <InputField
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  error={errors.password}
                  required
                />
                <InputField
                  label="Confirmar contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                  }}
                  error={errors.confirmPassword}
                  required
                />

                <div className="mt-4 mb-6">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => {
                        setTerms(e.target.checked);
                        if (errors.terms) setErrors({ ...errors, terms: null });
                      }}
                      className="form-checkbox h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded mt-1"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? <LoadingSpinner /> : 'Completar registro'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}