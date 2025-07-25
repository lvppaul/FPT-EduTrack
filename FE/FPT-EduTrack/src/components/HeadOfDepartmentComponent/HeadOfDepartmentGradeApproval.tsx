import React, { useEffect, useState } from "react";
import {
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  ChevronDown,
  X,
  AlertCircle,
  BookOpen,
  Download,
  ArrowLeft,
  User,
  Clock,
} from "lucide-react";
import type { Report } from "../../types/requestType";
import {
  getReportsToConfirm,
  approveReport,
  rejectReport,
} from "../../service/reportService";
import Pagination from "../Pagination";

const HeadOfDepartmentGradeApproval: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Modal states
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [approvalForm, setApprovalForm] = useState({
    action: "approve" as "approve" | "reject",
    comments: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test detail view states
  const [showTestDetail, setShowTestDetail] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Report | null>(null);

  // Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "warning">(
    "success"
  );
  const [toastTimeoutId, setToastTimeoutId] = useState<number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to show toast notification
  const showToastNotification = (
    message: string,
    type: "success" | "error" | "warning"
  ) => {
    // Clear existing timeout if any
    if (toastTimeoutId) {
      clearTimeout(toastTimeoutId);
    }

    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    // Auto hide after 5 seconds for success, 4 seconds for others
    const timeout = type === "success" ? 5000 : 4000;
    const newTimeoutId = window.setTimeout(() => {
      setShowToast(false);
      setToastTimeoutId(null);
    }, timeout);

    setToastTimeoutId(newTimeoutId);
  };

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getReportsToConfirm();

      if (response && response.data) {
        setReports(response.data);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setError("Có lỗi xảy ra khi tải danh sách báo cáo");
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutId) {
        clearTimeout(toastTimeoutId);
      }
    };
  }, [toastTimeoutId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  const handleToggleDropdown = (reportId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === reportId ? null : reportId);
  };

  const handleApprove = (report: Report) => {
    setSelectedReport(report);
    setApprovalForm({
      action: "approve",
      comments: "",
    });
    setShowApprovalModal(true);
    setOpenDropdown(null);
  };

  const handleReject = (report: Report) => {
    setSelectedReport(report);
    setApprovalForm({
      action: "reject",
      comments: "",
    });
    setShowApprovalModal(true);
    setOpenDropdown(null);
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedReport(null);
    setApprovalForm({
      action: "approve",
      comments: "",
    });
  };

  const handleApprovalFormChange = (value: string) => {
    setApprovalForm((prev) => ({
      ...prev,
      comments: value,
    }));
  };

  const handleSubmitApproval = async () => {
    if (!selectedReport) return;

    try {
      setIsSubmitting(true);

      if (approvalForm.action === "approve") {
        await approveReport(selectedReport.id);
        showToastNotification("Phê duyệt báo cáo thành công!", "success");
      } else {
        await rejectReport(selectedReport.id);
        showToastNotification("Từ chối báo cáo thành công!", "success");
      }

      // Close modal and refresh data
      handleCloseApprovalModal();
      await fetchReports();
    } catch (error) {
      console.error("Error processing approval:", error);
      showToastNotification(
        `❌ Có lỗi xảy ra khi ${
          approvalForm.action === "approve" ? "phê duyệt" : "từ chối"
        } báo cáo. Vui lòng thử lại.`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTestDetail = (report: Report) => {
    setSelectedTest(report);
    setShowTestDetail(true);
    setOpenDropdown(null);
  };

  const handleBackToList = () => {
    setShowTestDetail(false);
    setSelectedTest(null);
  };

  const handleDownloadTest = (testLink: string | null, testTitle: string) => {
    if (!testLink) {
      showToastNotification("Không có file để tải xuống", "warning");
      return;
    }

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = testLink;
    link.download = `${testTitle}.pdf`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and search logic
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.test.code || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get report status based on reportStatusId
  const getReportStatus = (statusId: number) => {
    switch (statusId) {
      case 1:
        return { label: "Chờ xử lý", color: "yellow" };
      case 2:
        return { label: "Đã xử lý", color: "green" };
      case 3:
        return { label: "Đã chấm lại", color: "blue" };
      default:
        return { label: "Không xác định", color: "gray" };
    }
  };

  // Show test detail view
  if (showTestDetail && selectedTest) {
    return <TestDetailView report={selectedTest} onBack={handleBackToList} />;
  }
  // Show test detail view
  if (showTestDetail && selectedTest) {
    return <TestDetailView report={selectedTest} onBack={handleBackToList} />;
  }

  return (
    <>
      {/* Approval Modal */}
      {showApprovalModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 ${
                    approvalForm.action === "approve"
                      ? "bg-green-100"
                      : "bg-red-100"
                  } rounded-lg flex items-center justify-center`}
                >
                  {approvalForm.action === "approve" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {approvalForm.action === "approve"
                      ? "Phê Duyệt Báo Cáo"
                      : "Từ Chối Báo Cáo"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedReport.student.fullname} -{" "}
                    {selectedReport.test.title}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseApprovalModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* Report Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Nội dung báo cáo:
                </h3>
                <p className="text-sm text-gray-700">
                  {selectedReport.content}
                </p>
              </div>

              {/* Current Score */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">
                  Điểm hiện tại:
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                  {selectedReport.test.testsScores}/10
                </span>
              </div>

              {/* Comments Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhận xét của trưởng khoa
                </label>
                <textarea
                  value={approvalForm.comments}
                  onChange={(e) => handleApprovalFormChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  placeholder={`Nhập nhận xét về việc ${
                    approvalForm.action === "approve" ? "phê duyệt" : "từ chối"
                  } báo cáo...`}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleCloseApprovalModal}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitApproval}
                disabled={isSubmitting}
                className={`flex-1 inline-flex items-center justify-center px-4 py-2 ${
                  approvalForm.action === "approve"
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                } text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {approvalForm.action === "approve" ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    {approvalForm.action === "approve"
                      ? "Phê duyệt"
                      : "Từ chối"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-white to-blue-50 rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Phê Duyệt Báo Cáo
                </h1>
                <p className="text-gray-600 mt-1">
                  Danh sách báo cáo cần phê duyệt từ sinh viên
                </p>
              </div>
              <button
                onClick={fetchReports}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Làm mới
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Tổng: {reports.length} báo cáo | Hiển thị: {totalItems} kết quả
            </div>

            {/* Search and Filter Section */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên test, mã test hoặc tiêu đề báo cáo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {/* Clear Filters Button */}
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error ? (
              /* Error state */
              <div className="text-center py-12">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchReports}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                >
                  Thử lại
                </button>
              </div>
            ) : isLoading ? (
              /* Loading state */
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
              </div>
            ) : totalItems === 0 ? (
              /* Empty state - no results after filtering */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">
                  {searchTerm
                    ? "Không tìm thấy báo cáo nào phù hợp"
                    : "Không có báo cáo nào cần phê duyệt"}
                </p>
                <p className="text-sm text-gray-400">
                  {searchTerm
                    ? "Thử thay đổi từ khóa tìm kiếm"
                    : "Tất cả báo cáo đã được xem xét hoặc chưa có báo cáo mới"}
                </p>
              </div>
            ) : (
              /* Reports list */
              <div className="space-y-4">
                {paginatedReports.map((report) => {
                  const status = getReportStatus(report.reportStatusId);
                  return (
                    <div
                      key={report.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {report.test.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Báo cáo: {report.title}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-700">
                                Mã test:
                              </span>
                              <span className="text-gray-600">
                                {report.test.code || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-700">
                                Sinh viên:
                              </span>
                              <span className="text-gray-600">
                                {report.student.fullname}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Tạo lúc: {formatDate(report.createdAt)}</span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                status.color === "yellow"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : status.color === "green"
                                  ? "bg-green-100 text-green-800"
                                  : status.color === "blue"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {status.label}
                            </span>
                          </div>
                        </div>

                        <div className="text-right ml-6">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2 mb-2 mt-20">
                              {/* Dropdown Button for Actions */}
                              <div className="relative">
                                <button
                                  onClick={(e) =>
                                    handleToggleDropdown(report.id, e)
                                  }
                                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Thao tác
                                  <ChevronDown className="w-4 h-4 ml-2" />
                                </button>

                                {/* Dropdown Menu */}
                                {openDropdown === report.id && (
                                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <button
                                      onClick={() =>
                                        handleViewTestDetail(report)
                                      }
                                      className="w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
                                    >
                                      <Eye className="w-4 h-4 mr-3 text-blue-600" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          Xem chi tiết test
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Xem kết quả chấm điểm
                                        </div>
                                      </div>
                                    </button>
                                    <button
                                      onClick={() => handleApprove(report)}
                                      className="w-full flex items-center px-4 py-3 text-left hover:bg-green-50 transition-colors duration-200 border-b border-gray-100"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-3 text-green-600" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          Phê duyệt
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Chấp nhận báo cáo
                                        </div>
                                      </div>
                                    </button>
                                    <button
                                      onClick={() => handleReject(report)}
                                      className="w-full flex items-center px-4 py-3 text-left hover:bg-red-50 transition-colors duration-200"
                                    >
                                      <XCircle className="w-4 h-4 mr-3 text-red-600" />
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          Từ chối
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          Không chấp nhận báo cáo
                                        </div>
                                      </div>
                                    </button>
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  handleDownloadTest(
                                    report.test.link,
                                    report.test.title
                                  )
                                }
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                  report.test.link
                                    ? "bg-green-600 text-white hover:bg-green-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                disabled={!report.test.link}
                                title={
                                  report.test.link
                                    ? "Tải xuống test"
                                    : "Không có file để tải"
                                }
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Tải bài Thi
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalItems > 0 && (
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
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out transform translate-x-0 opacity-100"
          style={{
            animation: "slideInRight 0.3s ease-out",
          }}
        >
          <div
            className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg border max-w-md ${
              toastType === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : toastType === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-yellow-50 border-yellow-200 text-yellow-800"
            }`}
          >
            {toastType === "success" ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : toastType === "error" ? (
              <XCircle className="w-5 h-5 text-red-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Test Detail View Component
const TestDetailView: React.FC<{ report: Report; onBack: () => void }> = ({
  report,
  onBack,
}) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-white to-blue-50 rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chi Tiết Bài Test
                </h1>
                <p className="text-gray-600 mt-1">
                  {report.test.title} - {report.student.fullname}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Test Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin bài test
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Tên bài test:</span>
                <p className="text-gray-900 mt-1">{report.test.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Mã test:</span>
                <p className="text-gray-900 mt-1">
                  {report.test.code || "N/A"}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Sinh viên:</span>
                <p className="text-gray-900 mt-1">{report.student.fullname}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Email sinh viên:
                </span>
                <p className="text-gray-900 mt-1">{report.student.email}</p>
              </div>
            </div>
          </div>

          {/* Report Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nội dung báo cáo
            </h3>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Tiêu đề:</span>
                <p className="text-gray-900 mt-1">{report.title}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Nội dung:</span>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {report.content}
                </p>
              </div>
            </div>
          </div>

          {/* Lecturers Grading Results */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Kết quả chấm điểm của giảng viên
            </h3>

            {report.test.lecturersTestsDetailResponse &&
            report.test.lecturersTestsDetailResponse.length > 0 ? (
              <div className="space-y-4">
                {report.test.lecturersTestsDetailResponse.map(
                  (lecturer, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {lecturer.lecturer.fullname}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {lecturer.lecturer.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {lecturer.score || "Chưa chấm"}
                          </div>
                          <div className="text-sm text-gray-500">Điểm</div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Trạng thái:
                            </span>
                            <span
                              className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                lecturer.isGrading
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {lecturer.isGrading ? (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Đang chấm
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Đã chấm
                                </>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Phân công lúc:
                            </span>
                            <span className="ml-2 text-gray-600">
                              {new Date(
                                lecturer.lecturer.createdAt
                              ).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>

                        {lecturer.reason && (
                          <div className="mt-3">
                            <span className="font-medium text-gray-700">
                              Nhận xét:
                            </span>
                            <p className="text-gray-600 mt-1 text-sm">
                              {lecturer.reason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Chưa có giảng viên nào được phân công chấm bài test này
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadOfDepartmentGradeApproval;
