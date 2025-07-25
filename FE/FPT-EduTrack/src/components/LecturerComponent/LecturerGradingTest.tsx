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
  Upload,
  File,
  Trash2,
  Loader,
} from "lucide-react";
import type { Test } from "../../types/examType";
import {
  getTestsByGradingLecturerId,
  updateTestScore,
} from "../../service/testService";
import { AuthUtils } from "../../utils/authUtils";
import TestDetailView from "../AdminComponent/TestDetailView";
import Pagination from "../Pagination";
import { gradingByUsingAi } from "../../service/gradingByUsingAiService";
import type {
  GradingFormPayload,
  GradingResponse,
} from "../../types/aiResponseType";
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

  // AI grading modal states
  const [showAIGradingModal, setShowAIGradingModal] = useState(false);
  const [aiGradingTest, setAiGradingTest] = useState<Test | null>(null);
  const [aiGradingForm, setAiGradingForm] = useState<GradingFormPayload>({
    guidelineFiles: [],
    testFiles: [],
    textInputValue: "",
  });
  const [isAIGrading, setIsAIGrading] = useState(false);
  const [aiGradingResult, setAiGradingResult] =
    useState<GradingResponse | null>(null);

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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "graded"
  >("all");

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
      showToastNotification("⚠️ Điểm số phải từ 0 đến 10", "warning");
      return;
    }

    if (!gradingForm.reason.trim()) {
      showToastNotification("⚠️ Vui lòng nhập nhận xét", "warning");
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
        showToastNotification(
          "🎉 Cập nhật điểm thành công! Điểm số đã được lưu vào hệ thống.",
          "success"
        );
        handleCloseGradingModal();
        fetchGradingTests(); // Refresh the list
      } else {
        showToastNotification(
          "❌ Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error submitting grading:", error);
      showToastNotification(
        "❌ Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIGrading = (test: Test) => {
    setAiGradingTest(test);
    setAiGradingForm({
      guidelineFiles: [],
      testFiles: [],
      textInputValue: "",
    });
    setAiGradingResult(null);
    setShowAIGradingModal(true);
    setOpenDropdown(null);
  };

  // Handle AI grading modal close
  const handleCloseAIGradingModal = () => {
    setShowAIGradingModal(false);
    setAiGradingTest(null);
    setAiGradingForm({
      guidelineFiles: [],
      testFiles: [],
      textInputValue: "",
    });
    setAiGradingResult(null);
  };

  // Handle file uploads for AI grading
  const handleFileUpload = (
    files: FileList | null,
    type: "guideline" | "test"
  ) => {
    if (!files) return;

    const fileArray = Array.from(files);
    setAiGradingForm((prev) => ({
      ...prev,
      [type === "guideline" ? "guidelineFiles" : "testFiles"]: [
        ...prev[type === "guideline" ? "guidelineFiles" : "testFiles"],
        ...fileArray,
      ],
    }));
  };

  // Remove file from upload list
  const handleRemoveFile = (index: number, type: "guideline" | "test") => {
    setAiGradingForm((prev) => ({
      ...prev,
      [type === "guideline" ? "guidelineFiles" : "testFiles"]: prev[
        type === "guideline" ? "guidelineFiles" : "testFiles"
      ].filter((_, i) => i !== index),
    }));
  };

  // Handle text input change
  const handleTextInputChange = (value: string) => {
    setAiGradingForm((prev) => ({
      ...prev,
      textInputValue: value,
    }));
  };

  // Submit AI grading
  const handleSubmitAIGrading = async () => {
    if (!aiGradingTest) return;

    // Validate form data
    if (aiGradingForm.guidelineFiles.length === 0) {
      showToastNotification(
        " Vui lòng upload ít nhất 1 file hướng dẫn",
        "warning"
      );
      return;
    }

    if (aiGradingForm.testFiles.length === 0) {
      showToastNotification(
        " Vui lòng upload ít nhất 1 file bài test",
        "warning"
      );
      return;
    }

    if (!aiGradingForm.textInputValue.trim()) {
      showToastNotification(
        " Vui lòng nhập mô tả hoặc yêu cầu chấm điểm",
        "warning"
      );
      return;
    }

    try {
      setIsAIGrading(true);

      const response = await gradingByUsingAi(aiGradingForm);

      if (response.success) {
        setAiGradingResult(response);
        showToastNotification(
          " AI đã hoàn thành việc chấm điểm! Kiểm tra kết quả bên dưới.",
          "success"
        );
      } else {
        showToastNotification(
          " AI không thể chấm điểm. Vui lòng thử lại.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error with AI grading:", error);
      showToastNotification(
        " Có lỗi xảy ra khi sử dụng AI chấm điểm. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setIsAIGrading(false);
    }
  };

  // Apply AI grading result to test
  const handleApplyAIResult = async () => {
    if (!aiGradingTest || !aiGradingResult) return;

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

      const gradingData = {
        testId: aiGradingTest.id,
        lecturerId: parseInt(userData.sub),
        score: aiGradingResult.grading.overallBand,
        reason: aiGradingResult.grading.justification,
        isGrading: false,
      };

      const response = await updateTestScore(gradingData);

      if (response) {
        showToastNotification(
          "🎉 Áp dụng kết quả AI thành công! Điểm số đã được lưu vào hệ thống.",
          "success"
        );
        handleCloseAIGradingModal();
        fetchGradingTests(); // Refresh the list
      } else {
        showToastNotification(
          "❌ Có lỗi xảy ra khi lưu điểm. Vui lòng thử lại.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error applying AI result:", error);
      showToastNotification(
        "❌ Có lỗi xảy ra khi lưu kết quả AI. Vui lòng thử lại.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
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
      showToastNotification("📁 Không có file để tải xuống", "warning");
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
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>

      {/* Manual Grading Modal */}
      {showGradingModal && gradingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Cập nhật Điểm Bài Test
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
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

      {/* AI Grading Modal */}
      {showAIGradingModal && aiGradingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    AI Hỗ Trợ Chấm Điểm
                  </h2>
                  <p className="text-sm text-gray-600">
                    {aiGradingTest.title} - {aiGradingTest.code}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseAIGradingModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isAIGrading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Upload Section */}
              <div className="space-y-6">
                {/* Guideline Files Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    File Hướng Dẫn Chấm Điểm
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) =>
                        handleFileUpload(e.target.files, "guideline")
                      }
                      className="hidden"
                      id="guideline-upload"
                      disabled={isAIGrading}
                    />
                    <label
                      htmlFor="guideline-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click để upload hoặc kéo thả file vào đây
                      </span>
                      <span className="text-xs text-gray-500">
                        PDF, DOC, DOCX, TXT
                      </span>
                    </label>
                  </div>

                  {/* Display uploaded guideline files */}
                  {aiGradingForm.guidelineFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {aiGradingForm.guidelineFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-purple-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-700">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index, "guideline")}
                            className="text-red-500 hover:text-red-700"
                            disabled={isAIGrading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Test Files Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    📄 File Bài Test Sinh Viên
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files, "test")}
                      className="hidden"
                      id="test-upload"
                      disabled={isAIGrading}
                    />
                    <label
                      htmlFor="test-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click để upload hoặc kéo thả file vào đây
                      </span>
                      <span className="text-xs text-gray-500">
                        PDF, DOC, DOCX, TXT, JPG, PNG
                      </span>
                    </label>
                  </div>

                  {/* Display uploaded test files */}
                  {aiGradingForm.testFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {aiGradingForm.testFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-blue-50 p-3 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <File className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveFile(index, "test")}
                            className="text-red-500 hover:text-red-700"
                            disabled={isAIGrading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mô Tả Yêu Cầu Chấm Điểm
                  </label>
                  <textarea
                    value={aiGradingForm.textInputValue}
                    onChange={(e) => handleTextInputChange(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                    rows={4}
                    placeholder="Nhập mô tả về tiêu chí chấm điểm, thang điểm, yêu cầu đặc biệt..."
                    disabled={isAIGrading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitAIGrading}
                  disabled={
                    isAIGrading ||
                    aiGradingForm.guidelineFiles.length === 0 ||
                    aiGradingForm.testFiles.length === 0 ||
                    !aiGradingForm.textInputValue.trim()
                  }
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isAIGrading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      AI Đang Chấm Điểm...
                    </>
                  ) : (
                    <>
                      <Bot className="w-5 h-5 mr-2" />
                      Bắt Đầu Chấm Điểm AI
                    </>
                  )}
                </button>
              </div>

              {/* Right Column - Results Section */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-purple-600" />
                    Kết Quả AI
                  </h3>

                  {isAIGrading ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-12">
                      <Loader className="w-12 h-12 text-purple-600 animate-spin" />
                      <p className="text-gray-600 text-center">
                        AI đang phân tích và chấm điểm...
                        <br />
                        <span className="text-sm text-gray-500">
                          Quá trình này có thể mất vài phút
                        </span>
                      </p>
                    </div>
                  ) : aiGradingResult ? (
                    <div className="space-y-4">
                      {/* Score Display */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="text-center">
                          <div
                            className={`text-4xl font-bold mb-2 ${getScoreColor(
                              aiGradingResult.grading.overallBand
                            )}`}
                          >
                            {aiGradingResult.grading.overallBand}
                          </div>
                          <p className="text-sm text-gray-600">
                            Điểm AI Đề Xuất
                          </p>
                        </div>
                      </div>

                      {/* Justification */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Nhận Xét AI:
                        </h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {aiGradingResult.grading.justification}
                        </p>
                      </div>

                      {/* Session Info */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Thông Tin Phiên:
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>ID: {aiGradingResult.grading.sessionId}</p>
                          <p>
                            Thời gian:{" "}
                            {new Date(
                              aiGradingResult.grading.timestamp
                            ).toLocaleString("vi-VN")}
                          </p>
                          <p>Nguồn: {aiGradingResult.grading.source}</p>
                        </div>
                      </div>

                      {/* Files Processed */}
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="font-medium text-gray-900 mb-2">
                          File Đã Xử Lý:
                        </h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            Hướng dẫn: {aiGradingResult.guidelineFilesProcessed}{" "}
                            file
                          </p>
                          <p>
                            Bài test: {aiGradingResult.testFilesProcessed} file
                          </p>
                        </div>
                      </div>

                      {/* Apply Result Button */}
                      <button
                        onClick={handleApplyAIResult}
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Đang Lưu...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Áp Dụng Kết Quả AI
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-12">
                      <Bot className="w-16 h-16 text-gray-300" />
                      <p className="text-gray-500 text-center">
                        Upload file và click "Bắt Đầu Chấm Điểm AI"
                        <br />
                        để xem kết quả
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCloseAIGradingModal}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                disabled={isAIGrading || isSubmitting}
              >
                {aiGradingResult ? "Đóng" : "Hủy"}
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
                  Chấm Điểm Bài Test
                </h1>
                <p className="text-gray-600 mt-1">
                  Danh sách bài test cần chấm điểm
                </p>
              </div>
              <button
                onClick={fetchGradingTests}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md"
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
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                  />
                  <FileText className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-48">
                <select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md"
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
                          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
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
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md"
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
                                    className="w-full flex items-center px-4 py-3 text-left hover:bg-green-50 transition-colors duration-200 border-b border-gray-100"
                                  >
                                    <User className="w-4 h-4 mr-3 text-green-600" />
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
            {/* Toast Icon */}
            <div className="flex-shrink-0">
              {toastType === "success" && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
              {toastType === "error" && (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              {toastType === "warning" && (
                <Clock className="w-5 h-5 text-yellow-600" />
              )}
            </div>

            {/* Toast Message */}
            <div className="flex-1">
              <p className="text-sm font-medium">{toastMessage}</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                if (toastTimeoutId) {
                  clearTimeout(toastTimeoutId);
                  setToastTimeoutId(null);
                }
                setShowToast(false);
              }}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LecturerGradingTest;
