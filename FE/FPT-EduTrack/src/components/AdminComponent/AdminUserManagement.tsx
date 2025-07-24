import React, { useEffect, useState } from "react";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import type { UserResponse } from "../../types/userType";
import { getAllUsers, createUser } from "../../service/userService";
import CreateUserModal from "./CreateUserModal";
import Pagination from "../Pagination";
import SearchAndFilterMultiple from "../SearchAndFilterMultiple";
import { useUserPagination } from "../../hooks/useUserPagination";

interface UserCreateRequest {
  fullname: string;
  email: string;
  password: string;
  roleId: number;
}

// Extended interface to handle different API response structures

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserResponse | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Use user pagination hook
  const allUsers = users?.data || [];
  const {
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
    roleFilter,
    filteredUsers,
    paginatedUsers: displayUsers,
    totalPages,
    totalFilteredItems,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearchChange,
    handleStatusFilterChange,
    handleRoleFilterChange,
    clearFilters,
  } = useUserPagination({
    users: allUsers,
    itemsPerPage: 5,
    defaultSearchTerm: "",
    defaultStatusFilter: "all",
    defaultRoleFilter: "all",
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getAllUsers();
      console.log("API Response:", response); // Debug log
      setUsers(response);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData: UserCreateRequest) => {
    try {
      await createUser(
        userData.email,
        userData.fullname,
        userData.password,
        userData.password,
        userData.roleId
      );
      // Refresh the users list after successful creation
      await fetchUsers();
      setIsCreateModalOpen(false);

      // Show success notification
      setNotification({
        type: "success",
        message: "Tạo người dùng thành công!",
      });

      // Auto hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error("Failed to create user:", error);
      setIsCreateModalOpen(false);

      // Show error notification
      let errorMessage = "Có lỗi xảy ra khi tạo người dùng";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setNotification({
        type: "error",
        message: errorMessage,
      });

      // Auto hide notification after 7 seconds for errors
      setTimeout(() => {
        setNotification(null);
      }, 7000);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(
        displayUsers ? displayUsers.map((user) => String(user.id)) : []
      );
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "3":
        return "bg-purple-100 text-purple-800";
      case "4":
        return "bg-blue-100 text-blue-800";
      case "2":
        return "bg-green-100 text-green-800";
      case "1":
        return "bg-red-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-600 font-medium" : "text-red-600 font-medium";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80 ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span
            className={`text-sm font-medium flex-1 ${
              notification.type === "success"
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            className={`text-gray-400 hover:text-gray-600 ${
              notification.type === "success"
                ? "hover:text-green-600"
                : "hover:text-red-600"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản Lý Người Dùng
              </h1>
              <p className="text-gray-600 mt-1">
                Tổng: {allUsers.length} người dùng | Hiển thị:{" "}
                {totalFilteredItems} kết quả
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>New User</span>
            </button>
          </div>

          {/* Search and Filter Section */}
          <SearchAndFilterMultiple
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Tìm kiếm theo tên hoặc email..."
            filterValue={statusFilter}
            onFilterChange={handleStatusFilterChange}
            filterOptions={[
              { value: "active", label: "Hoạt động" },
              { value: "inactive", label: "Không hoạt động" },
            ]}
            filterLabel="Trạng thái"
            filterPlaceholder="Tất cả trạng thái"
            secondaryFilterValue={roleFilter}
            onSecondaryFilterChange={handleRoleFilterChange}
            secondaryFilterOptions={[
              { value: "1", label: "Examiner" },
              { value: "2", label: "Lecturer" },
              { value: "3", label: "Head" },
              { value: "4", label: "Student" },
            ]}
            secondaryFilterLabel="Vai trò"
            secondaryFilterPlaceholder="Tất cả vai trò"
            onClearFilters={clearFilters}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedUsers.length === (displayUsers?.length || 0) &&
                      (displayUsers?.length || 0) > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  User Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span>Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    {searchTerm ||
                    statusFilter !== "all" ||
                    roleFilter !== "all" ? (
                      <div>
                        <p className="mb-2">
                          Không tìm thấy người dùng nào phù hợp
                        </p>
                        <button
                          onClick={clearFilters}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Xóa bộ lọc để xem tất cả
                        </button>
                      </div>
                    ) : (
                      "Không có người dùng nào"
                    )}
                  </td>
                </tr>
              ) : displayUsers && displayUsers.length > 0 ? (
                displayUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id.toString())}
                        onChange={(e) =>
                          handleSelectUser(user.id.toString(), e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {user.fullname.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.fullname}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.roleId.toString()
                        )}`}
                      >
                        {user.roleName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusColor(user.isActive)}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActionMenu(
                              showActionMenu === user.id.toString()
                                ? null
                                : user.id.toString()
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </button>

                        {showActionMenu === user.id.toString() && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                <Edit className="w-4 h-4" />
                                <span>Edit User</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                                <Trash2 className="w-4 h-4" />
                                <span>Delete User</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Không có người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && totalFilteredItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalFilteredItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
};

export default UserManagement;
