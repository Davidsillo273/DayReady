import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import dayReadyLogo from '../imgs/DayReadyLogo.png';

export default function RegisterUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    names: '',
    lastNames: '',
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.names.trim()) newErrors.names = 'El nombre es requerido';
    if (!formData.lastNames.trim()) newErrors.lastNames = 'El apellido es requerido';
    if (!formData.email.trim()) newErrors.email = 'El correo es requerido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Register attempt:', formData);
      // Aquí irá la lógica de registro
    } catch (error) {
      console.error('Error al registrarse:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center overflow-x-hidden py-4">
      <div className="w-full max-w-md px-4">
        

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">

             {/* Logo */}
        <div className="text-center mb-4">
          <img
            src={dayReadyLogo}
            alt="Day Ready Logo"
            className="w-32 h-auto mx-auto object-contain"
          />
        </div>

        {/* Subtítulo */}
        <div className="text-center mb-3">
          <p className="text-gray-600 text-xs">Ingresa tus datos para el registro</p>
        </div>

          <InputField
            label="Nombres"
            type="text"
            placeholder="Su nombre"
            name="names"
            value={formData.names}
            onChange={handleChange}
            error={errors.names}
            required
          />

          <InputField
            label="Apellidos"
            type="text"
            placeholder="Su apellido"
            name="lastNames"
            value={formData.lastNames}
            onChange={handleChange}
            error={errors.lastNames}
            required
          />

          <InputField
            label="Correo electrónico"
            type="email"
            placeholder="tuusuario@ejemplo.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <InputField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <InputField
            label="Teléfono"
            type="tel"
            placeholder="1234-5678"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          {/* Botón Registrarse */}
          <div className="mb-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium py-2 text-sm rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <LoadingSpinner /> : 'Registrarse'}
            </button>
          </div>

          {/* Enlaces */}
          <div className="text-center mb-3">
            <span className="text-gray-600 text-xs">¿Ya tienes cuenta? </span>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-orange-400 hover:text-orange-500 text-xs font-medium"
            >
              Iniciar sesión
            </button>
          </div>

          {/* Divisor */}
          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-400 text-xs">o</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-lg py-2 text-sm transition"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">Google</span>
          </button>
        </form>
      </div>
    </div>
  );
}
