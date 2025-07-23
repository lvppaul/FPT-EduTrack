import { useState, useMemo } from "react";

interface FilterableItem {
  status?: string;
  category?: string;
  type?: string;
  [key: string]: unknown;
}

interface UseClientPaginationProps<T extends FilterableItem> {
  data: T[];
  itemsPerPage?: number;
  searchFields?: (keyof T)[];
  defaultSearchTerm?: string;
  defaultFilter?: string;
}

interface UseClientPaginationReturn<T> {
  // States
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  filterValue: string;

  // Computed values
  filteredData: T[];
  paginatedData: T[];
  totalPages: number;
  totalFilteredItems: number;

  // Handlers
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setSearchTerm: (term: string) => void;
  setFilterValue: (value: string) => void;
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (items: number) => void;
  handleSearchChange: (term: string) => void;
  handleFilterChange: (value: string) => void;
  clearFilters: () => void;
}

export function useClientPagination<T extends FilterableItem>({
  data,
  itemsPerPage: initialItemsPerPage = 10,
  searchFields = [],
  defaultSearchTerm = "",
  defaultFilter = "all",
}: UseClientPaginationProps<T>): UseClientPaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [filterValue, setFilterValue] = useState(defaultFilter);

  // Filter data based on search term and filter
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search filter
      const searchMatch =
        searchTerm === "" ||
        searchFields.some((field) => {
          const fieldValue = item[field];
          return (
            fieldValue &&
            String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase())
          );
        });

      // Status/Category filter
      const filterMatch =
        filterValue === "all" ||
        (item.status && item.status === filterValue) ||
        (item.category && item.category === filterValue) ||
        (item.type && item.type === filterValue);

      return searchMatch && filterMatch;
    });
  }, [data, searchTerm, filterValue, searchFields]);

  // Paginate filtered data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalFilteredItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredItems / itemsPerPage));

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setSearchTerm(defaultSearchTerm);
    setFilterValue(defaultFilter);
    setCurrentPage(1);
  };

  return {
    // States
    currentPage,
    itemsPerPage,
    searchTerm,
    filterValue,

    // Computed values
    filteredData,
    paginatedData,
    totalPages,
    totalFilteredItems,

    // Handlers
    setCurrentPage,
    setItemsPerPage,
    setSearchTerm,
    setFilterValue,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleFilterChange,
    clearFilters,
  };
}
