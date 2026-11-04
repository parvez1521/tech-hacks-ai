import React from 'react';
import { categories } from '../data/categories';
import { CategoryCard } from '../components/CategoryCard';
import { Layers } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 border-b border-border/70 pb-8">
        <div className="kicker mb-3 inline-flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span>Taxonomy Directory</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Software Categories
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl sm:text-base">
          Browse open source software alternatives categorized by domain, developer workflow, and business operational needs.
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};
