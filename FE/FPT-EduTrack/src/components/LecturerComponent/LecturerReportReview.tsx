import React, { useEffect, useState } from "react";
import {
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  ChevronDown,
  X,
  Save,
  AlertCircle,
  BookOpen,
  Download,
} from "lucide-react";
import type { Report } from "../../types/requestType";
import { getReportsByLecturer } from "../../service/reportService";
import { updateTestScoreChangeReportStatus } from "../../service/testService";
import { AuthUtils } from "../../utils/authUtils";
import Pagination from "../Pagination";

const LecturerReportReview: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Manual grading modal states
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingReport, setGradingReport] = useState<Report | null>(null);
  const [gradingForm, setGradingForm] = useState({
    score: 0,
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      const userData = AuthUtils.getUserFromToken();
      if (!userData || !userData.sub) {
        setError("Không thể lấy thông tin người dùng");
        return;
      }

      const response = await getReportsByLecturer(parseInt(userData.sub));

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

  const handleManualGrading = (report: Report) => {
    setGradingReport(report);
    setGradingForm({
      score: report.test.testsScores || 0,
      reason: "",
    });
    setShowGradingModal(true);
    setOpenDropdown(null);
  };

  const handleCloseGradingModal = () => {
    setShowGradingModal(false);
    setGradingReport(null);
    setGradingForm({
      score: 0,
      reason: "",
    });
  };

  const handleGradingFormChange = (field: string, value: string | number) => {
    setGradingForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitGrading = async () => {
    if (!gradingReport) return;

    // Validate form data
    if (gradingForm.score < 0 || gradingForm.score > 10) {
      showToastNotification("⚠️ Điểm số phải từ 0 đến 10", "warning");
      return;
    }

    if (!gradingForm.reason.trim()) {
      showToastNotification("⚠️ Vui lòng nhập nhận xét chấm lại", "warning");
      return;
    }

    try {
      setIsSubmitting(true);

      const userData = AuthUtils.getUserFromToken();
      if (!userData || !userData.sub) {
        showToastNotification(
          "🔐 Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.",
          "error"
        );
        return;
      }

      const reportId = gradingReport.id;
      const reportStatusId = 3;
      const gradingData = {
        testId: gradingReport.test.id,
        score: Number(gradingForm.score), // Ensure it's a number
        lecturerId: parseInt(userData.sub),
        reason: gradingForm.reason.trim(),
        isGrading: false, // Set to false as the grading is completed
      };

      console.log("=== DEBUG INFO ===");
      console.log("Report ID:", reportId);
      console.log("Report Status ID:", reportStatusId);
      console.log("Grading Data:", gradingData);
      console.log("User Data:", userData);
      console.log("=================");

      const response = await updateTestScoreChangeReportStatus(
        reportId,
        reportStatusId,
        gradingData
      );

      console.log("API response:", response);

      if (response) {
        showToastNotification(" Chấm lại bài test thành công!", "success");
        // Close modal and refresh data
        handleCloseGradingModal();
        await fetchReports();
      } else {
        showToastNotification(
          "Có lỗi xảy ra khi chấm lại bài test. Vui lòng thử lại.",
          "error"
        );
      }
    } catch (error: unknown) {
      console.error("Error updating test score:", error);

      // More detailed error handling
      let errorMessage =
        "Có lỗi xảy ra khi chấm lại bài test. Vui lòng thử lại.";

      if (error && typeof error === "object" && "response" in error) {
        // Server responded with error status
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        console.error("Server error response:", axiosError.response?.data);
        errorMessage = ` Lỗi từ server: ${
          axiosError.response?.data?.message || "Không xác định"
        }`;
      } else if (error && typeof error === "object" && "request" in error) {
        // Network error
        console.error(
          "Network error:",
          (error as { request: unknown }).request
        );
        errorMessage = " Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.";
      } else if (error && typeof error === "object" && "message" in error) {
        // Other error
        errorMessage = ` ${(error as { message: string }).message}`;
      }

      showToastNotification(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTest = (testLink: string | null, testTitle: string) => {
    if (!testLink) {
      showToastNotification(" Không có file để tải xuống", "warning");
      return;
    }

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = testLink;
    link.download = `${testTitle}.pdf`; // You can adjust the extension based on your file type
    link.target = "_blank"; // Open in new tab if direct download doesn't work
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter and search logic
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.test.code || "").toLowerCase().includes(searchTerm.toLowerCase());

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

  // Show test detail view
  // (Removed test detail view functionality)

  return (
    <>
      {/* Manual Grading Modal */}
      {showGradingModal && gradingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Save className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Chấm Lại Bài Test
                  </h2>
                  <p className="text-sm text-gray-500">
                    {gradingReport.student.fullname} -{" "}
                    {gradingReport.test.title}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseGradingModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              {/* New Score Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={gradingForm.score}
                  onChange={(e) =>
                    handleGradingFormChange(
                      "score",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Nhập điểm từ 0 đến 10"
                  disabled={isSubmitting}
                />
              </div>

              {/* Reason Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhận xét chấm lại
                </label>
                <textarea
                  value={gradingForm.reason}
                  onChange={(e) =>
                    handleGradingFormChange("reason", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                  rows={4}
                  placeholder="Nhập nhận xét chi tiết về việc chấm lại..."
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={handleCloseGradingModal}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitGrading}
                disabled={
                  isSubmitting ||
                  gradingForm.score < 0 ||
                  gradingForm.score > 10 ||
                  !gradingForm.reason.trim()
                }
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu điểm
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
          <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-white to-green-50 rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Báo Cáo Chấm Lại
                </h1>
                <p className="text-gray-600 mt-1">
                  Danh sách báo cáo cần xem xét và chấm lại
                </p>
              </div>
              <button
                onClick={fetchReports}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md"
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
                    placeholder="Tìm kiếm theo tên test hoặc mã test..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md"
                >
                  Thử lại
                </button>
              </div>
            ) : isLoading ? (
              /* Loading state */
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
                    : "Không có báo cáo nào cần xem xét"}
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
                {paginatedReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {report.test.title}
                            </h3>
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
                        </div>

                        <div className="text-xs text-gray-500">
                          Tạo lúc: {formatDate(report.createdAt)}
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2 mb-2 mt-20 ">
                            {/* Dropdown Button for Actions */}
                            <div className="relative">
                              <button
                                onClick={(e) =>
                                  handleToggleDropdown(report.id, e)
                                }
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Chấm lại
                                <ChevronDown className="w-4 h-4 ml-2" />
                              </button>

                              {/* Dropdown Menu */}
                              {openDropdown === report.id && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => handleManualGrading(report)}
                                    className="w-full flex items-center px-4 py-3 text-left hover:bg-green-50 transition-colors duration-200"
                                  >
                                    <Save className="w-4 h-4 mr-3 text-green-600" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        Chấm lại thủ công
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Chấm lại điểm test
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
                ))}
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

export default LecturerReportReview;
