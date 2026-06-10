import React from 'react';

export default function StatCard({ title, value, change, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-t-4 border-orange-400">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-2">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-900">
            {value}
          </h3>
          <p className="text-green-600 text-sm mt-2 font-medium">
            {change}
          </p>
        </div>
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
