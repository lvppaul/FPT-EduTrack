import React from "react";
import { Search, Filter, X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface SearchAndFilterMultipleProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Primary filter
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: FilterOption[];
  filterLabel?: string;
  filterPlaceholder?: string;

  // Secondary filter
  secondaryFilterValue?: string;
  onSecondaryFilterChange?: (value: string) => void;
  secondaryFilterOptions?: FilterOption[];
  secondaryFilterLabel?: string;
  secondaryFilterPlaceholder?: string;

  onClearFilters: () => void;
  showClearButton?: boolean;
}

const SearchAndFilterMultiple: React.FC<SearchAndFilterMultipleProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = "Bộ lọc",
  filterPlaceholder = "Tất cả",
  secondaryFilterValue,
  onSecondaryFilterChange,
  secondaryFilterOptions = [],
  secondaryFilterLabel = "Bộ lọc 2",
  secondaryFilterPlaceholder = "Tất cả",
  onClearFilters,
  showClearButton = true,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value);
  };

  const handleSecondaryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (onSecondaryFilterChange) {
      onSecondaryFilterChange(e.target.value);
    }
  };

  const hasFilters =
    searchTerm !== "" ||
    filterValue !== "all" ||
    (secondaryFilterValue && secondaryFilterValue !== "all");

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Search Input - Takes 2 columns */}
      <div className="md:col-span-2 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      {/* Primary Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 whitespace-nowrap">
          {filterLabel}:
        </span>
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-gray-400" />
          </div>
          <select
            value={filterValue}
            onChange={handleFilterChange}
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
          >
            <option value="all">{filterPlaceholder}</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Secondary Filter or Clear Button */}
      {secondaryFilterOptions.length > 0 && onSecondaryFilterChange ? (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {secondaryFilterLabel}:
          </span>
          <select
            value={secondaryFilterValue || "all"}
            onChange={handleSecondaryFilterChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
          >
            <option value="all">{secondaryFilterPlaceholder}</option>
            {secondaryFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        showClearButton && (
          <div className="flex items-center">
            <button
              onClick={onClearFilters}
              disabled={!hasFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </button>
          </div>
        )
      )}

      {/* Clear Button Row if we have secondary filter */}
      {secondaryFilterOptions.length > 0 && showClearButton && (
        <div className="md:col-span-4 flex justify-end">
          <button
            onClick={onClearFilters}
            disabled={!hasFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4 mr-2" />
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilterMultiple;
