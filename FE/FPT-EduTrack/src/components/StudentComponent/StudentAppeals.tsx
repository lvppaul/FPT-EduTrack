import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  RefreshCw,
  BookOpen,
  Filter,
  Eye,
  X,
} from "lucide-react";
import { getReportsByStudent } from "../../service/reportService";
import type { Report } from "../../types/requestType";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../Pagination";

const StudentAppeals: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");

  // Detail modal state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Fetch reports data
  const fetchReports = useCallback(async () => {
    if (!user?.sub) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await getReportsByStudent(parseInt(user.sub));

      if (response && response.data) {
        setReports(response.data);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setError("Có lỗi xảy ra khi tải danh sách đơn phúc khảo");
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.sub]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Filter reports based on search and status filter
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.test.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.reportStatusId === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalItems = filteredReports.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Get report status information
  const getReportStatus = (statusId: number) => {
    switch (statusId) {
      case 1:
        return {
          label: "Chờ xử lý",
          color: "yellow",
          icon: <Clock className="w-4 h-4" />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
        };
      case 2:
        return {
          label: "Đang chấm",
          color: "blue",
          icon: <MessageSquare className="w-4 h-4" />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
        };
      case 3:
        return {
          label: "Đã chấm",
          color: "green",
          icon: <CheckCircle className="w-4 h-4" />,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case 4:
        return {
          label: "Chờ họp",
          color: "purple",
          icon: <Calendar className="w-4 h-4" />,
          bgColor: "bg-purple-100",
          textColor: "text-purple-800",
        };
      case 5:
        return {
          label: "Được chấp nhận",
          color: "green",
          icon: <CheckCircle className="w-4 h-4" />,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case 6:
        return {
          label: "Bị từ chối",
          color: "red",
          icon: <AlertTriangle className="w-4 h-4" />,
          bgColor: "bg-red-100",
          textColor: "text-red-800",
        };
      default:
        return {
          label: "Không xác định",
          color: "gray",
          icon: <AlertTriangle className="w-4 h-4" />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle view detail
  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-white to-orange-50 rounded-t-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Đơn Phúc Khảo Của Tôi
              </h1>
              <p className="text-gray-600 mt-1">
                Hiển thị {Math.min(filteredReports.length, itemsPerPage)} trong{" "}
                {filteredReports.length} đơn phúc khảo
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchReports}
                disabled={isLoading}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span>Làm mới</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 flex-wrap gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, nội dung, tên bài test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value === "all" ? "all" : parseInt(e.target.value)
                  )
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value={1}>Chờ xử lý</option>
                <option value={2}>Đang chấm</option>
                <option value={3}>Đã chấm</option>
                <option value={4}>Chờ họp</option>
                <option value={5}>Được chấp nhận</option>
                <option value={6}>Bị từ chối</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {error && (
          <div className="p-6 text-center">
            <div className="text-red-600 mb-4 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
            <button
              onClick={fetchReports}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
            >
              Thử lại
            </button>
          </div>
        )}

        {isLoading && (
          <div className="p-6 text-center">
            <div className="inline-flex items-center">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              <span>Đang tải danh sách đơn phúc khảo...</span>
            </div>
          </div>
        )}

        {/* Reports List */}
        {!isLoading && !error && (
          <div className="p-6">
            {paginatedReports.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== "all"
                    ? "Không tìm thấy đơn phúc khảo nào"
                    : "Chưa có đơn phúc khảo nào"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "Thử điều chỉnh bộ lọc tìm kiếm"
                    : "Các đơn phúc khảo của bạn sẽ xuất hiện ở đây"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedReports.map((report) => {
                  const status = getReportStatus(report.reportStatusId);
                  return (
                    <div
                      key={report.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {report.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Bài test: {report.test.title} ({report.test.code})
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Tạo ngày: {formatDate(report.createdAt)}
                              </div>
                              <div className="flex items-center">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                ID: #{report.id}
                              </div>
                              {report.isSecond && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                                  Lần 2
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {status.icon}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}
                            >
                              {status.label}
                            </span>
                          </div>
                          <button
                            onClick={() => handleViewDetail(report)}
                            className="px-4 py-2 text-orange-600 border border-orange-300 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Xem chi tiết</span>
                          </button>
                        </div>
                      </div>

                      {/* Report content preview */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Nội dung phúc khảo:
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {report.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && filteredReports.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Chi tiết đơn phúc khảo
                    </h3>
                    <p className="text-orange-100 text-sm">
                      ID: #{selectedReport.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedReport(null);
                  }}
                  className="text-white hover:text-orange-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin cơ bản
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tiêu đề
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedReport.title}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Bài test
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedReport.test.title} ({selectedReport.test.code})
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày tạo
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {formatDate(selectedReport.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Trạng thái
                      </label>
                      <div className="mt-1 flex items-center space-x-2">
                        {getReportStatus(selectedReport.reportStatusId).icon}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            getReportStatus(selectedReport.reportStatusId)
                              .bgColor
                          } ${
                            getReportStatus(selectedReport.reportStatusId)
                              .textColor
                          }`}
                        >
                          {getReportStatus(selectedReport.reportStatusId).label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Content */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Nội dung phúc khảo
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedReport.content}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                {selectedReport.isSecond && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-800">
                        Đây là đơn phúc khảo lần thứ 2
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedReport(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentAppeals;
