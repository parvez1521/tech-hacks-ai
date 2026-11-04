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
  ArrowRight,
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
      className="group surface-card interactive-card press-feedback relative flex flex-col justify-between p-4 rounded-[1.25rem] focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:outline-none"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 ring-1 ring-border/40 group-hover:bg-primary/15 group-hover:scale-105 transition-[background-color,transform] duration-200">
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-base tracking-tight truncate group-hover:text-primary transition-colors duration-200">
              {category.name}
            </h2>
            <span className="text-xs text-muted-foreground block font-mono tabular-nums">
              {toolCount} {toolCount === 1 ? 'tool' : 'tools'} listed
            </span>
          </div>
        </div>

        <p className="text-sm text-secondary-foreground line-clamp-2 mb-4 leading-relaxed">
          {category.description}
        </p>

        {/* Subcategories tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {category.subcategories.slice(0, 3).map((sub) => (
            <span
              key={sub.slug}
              className="px-2.5 py-0.5 rounded-full text-[11px] bg-muted/60 text-secondary-foreground border border-border group-hover:border-primary/30 transition-colors duration-200"
            >
              {sub.name}
            </span>
          ))}
          {category.subcategories.length > 3 && (
            <span className="text-[11px] text-muted-foreground self-center font-mono font-medium">
              +{category.subcategories.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-border flex items-center justify-between text-xs text-primary font-semibold">
        <span>Browse category</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden="true" />
      </div>
    </Link>
  );
};
