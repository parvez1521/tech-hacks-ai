import React from 'react';
import { Category } from '../types';
import { Link } from '../router/Router';
import { toolsData } from '../data/seedData';
import {
  Code,
  Bot,
  CheckSquare,
  Briefcase,
  BarChart2,
  Palette,
  Shield,
  Layers,
} from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Code,
  Bot,
  CheckSquare,
  Briefcase,
  BarChart2,
  Palette,
  Shield,
  Layers,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const IconComponent = iconMap[category.iconName] || Layers;
  const toolCount = toolsData.filter((t) => t.categories.includes(category.slug)).length;

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative flex flex-col justify-between p-5 rounded-lg border border-border bg-card/90 hover:bg-card hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/20 transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:-translate-y-1"
    >
      {/* Decorative Subtle Inner Spotlight on Hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(240px circle at 50% 30%, rgba(59, 130, 246, 0.08), transparent 75%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary/20 group-hover:scale-105 transition-all duration-200">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base tracking-tight truncate group-hover:text-primary transition-colors duration-200">
              {category.name}
            </h3>
            <span className="text-xs text-muted-foreground block">
              {toolCount} {toolCount === 1 ? 'tool' : 'tools'} listed
            </span>
          </div>
        </div>

        <p className="text-sm text-secondary-foreground line-clamp-2 mb-4">
          {category.description}
        </p>

        {/* Subcategories tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {category.subcategories.slice(0, 3).map((sub) => (
            <span
              key={sub.slug}
              className="px-2 py-0.5 rounded text-[11px] bg-muted text-muted-foreground border border-border group-hover:border-border/80 transition-colors"
            >
              {sub.name}
            </span>
          ))}
          {category.subcategories.length > 3 && (
            <span className="text-[11px] text-muted-foreground self-center">
              +{category.subcategories.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-primary font-medium">
        <span>Browse category</span>
        <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
      </div>
    </Link>
  );
};
