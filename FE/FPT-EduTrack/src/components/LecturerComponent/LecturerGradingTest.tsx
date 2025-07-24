import React, { useEffect, useState } from "react";
import {
  FileText,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Bot,
  User,
  ChevronDown,
  X,
  Save,
} from "lucide-react";
import type { Test } from "../../types/examType";
import {
  getTestsByGradingLecturerId,
  updateTestScore,
} from "../../service/testService";
import { AuthUtils } from "../../utils/authUtils";
import TestDetailView from "../AdminComponent/TestDetailView";
import Pagination from "../Pagination";

const LecturerGradingTest: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Manual grading modal states
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingTest, setGradingTest] = useState<Test | null>(null);
  const [gradingForm, setGradingForm] = useState({
    score: 0,
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "graded"
  >("all");

  const fetchGradingTests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userData = AuthUtils.getUserFromToken();
      if (!userData || !userData.sub) {
        setError("Không thể lấy thông tin người dùng");
        return;
      }

      const response = await getTestsByGradingLecturerId(
        parseInt(userData.sub),
        true
      );

      if (response && response.data) {
        setTests(response.data);
      } else {
        setTests([]);
      }
    } catch (error) {
      console.error("Failed to fetch grading tests:", error);
      setError("Có lỗi xảy ra khi tải danh sách bài test");
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGradingTests();
  }, []);

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

  const handleToggleDropdown = (testId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === testId ? null : testId);
  };

  const handleManualGrading = (test: Test) => {
    setGradingTest(test);
    setGradingForm({
      score: 0,
      reason: "",
    });
    setShowGradingModal(true);
    setOpenDropdown(null);
  };

  const handleCloseGradingModal = () => {
    setShowGradingModal(false);
    setGradingTest(null);
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
    if (!gradingTest) return;

    // Validate form data
    if (gradingForm.score < 0 || gradingForm.score > 10) {
      alert("Điểm số phải từ 0 đến 10");
      return;
    }

    if (!gradingForm.reason.trim()) {
      alert("Vui lòng nhập nhận xét");
      return;
    }

    try {
      setIsSubmitting(true);

      const userData = AuthUtils.getUserFromToken();
      if (!userData || !userData.sub) {
        alert("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      const gradingData = {
        testId: gradingTest.id,
        lecturerId: parseInt(userData.sub),
        score: Number(gradingForm.score), // Ensure it's a number
        reason: gradingForm.reason.trim(),
        isGrading: false, // Set to false as requested
      };

      console.log("Submitting grading data:", gradingData);

      const response = await updateTestScore(gradingData);

      if (response) {
        alert("Chấm điểm thành công!");
        handleCloseGradingModal();
        fetchGradingTests(); // Refresh the list
      } else {
        alert("Có lỗi xảy ra khi chấm điểm");
      }
    } catch (error) {
      console.error("Error submitting grading:", error);
      alert("Có lỗi xảy ra khi chấm điểm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIGrading = (test: Test) => {
    // TODO: Implement AI grading logic here
    console.log("AI Grading for test:", test);
    // For now, redirect to TestDetailView for AI grading
    setSelectedTest(test);
    setShowDetail(true);
    setOpenDropdown(null);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedTest(null);
  };

  const handleRefreshTests = () => {
    fetchGradingTests();
  };

  const handleDownloadTest = (testLink: string | null, testTitle: string) => {
    if (!testLink) {
      alert("Không có file để tải xuống");
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

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  // Filter and search logic
  const filteredTests = tests.filter((test) => {
    // Search by title
    const matchesSearch = test.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Filter by status
    let matchesStatus = true;
    if (statusFilter === "pending") {
      // Chưa chấm - check if any lecturer is still grading (isGrading = true)
      matchesStatus =
        test.lecturersTestsDetailResponse?.some(
          (lecturer) => lecturer.isGrading
        ) ?? true;
    } else if (statusFilter === "graded") {
      // Đã chấm - all lecturers have finished grading (isGrading = false)
      matchesStatus =
        test.lecturersTestsDetailResponse?.every(
          (lecturer) => !lecturer.isGrading
        ) ?? false;
    }

    return matchesSearch && matchesStatus;
  });

  // Pagination logic with filtered data
  const totalItems = filteredTests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTests = filteredTests.slice(
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value as "all" | "pending" | "graded");
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Show test detail view if a test is selected
  if (showDetail && selectedTest) {
    return (
      <TestDetailView
        test={selectedTest}
        onBack={handleBackToList}
        onRefreshTest={handleRefreshTests}
      />
    );
  }

  return (
    <>
      {/* Manual Grading Modal */}
      {showGradingModal && gradingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Chấm điểm thủ công
              </h2>
              <button
                onClick={handleCloseGradingModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Test Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900">
                {gradingTest.title}
              </h3>
              <p className="text-sm text-gray-600">
                Mã test: {gradingTest.code}
              </p>
            </div>

            {/* Grading Form */}
            <div className="space-y-4">
              {/* Score Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm số (0-10)
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập điểm từ 0 đến 10"
                />
              </div>

              {/* Reason Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhận xét
                </label>
                <textarea
                  value={gradingForm.reason}
                  onChange={(e) =>
                    handleGradingFormChange("reason", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  placeholder="Nhập nhận xét về bài làm của sinh viên..."
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
                  gradingForm.score > 10
                }
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-white to-blue-50 rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Chấm Điểm Bài Test
                </h1>
                <p className="text-gray-600 mt-1">
                  Danh sách bài test cần chấm điểm
                </p>
              </div>
              <button
                onClick={fetchGradingTests}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Clock className="w-4 h-4 mr-2" />
                Làm mới
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Tổng: {tests.length} bài test | Hiển thị: {totalItems} kết quả
            </div>

            {/* Search and Filter Section */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên test..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                  <FileText className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chưa chấm</option>
                  <option value="graded">Đã chấm</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || statusFilter !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Loading state */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Đang tải...</span>
              </div>
            ) : error ? (
              /* Error state */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchGradingTests}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Thử lại
                </button>
              </div>
            ) : totalItems === 0 ? (
              /* Empty state - no results after filtering */
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">
                  {searchTerm || statusFilter !== "all"
                    ? "Không tìm thấy test nào phù hợp"
                    : "Không có bài test nào cần chấm"}
                </p>
                <p className="text-sm text-gray-400">
                  {searchTerm || statusFilter !== "all"
                    ? "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"
                    : "Tất cả bài test đã được chấm điểm hoặc chưa được phân công"}
                </p>
              </div>
            ) : (
              /* Tests list */
              <div className="space-y-4">
                {paginatedTests.map((test) => (
                  <div
                    key={test.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {test.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Mã test: {test.code}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              Trạng thái chấm:
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                test.lecturersTestsDetailResponse?.some(
                                  (lecturer) => lecturer.isGrading
                                )
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {test.lecturersTestsDetailResponse?.some(
                                (lecturer) => lecturer.isGrading
                              ) ? (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Chưa chấm
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Đã chấm
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div
                          className={`text-3xl font-bold mb-2 ${getScoreColor(
                            test.testsScores || 0
                          )}`}
                        >
                          {test.testsScores || "0"}
                        </div>
                        <p className="text-xs text-gray-500 mb-4">
                          Điểm hiện tại
                        </p>

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2 mb-2">
                            {/* Dropdown Button for Grading */}
                            <div className="relative">
                              <button
                                onClick={(e) =>
                                  handleToggleDropdown(test.id, e)
                                }
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Chấm điểm
                                <ChevronDown className="w-4 h-4 ml-2" />
                              </button>

                              {/* Dropdown Menu */}
                              {openDropdown === test.id && (
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                  <button
                                    onClick={() => handleManualGrading(test)}
                                    className="w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100"
                                  >
                                    <User className="w-4 h-4 mr-3 text-blue-600" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        Chấm thủ công
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Chấm điểm bằng tay
                                      </div>
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => handleAIGrading(test)}
                                    className="w-full flex items-center px-4 py-3 text-left hover:bg-green-50 transition-colors duration-200"
                                  >
                                    <Bot className="w-4 h-4 mr-3 text-green-600" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        AI hỗ trợ chấm
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Chấm điểm tự động
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                handleDownloadTest(test.link, test.title)
                              }
                              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                test.link
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                              disabled={!test.link}
                              title={
                                test.link
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
    </>
  );
};

export default LecturerGradingTest;
