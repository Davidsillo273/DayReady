import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import dayReadyLogo from '../imgs/DayReadyLogo.png';

const BASE_URL = 'http://localhost:4000/api';

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El correo es requerido';
    if (!password) newErrors.password = 'La contraseña es requerida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/admins/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          setErrors({ general: data.message });
        } else if (response.status === 403) {
          setErrors({ general: data.message });
        } else {
          setErrors({ general: 'Error al iniciar sesión. Intenta de nuevo.' });
        }
        return;
      }

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrors({ general: 'No se pudo conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center overflow-x-hidden">
      <div className="w-full max-w-xl px-4">

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto">

          {/* Logo */}
          <div className="text-center mb-12">
            <img
              src={dayReadyLogo}
              alt="Day Ready Logo"
              className="w-64 h-auto mx-auto object-contain"
            />
          </div>

          {/* Bienvenida */}
          <div className="text-center mb-6">
            <h1 className="text-gray-800 text-2xl font-bold">Bienvenido,</h1>
            <h1 className="text-gray-800 text-2xl font-bold">Administrador.</h1>
          </div>

          {/* Error general */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            </div>
          )}

          <InputField
            label="Correo"
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

          {/* Botón Ingresar */}
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            className="mb-4"
          >
            {loading ? <LoadingSpinner /> : 'Ingresar'}
          </Button>

          {/* Enlaces */}
          <div className="text-center space-y-2">
            <div>
              <button
                type="button"
                onClick={() => navigate('/admin/recovery')}
                className="text-orange-400 hover:text-orange-500 text-sm font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
