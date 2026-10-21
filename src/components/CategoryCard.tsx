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
      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-[#DFE7F3] dark:border-slate-800 bg-white dark:bg-[#111C2F] hover:bg-white dark:hover:bg-[#16233B] hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-invary-blue transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:border-blue-500/60 focus-visible:outline-none focus-visible:-translate-y-1 shadow-xs"
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 group-hover:scale-105 transition-all duration-200">
            <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-base tracking-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {category.name}
            </h2>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] block font-mono">
              {toolCount} {toolCount === 1 ? 'tool' : 'tools'} listed
            </span>
          </div>
        </div>

        <p className="text-sm text-[#475569] dark:text-[#CBD5E1] line-clamp-2 mb-4 leading-relaxed">
          {category.description}
        </p>

        {/* Subcategories tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {category.subcategories.slice(0, 3).map((sub) => (
            <span
              key={sub.slug}
              className="px-2.5 py-0.5 rounded-md text-[11px] bg-slate-50 dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1] border border-slate-200 dark:border-[#334155] group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-colors"
            >
              {sub.name}
            </span>
          ))}
          {category.subcategories.length > 3 && (
            <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8] self-center font-mono font-medium">
              +{category.subcategories.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 pt-3 border-t border-[#DFE7F3] dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">
        <span>Browse category</span>
        <span className="group-hover:translate-x-1 transition-transform duration-200 font-bold">→</span>
      </div>
    </Link>
  );
};
