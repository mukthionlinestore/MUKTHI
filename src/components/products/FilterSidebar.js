import React from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

/**
 * Tailwind-first, accessible FilterSidebar.
 *
 * Props:
 * - categories: string[]
 * - brands: string[]
 * - selectedCategory: string
 * - selectedBrand: string
 * - onCategoryChange: (category: string) => void
 * - onBrandChange: (brand: string) => void
 * - showClose?: boolean                // show a close button (useful inside mobile drawer)
 * - onClose?: () => void               // handler for the close button
 */
const FilterSidebar = ({
  categories = [],
  brands = [],
  selectedCategory = '',
  selectedBrand = '',
  onCategoryChange,
  onBrandChange,
  showClose = false,
  onClose,
}) => {
  const hasFilters = Boolean(selectedCategory || selectedBrand);

  const toggleCategory = (value) => {
    if (!onCategoryChange) return;
    onCategoryChange(selectedCategory === value ? '' : value);
  };

  const toggleBrand = (value) => {
    if (!onBrandChange) return;
    onBrandChange(selectedBrand === value ? '' : value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">
          <FaFilter className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Filters</span>
        </div>
        <h3 className="ml-1 text-sm font-semibold text-slate-900">Refine results</h3>
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100"
            aria-label="Close filters"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Categories</p>
        <ul className="flex flex-col gap-2">
          {categories.length === 0 && (
            <li className="text-sm text-slate-500">No categories</li>
          )}
          {categories.map((cat) => {
            const checked = selectedCategory === cat;
            return (
              <li key={cat}>
                <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-slate-700 transition hover:border-slate-200 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={() => toggleCategory(cat)}
                    aria-checked={checked}
                  />
                  <span
                    className={[
                      'relative grid h-4 w-4 place-items-center rounded-sm border',
                      checked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white',
                    ].join(' ')}
                    aria-hidden
                  >
                    <svg
                      className={[
                        'h-3 w-3 text-white transition-opacity',
                        checked ? 'opacity-100' : 'opacity-0',
                      ].join(' ')}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className={[
                    'transition-colors',
                    checked ? 'font-semibold text-indigo-700' : 'text-slate-700',
                  ].join(' ')}>
                    {cat}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Brands</p>
        <ul className="flex flex-col gap-2">
          {brands.length === 0 && (
            <li className="text-sm text-slate-500">No brands</li>
          )}
          {brands.map((brand) => {
            const checked = selectedBrand === brand;
            return (
              <li key={brand}>
                <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm text-slate-700 transition hover:border-slate-200 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={() => toggleBrand(brand)}
                    aria-checked={checked}
                  />
                  <span
                    className={[
                      'relative grid h-4 w-4 place-items-center rounded-sm border',
                      checked ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white',
                    ].join(' ')}
                    aria-hidden
                  >
                    <svg
                      className={[
                        'h-3 w-3 text-white transition-opacity',
                        checked ? 'opacity-100' : 'opacity-0',
                      ].join(' ')}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className={[
                    'transition-colors',
                    checked ? 'font-semibold text-indigo-700' : 'text-slate-700',
                  ].join(' ')}>
                    {brand}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Actions */}
      {hasFilters && (
        <div className="border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => {
              if (onCategoryChange) onCategoryChange('');
              if (onBrandChange) onBrandChange('');
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
          >
            <FaTimes /> Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
