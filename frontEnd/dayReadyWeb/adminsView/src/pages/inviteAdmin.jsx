import React, { useState } from 'react';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';
import dayReadyLogo from '../imgs/DayReadyLogo.png';

const BASE_URL = 'http://localhost:4000/api';

export default function InviteAdmin() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    lastName: '',
    phone: '',
    local: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
    if (errors.general) setErrors({ ...errors, general: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Requerido';
    if (!formData.name.trim()) newErrors.name = 'Requerido';
    if (!formData.lastName.trim()) newErrors.lastName = 'Requerido';
    if (!formData.phone.trim()) newErrors.phone = 'Requerido';
    if (!formData.local.trim()) newErrors.local = 'Requerido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/users/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message });
        return;
      }

      setSuccess(true);
      setFormData({ email: '', name: '', lastName: '', phone: '', local: '' });
    } catch (error) {
      console.error('Error al enviar invitación:', error);
      setErrors({ general: 'No se pudo conectar con el servidor.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-6">
            <img src={dayReadyLogo} alt="Day Ready Logo" className="w-48 h-auto mx-auto object-contain" />
          </div>

          <h1 className="text-center text-xl font-bold text-gray-800 mb-1">Invitar Administrador</h1>
          <p className="text-center text-gray-600 text-sm mb-6">
            Se enviará un enlace de registro al correo proporcionado
          </p>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{errors.general}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm text-center font-medium">
                ✓ Invitación enviada correctamente
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-1">
            <InputField
              label="Correo electrónico"
              type="email"
              name="email"
              placeholder="admin@dayready.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
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
              label="Local"
              type="text"
              name="local"
              placeholder="Ej. Local Principal"
              value={formData.local}
              onChange={handleChange}
              error={errors.local}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <LoadingSpinner /> : 'Enviar invitación'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}