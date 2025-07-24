import { useState, useMemo } from "react";
import type { User } from "../types/userType";

interface UseUserPaginationProps {
  users: User[];
  itemsPerPage?: number;
  defaultSearchTerm?: string;
  defaultStatusFilter?: string;
  defaultRoleFilter?: string;
}

interface UseUserPaginationReturn {
  // States
  currentPage: number;
  itemsPerPage: number;
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;

  // Computed values
  filteredUsers: User[];
  paginatedUsers: User[];
  totalPages: number;
  totalFilteredItems: number;

  // Handlers
  handlePageChange: (page: number) => void;
  handleItemsPerPageChange: (items: number) => void;
  handleSearchChange: (term: string) => void;
  handleStatusFilterChange: (status: string) => void;
  handleRoleFilterChange: (role: string) => void;
  clearFilters: () => void;
}

export function useUserPagination({
  users,
  itemsPerPage: initialItemsPerPage = 10,
  defaultSearchTerm = "",
  defaultStatusFilter = "all",
  defaultRoleFilter = "all",
}: UseUserPaginationProps): UseUserPaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [statusFilter, setStatusFilter] = useState(defaultStatusFilter);
  const [roleFilter, setRoleFilter] = useState(defaultRoleFilter);

  // Filter users based on search term, status and role
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter (by fullname or email)
      const searchMatch =
        searchTerm === "" ||
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter (active/inactive)
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      // Role filter
      const roleMatch =
        roleFilter === "all" || user.roleId.toString() === roleFilter;

      return searchMatch && statusMatch && roleMatch;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const totalFilteredItems = filteredUsers.length;
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

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setSearchTerm(defaultSearchTerm);
    setStatusFilter(defaultStatusFilter);
    setRoleFilter(defaultRoleFilter);
    setCurrentPage(1);
  };

  return {
    // States
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
    roleFilter,

    // Computed values
    filteredUsers,
    paginatedUsers,
    totalPages,
    totalFilteredItems,

    // Handlers
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleStatusFilterChange,
    handleRoleFilterChange,
    clearFilters,
  };
}
