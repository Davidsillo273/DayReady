import React from 'react';

export default function PromoCard({ title, subtitle, linkText, icon, bgColor, textColor, borderColor, isWallet }) {
  return (
    <div className={`p-6 rounded-2xl flex justify-between items-center border ${bgColor} ${borderColor} relative overflow-hidden h-32`}>
      <div className="z-10">
        <h2 className={`text-xl font-bold ${isWallet ? 'text-gray-800' : 'text-orange-900 italic text-2xl'}`}>
          {title}
        </h2>
        <p className={`${isWallet ? 'text-gray-600' : 'text-orange-800 opacity-80'} text-sm`}>
          {subtitle}
        </p>
        
        {/* Si es la tarjeta de Wallet, mostramos el link verde */}
        {linkText && (
          <a href="#" className="text-green-600 text-xs font-bold underline mt-2 block italic hover:text-green-700 transition">
            {linkText}
          </a>
        )}
      </div>

      {/* Icono decorativo grande al fondo */}
      <div className="text-5xl opacity-20 select-none">
        {icon}
      </div>
    </div>
  );
}