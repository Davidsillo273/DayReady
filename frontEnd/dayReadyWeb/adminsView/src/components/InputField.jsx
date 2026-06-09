import React from 'react';

export default function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error = null,
  name = '',
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-xs font-semibold mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        name={name}
        className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 transition ${
          error
            ? 'border-red-500 focus:border-red-600 focus:ring-red-200'
            : 'border-gray-300 focus:border-orange-400 focus:ring-orange-200'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
