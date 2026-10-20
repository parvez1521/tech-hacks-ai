import React from 'react';
import { categories } from '../data/categories';
import { CategoryCard } from '../components/CategoryCard';
import { Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Taxonomy Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F1F5F9] tracking-tight mb-2">
          Software Categories
        </h1>
        <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] max-w-2xl">
          Browse open source software alternatives categorized by domain, developer workflow, and business operational needs.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};
