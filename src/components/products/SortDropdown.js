import React from 'react';
import { FaSort } from 'react-icons/fa';

/**
 * SortDropdown — modern, mobile-friendly Tailwind component
 *
 * Props:
 * - sortBy: string
 * - onSortChange: (value: string) => void
 * - sortOptions?: { value: string; label: string }[]
 * - label?: string  // default: "Sort by"
 * - className?: string
 */
const DEFAULT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

const SortDropdown = ({ sortBy, onSortChange, sortOptions = DEFAULT_OPTIONS, label = 'Sort by', className = '' }) => {
  return (
    <div className={`inline-flex w-full sm:w-auto items-center gap-2 ${className}`}>
      {/* Label (hidden on mobile to save space) */}
      <span className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-slate-700">
        <FaSort className="text-slate-500" /> {label}:
      </span>

      <div className="relative w-full sm:w-56">
        <FaSort className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 sm:hidden" />
        <select
          id="sort-select"
          aria-label={label}
          value={sortBy}
          onChange={(e) => onSortChange?.(e.target.value)}
          className="block w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-900/5 sm:pl-3"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default SortDropdown;
