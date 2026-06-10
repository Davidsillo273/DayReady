import React from 'react';

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  fullWidth = false,
}) {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-orange-400 text-white hover:bg-orange-500 active:bg-orange-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
    link: 'text-orange-400 hover:text-orange-500 bg-transparent p-0',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${widthClass}`}
    >
      {children}
    </button>
  );
}
