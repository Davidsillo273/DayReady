import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RecoveryPass() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'El correo es requerido';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El correo no es válido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Recovery password attempt:', { email });
      setSuccess(true);
      setEmail('');
      // Aquí irá la lógica de envío de email
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center overflow-x-hidden py-8">
      <div className="w-full max-w-md px-4">
        {/* Contenedor del formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border-2 border-dashed border-blue-300">
          {/* Título */}
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
            Recuperar Contraseña
          </h1>

          {/* Subtítulo */}
          <p className="text-center text-gray-600 text-sm mb-6">
            Introduce tu correo electrónico para recibir las instrucciones de restablecimiento
          </p>

          {success ? (
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 mb-4">
              <p className="text-green-700 text-sm text-center font-medium">
                ✓ Se han enviado las instrucciones a tu correo electrónico
              </p>
            </div>
          ) : null}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Botón Enviar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <LoadingSpinner /> : 'Enviar Instrucciones >'}
            </button>
          </form>

          {/* Link de volver */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
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
