import React from 'react';
import { categories } from '../data/categories';
import { CategoryCard } from '../components/CategoryCard';
import { Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
          <Layers className="w-4 h-4" />
          <span>Taxonomy Directory</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Software Categories
        </h1>
        <p className="text-sm sm:text-base text-secondary-foreground max-w-2xl">
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
