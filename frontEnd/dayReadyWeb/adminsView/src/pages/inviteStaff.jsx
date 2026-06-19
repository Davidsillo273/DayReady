import React, { useState } from 'react';
import { Shield, Briefcase, CheckCircle2 } from 'lucide-react';
import InputField from '../components/InputField';
import LoadingSpinner from '../components/LoadingSpinner';
import dayReadyLogo from '../imgs/DayReadyLogo.png';

const BASE_URL = 'http://localhost:4000/api';

const ROLE_CONFIG = {
    admin: { endpoint: 'admins', label: 'Administrador', placeholder: 'admin@dayready.com' },
    employee: { endpoint: 'employees', label: 'Empleado', placeholder: 'employee@dayready.com' },
};

export default function InviteStaff() {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState(null); // 'admin' | 'employee'

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        lastName: '',
        phone: '',
        local: '',
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
        if (errors.general) setErrors({ ...errors, general: null });
    };

    // --- PASO 1: Elegir el rol a invitar ---
    const handleSelectRole = (selectedRole) => {
        setRole(selectedRole);
        setStep(2);
    };

    // --- PASO 2: Llenar datos y enviar la invitación ---
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
            const { endpoint } = ROLE_CONFIG[role];
            const response = await fetch(`${BASE_URL}/auth/users/${endpoint}`, {
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

            setStep(3);
        } catch (error) {
            console.error('Error al enviar invitación:', error);
            setErrors({ general: 'No se pudo conectar con el servidor.' });
        } finally {
            setLoading(false);
        }
    };

    // --- Reiniciar todo el flujo para invitar a otra persona ---
    const handleInviteAnother = () => {
        setFormData({ email: '', name: '', lastName: '', phone: '', local: '' });
        setErrors({});
        setRole(null);
        setStep(1);
    };

    const roleLabel = role ? ROLE_CONFIG[role].label : '';

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-white p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <div className="text-center mb-6">
                        <img src={dayReadyLogo} alt="Day Ready Logo" className="w-48 h-auto mx-auto object-contain" />
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-gray-600 text-sm font-medium">
                            {step === 1 && 'Invitar Usuario'}
                            {step === 2 && `Datos del nuevo ${roleLabel.toLowerCase()}`}
                            {step === 3 && 'Invitación enviada'}
                        </p>
                    </div>

                    {/* ---- PASO 1: ELEGIR ROL ---- */}
                    {step === 1 && (
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => handleSelectRole('admin')}
                                className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all text-left"
                            >
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Administrador</p>
                                    <p className="text-xs text-gray-500">Acceso completo a la gestión del sistema</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleSelectRole('employee')}
                                className="w-full flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all text-left"
                            >
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Briefcase className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Empleado</p>
                                    <p className="text-xs text-gray-500">Acceso operativo a un local específico</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {/* ---- PASO 2: DATOS DEL INVITADO ---- */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-1">
                            <p className="text-xs text-gray-500 mb-4 text-center">
                                Se enviará un enlace de registro al correo proporcionado
                            </p>

                            {errors.general && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-600 text-sm text-center">{errors.general}</p>
                                </div>
                            )}

                            <InputField
                                label="Correo electrónico"
                                type="email"
                                name="email"
                                placeholder={ROLE_CONFIG[role].placeholder}
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

                            <div className="flex gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    disabled={loading}
                                    className="w-1/3 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                                >
                                    Volver
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-2/3 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
                                >
                                    {loading ? <LoadingSpinner /> : 'Enviar invitación'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* ---- PASO 3: CONFIRMACIÓN ---- */}
                    {step === 3 && (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                            </div>
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-green-700 text-sm font-medium">
                                    Invitación enviada correctamente a <strong>{formData.email}</strong>
                                </p>
                            </div>
                            <p className="text-gray-500 text-xs">
                                El {roleLabel.toLowerCase()} recibirá un enlace para completar su registro.
                            </p>

                            <button
                                type="button"
                                onClick={handleInviteAnother}
                                className="w-full mt-2 bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
                            >
                                Invitar a otra persona
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}