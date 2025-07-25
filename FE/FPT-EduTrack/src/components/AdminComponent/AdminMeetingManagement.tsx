import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Video,
  Clock,
  Link,
  Play,
  Copy,
  RefreshCw,
  CheckCircle,
  X,
} from "lucide-react";
import type { Meeting, GetMeetingsResponse } from "../../types/meetingType";
import {
  getMeetings,
  updateMeetingStatus,
} from "../../service/googleAuthService";
import Pagination from "../Pagination";
import CreateMeetingModal from "./CreateMeetingModal";
const AdminMeetingManagement: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeetings, setSelectedMeetings] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Status update modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedMeetingForStatus, setSelectedMeetingForStatus] =
    useState<Meeting | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Filter meetings based on search and status
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = meeting.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || meeting.meetingStatusId === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMeetings = filteredMeetings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Fetch meetings data
  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response: GetMeetingsResponse = await getMeetings();

      if (response && response.data) {
        setMeetings(response.data);
      } else {
        setMeetings([]);
      }
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
      setError("Có lỗi xảy ra khi tải danh sách cuộc họp");
      setMeetings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMeetings(paginatedMeetings.map((meeting) => meeting.id));
    } else {
      setSelectedMeetings([]);
    }
  };

  const handleSelectMeeting = (meetingId: number, checked: boolean) => {
    if (checked) {
      setSelectedMeetings([...selectedMeetings, meetingId]);
    } else {
      setSelectedMeetings(selectedMeetings.filter((id) => id !== meetingId));
    }
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: // Scheduled
        return "bg-blue-100 text-blue-800";
      case 2: // In Progress
        return "bg-green-100 text-green-800";
      case 3: // Completed
        return "bg-gray-100 text-gray-800";
      case 4: // Cancelled
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDot = (statusId: number) => {
    switch (statusId) {
      case 1: // Scheduled
        return "bg-blue-500";
      case 2: // In Progress
        return "bg-green-500";
      case 3: // Completed
        return "bg-gray-500";
      case 4: // Cancelled
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (statusId: number, statusName?: string) => {
    if (statusName) return statusName;

    switch (statusId) {
      case 1:
        return "Đã lên lịch";
      case 2:
        return "Đang diễn ra";
      case 3:
        return "Đã hoàn thành";
      case 4:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const copyMeetLink = (link: string) => {
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  const joinMeeting = (link: string) => {
    window.open(link, "_blank");
  };

  // Handle create meeting success
  const handleCreateSuccess = () => {
    setNotification({
      type: "success",
      message: "Tạo phòng họp thành công!",
    });
    fetchMeetings(); // Refresh the meetings list

    // Auto hide notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Status options based on the image provided
  const statusOptions = [
    {
      id: 1,
      name: "Scheduled",
      label: "Đã lên lịch",
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 2,
      name: "In Progress",
      label: "Đang diễn ra",
      color: "bg-green-100 text-green-800",
    },
    {
      id: 3,
      name: "Completed",
      label: "Đã hoàn thành",
      color: "bg-gray-100 text-gray-800",
    },
    {
      id: 4,
      name: "Cancelled",
      label: "Đã hủy",
      color: "bg-red-100 text-red-800",
    },
  ];

  // Handle edit status click
  const handleEditStatus = (meeting: Meeting) => {
    setSelectedMeetingForStatus(meeting);
    setShowStatusModal(true);
    setShowActionMenu(null); // Close action menu
  };

  // Handle status update
  const handleStatusUpdate = async (newStatusId: number) => {
    if (!selectedMeetingForStatus) return;

    setIsUpdatingStatus(true);
    try {
      await updateMeetingStatus(
        selectedMeetingForStatus.id.toString(),
        newStatusId
      );

      setNotification({
        type: "success",
        message: "Cập nhật trạng thái thành công!",
      });

      // Refresh meetings list
      fetchMeetings();

      // Close modal
      setShowStatusModal(false);
      setSelectedMeetingForStatus(null);

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error updating meeting status:", error);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-white to-indigo-50 rounded-t-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản Lý Cuộc Họp
              </h1>
              <p className="text-gray-600 mt-1">
                Hiển thị {Math.min(filteredMeetings.length, itemsPerPage)} trong{" "}
                {filteredMeetings.length} cuộc họp
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchMeetings}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Làm mới</span>
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo mới cuộc họp</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 flex-wrap gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by meeting name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value === "all" ? "all" : parseInt(e.target.value)
                  )
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value={1}>Đã lên lịch</option>
                <option value={2}>Đang diễn ra</option>
                <option value={3}>Đã hoàn thành</option>
                <option value={4}>Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {error && (
          <div className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMeetings}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {isLoading && (
          <div className="p-6 text-center">
            <div className="inline-flex items-center">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              <span>Loading meetings...</span>
            </div>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedMeetings.length === paginatedMeetings.length &&
                        paginatedMeetings.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Meeting Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Meeting Link
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedMeetings.map((meeting) => (
                  <tr
                    key={meeting.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedMeetings.includes(meeting.id)}
                        onChange={(e) =>
                          handleSelectMeeting(meeting.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Video className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {meeting.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(meeting.createdAt).toLocaleDateString()}{" "}
                        {new Date(meeting.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          meeting.meetingStatusId
                        )}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 ${getStatusDot(
                            meeting.meetingStatusId
                          )} rounded-full mr-1.5`}
                        ></div>
                        {getStatusText(
                          meeting.meetingStatusId,
                          meeting.meetingStatusName
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-gray-50 rounded-lg px-2 py-1">
                          <Link className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-600 font-mono max-w-xs truncate">
                            {meeting.link}
                          </span>
                        </div>
                        <button
                          onClick={() => copyMeetLink(meeting.link)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                          title="Copy link"
                        >
                          <Copy className="w-3 h-3 text-gray-500" />
                        </button>
                        {meeting.meetingStatusId === 2 && (
                          <button
                            onClick={() => joinMeeting(meeting.link)}
                            className="p-1 hover:bg-green-100 rounded transition-colors duration-200 text-green-600"
                            title="Join meeting"
                          >
                            <Play className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActionMenu(
                              showActionMenu === meeting.id ? null : meeting.id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </button>

                        {showActionMenu === meeting.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => joinMeeting(meeting.link)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Video className="w-4 h-4" />
                                <span>Join Meeting</span>
                              </button>
                              <button
                                onClick={() => handleEditStatus(meeting)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit Status</span>
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                                <Trash2 className="w-4 h-4" />
                                <span>Cancel Meeting</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && paginatedMeetings.length === 0 && (
          <div className="p-12 text-center">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No meetings found"
                : "No meetings yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Get started by creating your first meeting"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create Meeting</span>
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && filteredMeetings.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredMeetings.length}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {/* Create Meeting Modal */}
      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Status Update Modal */}
      {showStatusModal && selectedMeetingForStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cập nhật trạng thái cuộc họp
                </h3>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedMeetingForStatus(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isUpdatingStatus}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Cuộc họp:{" "}
                <span className="font-medium">
                  {selectedMeetingForStatus.name}
                </span>
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {statusOptions.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => handleStatusUpdate(status.id)}
                    disabled={
                      isUpdatingStatus ||
                      selectedMeetingForStatus.meetingStatusId === status.id
                    }
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      selectedMeetingForStatus.meetingStatusId === status.id
                        ? "border-blue-500 bg-blue-50 cursor-not-allowed opacity-60"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 cursor-pointer"
                    } ${
                      isUpdatingStatus ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status.id === 1
                              ? "bg-blue-500"
                              : status.id === 2
                              ? "bg-green-500"
                              : status.id === 3
                              ? "bg-gray-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {status.label}
                          </p>
                          <p className="text-sm text-gray-500">{status.name}</p>
                        </div>
                      </div>
                      {selectedMeetingForStatus.meetingStatusId ===
                        status.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {isUpdatingStatus && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-sm text-blue-800">
                      Đang cập nhật trạng thái...
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedMeetingForStatus(null);
                }}
                disabled={isUpdatingStatus}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg ${
              notification.type === "success"
                ? "bg-green-100 border border-green-200"
                : "bg-red-100 border border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <X className="w-5 h-5 text-red-600 mr-3" />
            )}
            <p
              className={`text-sm font-medium ${
                notification.type === "success"
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              {notification.message}
            </p>
            <button
              onClick={() => setNotification(null)}
              className={`ml-4 p-1 rounded ${
                notification.type === "success"
                  ? "hover:bg-green-200"
                  : "hover:bg-red-200"
              }`}
            >
              <X
                className={`w-4 h-4 ${
                  notification.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMeetingManagement;
