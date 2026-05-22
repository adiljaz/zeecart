import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'All', icon: '✨' },
  { name: 'T-Shirts', icon: '👕' },
  { name: 'Jeans', icon: '👖' },
  { name: 'Dresses', icon: '👗' },
  { name: 'Accessories', icon: '👜' },
  { name: 'Footwear', icon: '👟' },
];

const CategoryNav = ({ activeCategory, onSelect }) => {
  return (
    <div className="w-full overflow-x-auto pb-4 no-scrollbar">
      <div className="flex gap-3 min-w-max px-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.name === 'All' ? '' : cat.name)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-premium
              ${(activeCategory === cat.name || (activeCategory === '' && cat.name === 'All'))
                ? 'bg-navy-fixed text-white shadow-lg scale-105'
                : 'bg-card-bg text-navy border border-border hover:border-navy/20'}
            `}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
