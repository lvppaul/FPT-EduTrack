import { useState, useMemo } from "react";
import type { Exam } from "../types/examType";

interface UseExamPaginationProps {
  exams: Exam[];
  itemsPerPage?: number;
  defaultSearchTerm?: string;
  defaultStatusFilter?: string;
}

interface UseExamPaginationReturn {
  // States
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  statusFilter: string;

  // Computed values
  filteredExams: Exam[];
  paginatedExams: Exam[];
  totalPages: number;
  totalFilteredItems: number;

  // Handlers
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (items: number) => void;
  handleSearchChange: (term: string) => void;
  handleStatusFilterChange: (status: string) => void;
  clearFilters: () => void;
}

export function useExamPagination({
  exams,
  itemsPerPage: initialItemsPerPage = 10,
  defaultSearchTerm = "",
  defaultStatusFilter = "all",
}: UseExamPaginationProps): UseExamPaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);

  // Filter exams based on search term and status
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      // Search filter (by name or code)
      const searchMatch =
        searchTerm === "" ||
        exam.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exam.name &&
          exam.name.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter
      const statusMatch =
        statusFilter === "all" || exam.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [exams, searchTerm, statusFilter]);

  // Paginate filtered exams
  const paginatedExams = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredExams.slice(startIndex, endIndex);
  }, [filteredExams, currentPage, itemsPerPage]);

  const totalFilteredItems = filteredExams.length;
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

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setSearchTerm(defaultSearchTerm);
    setStatusFilter(defaultStatusFilter);
    setCurrentPage(1);
  };

  return {
    // States
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,

    // Computed values
    filteredExams,
    paginatedExams,
    totalPages,
    totalFilteredItems,

    // Handlers
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleStatusFilterChange,
    clearFilters,
  };
}
