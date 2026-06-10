const categories = [
  { name: 'Combos', icon: '🍔+🍟' },
  { name: 'Comida Rápida', icon: '🍕' },
  { name: 'Saludable', icon: '🥗' },
  { name: 'Snacks', icon: '🍿' },
  { name: 'Café', icon: '☕' },
  { name: 'Bebidas', icon: '🥤' },
  { name: 'Postres', icon: '🍰' },
];

export default function CategoryBar() {
  return (
    <div className="flex justify-center gap-3 py-6 overflow-x-auto bg-white">
      {categories.map((cat) => (
        <button key={cat.name} className="flex items-center gap-2 px-6 py-2 bg-gray-50 border border-gray-100 rounded-lg hover:shadow-md transition whitespace-nowrap text-sm text-gray-700 font-medium">
          <span>{cat.icon}</span> {cat.name}
        </button>
      ))}
    </div>
  );
}