import React, { useEffect, useState, useCallback } from "react";
import { Plus, Search, Eye, CheckCircle, AlertCircle, X } from "lucide-react";
import NewRequestModal from "../AdminComponent/NewRequestModel";
import ReportDetailView from "./ReportDetailView";
import Pagination from "../Pagination";
import type { GetReportsResponse, Report } from "../../types/requestType";
import { getReports } from "../../service/reportService";

const RequestManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<GetReportsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Pagination states for client-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Status options based on the table image
  const statusOptions = [
    { id: "All", name: "Tất cả" },
    { id: "1", name: "Đang chờ xử lí" },
    { id: "2", name: "Đang chấm bài" },
    { id: "3", name: "Đã chấm" },
    { id: "4", name: "Đang chờ họp" },
    { id: "5", name: "Đã xác nhận" },
    { id: "6", name: "Đã từ chối" },
  ];

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReports();
      setRequests(response);
    } catch (error) {
      console.error("Lỗi khi fetch reports:", error);
      setRequests({
        success: false,
        message: "Error fetching reports",
        data: [],
        count: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedReport(null);
  };

  const handleRefreshReport = async () => {
    await fetchRequests();
    if (selectedReport) {
      const updatedResponse = await getReports();
      const updatedReport = updatedResponse.data.find(
        (report: Report) => report.id === selectedReport.id
      );
      if (updatedReport) {
        setSelectedReport(updatedReport);
      }
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddRequest = async (requestData: Record<string, unknown>) => {
    try {
      console.log("Add request:", requestData);
      await fetchRequests();
      setIsModalOpen(false);
      setNotification({
        type: "success",
        message: "Tạo yêu cầu thành công!",
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error adding request:", error);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi tạo yêu cầu!",
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Client-side filtering and pagination
  const filteredRequests = (requests?.data || []).filter((request) => {
    const matchesStatus =
      statusFilter === "All" ||
      request.reportStatusId.toString() === statusFilter;

    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.student?.fullname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      false;

    return matchesStatus && matchesSearch;
  });

  // Client-side pagination
  const totalFilteredItems = filteredRequests.length;
  const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const getStatusInfo = (statusId: number) => {
    const statusMap = {
      1: { name: "Đang chờ xử lí", color: "bg-yellow-100 text-yellow-800" },
      2: { name: "Đang chấm bài", color: "bg-blue-100 text-blue-800" },
      3: { name: "Đã chấm", color: "bg-green-100 text-green-800" },
      4: { name: "Đang chờ họp", color: "bg-orange-100 text-orange-800" },
      5: { name: "Đã xác nhận", color: "bg-purple-100 text-purple-800" },
      6: { name: "Đã từ chối", color: "bg-red-100 text-red-800" },
    };
    return (
      statusMap[statusId as keyof typeof statusMap] || {
        name: "Không xác định",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  // Report Detail View
  if (showDetail && selectedReport) {
    return (
      <ReportDetailView
        report={selectedReport}
        onBack={handleBackToList}
        onRefreshReport={handleRefreshReport}
      />
    );
  }

  // Main List View
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-white to-purple-50 rounded-t-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản Lý Báo Cáo
              </h1>
              <p className="text-gray-600 mt-1">
                Tổng: {requests?.count || 0} báo cáo | Hiển thị:{" "}
                {totalFilteredItems} kết quả
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo báo cáo mới
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, nội dung, tên sinh viên..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || statusFilter !== "All") && (
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              {searchTerm || statusFilter !== "All" ? (
                <div>
                  <p className="text-gray-500 mb-2">
                    Không tìm thấy báo cáo nào phù hợp
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    Xóa bộ lọc để xem tất cả
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">Không có báo cáo nào</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedRequests.map((report: Report) => (
                <div
                  key={report.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {report.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            Sinh viên
                          </span>
                          <span className="text-gray-600">
                            {report.student?.fullname || "N/A"}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            Ngày tạo
                          </span>
                          <span className="text-gray-600">
                            {new Date(report.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            Trạng thái
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium w-fit ${
                              getStatusInfo(report.reportStatusId).color
                            }`}
                          >
                            {getStatusInfo(report.reportStatusId).name}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            Loại báo cáo
                          </span>
                          <span className="text-gray-600">
                            {report.isSecond
                              ? "Báo cáo lần 2"
                              : "Báo cáo lần 1"}
                          </span>
                        </div>

                        <div className="flex flex-col md:col-span-2">
                          <span className="font-medium text-gray-700">
                            Nội dung
                          </span>
                          <span className="text-gray-600 truncate">
                            {report.content}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalFilteredItems > 0 && (
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

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3" />
            )}
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Report Modal */}
      <NewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRequest}
      />
    </div>
  );
};

export default RequestManagement;
