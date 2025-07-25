import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  BookOpen,
  Filter,
  Plus,
  X,
} from "lucide-react";

import type { Test } from "../../types/examType";
import { getTestsByStudentId } from "../../service/testService";
import { useAuth } from "../../context/AuthContext";
import Pagination from "../Pagination";
import { createReport } from "../../service/reportService";

const StudentTest: React.FC = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [reportFilter, setReportFilter] = useState<
    "all" | "has-report" | "no-report"
  >("all");

  // Appeal modal states
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [isCreatingAppeal, setIsCreatingAppeal] = useState(false);
  const [appealForm, setAppealForm] = useState({
    title: "",
    content: "",
  });
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Fetch tests data
  const fetchTests = useCallback(async () => {
    if (!user?.sub) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await getTestsByStudentId(parseInt(user.sub));

      if (response && response.data) {
        setTests(response.data);
      } else {
        setTests([]);
      }
    } catch (error) {
      console.error("Failed to fetch tests:", error);
      setError("Có lỗi xảy ra khi tải danh sách bài test");
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.sub]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // Filter tests based on search and report filter
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesReportFilter =
      reportFilter === "all" ||
      (reportFilter === "has-report" && test.hasReport) ||
      (reportFilter === "no-report" && !test.hasReport);

    return matchesSearch && matchesReportFilter;
  });

  // Pagination logic
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

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, reportFilter]);

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6.5) return "text-yellow-600";
    if (score >= 5) return "text-orange-600";
    return "text-red-600";
  };

  // Helper function to get score background color
  const getScoreBgColor = (score: number) => {
    if (score >= 8) return "bg-green-100";
    if (score >= 6.5) return "bg-yellow-100";
    if (score >= 5) return "bg-orange-100";
    return "bg-red-100";
  };

  // Handle appeal modal
  const handleCreateAppeal = (test: Test) => {
    setSelectedTest(test);
    setAppealForm({
      title: `Phúc khảo bài test: ${test.title}`,
      content: "",
    });
    setShowAppealModal(true);
  };

  const handleSubmitAppeal = async () => {
    if (!selectedTest || !user?.sub) return;

    if (!appealForm.title.trim() || !appealForm.content.trim()) {
      setNotification({
        type: "error",
        message: "Vui lòng điền đầy đủ thông tin",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      setIsCreatingAppeal(true);
      const result = await createReport({
        title: appealForm.title,
        content: appealForm.content,
        studentId: parseInt(user.sub),
        testId: selectedTest.id,
      });

      console.log("Create report result:", result);

      setNotification({
        type: "success",
        message: "Tạo đơn phúc khảo thành công!",
      });

      // Close modal and reset form
      setShowAppealModal(false);
      setSelectedTest(null);
      setAppealForm({ title: "", content: "" });

      // Refresh tests to update report status
      fetchTests();

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error creating appeal:", error);

      // Get more detailed error message
      let errorMessage =
        "Có lỗi xảy ra khi tạo đơn phúc khảo. Vui lòng thử lại.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setNotification({
        type: "error",
        message: errorMessage,
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsCreatingAppeal(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-white to-blue-50 rounded-t-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bài Test Của Tôi
              </h1>
              <p className="text-gray-600 mt-1">
                Hiển thị {Math.min(filteredTests.length, itemsPerPage)} trong{" "}
                {filteredTests.length} bài test
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchTests}
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
                placeholder="Tìm kiếm theo tên hoặc mã test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Báo cáo:</span>
              <select
                value={reportFilter}
                onChange={(e) =>
                  setReportFilter(
                    e.target.value as "all" | "has-report" | "no-report"
                  )
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả</option>
                <option value="has-report">Có báo cáo</option>
                <option value="no-report">Không có báo cáo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {error && (
          <div className="p-6 text-center">
            <div className="text-red-600 mb-4 flex items-center justify-center">
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
            <button
              onClick={fetchTests}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Thử lại
            </button>
          </div>
        )}

        {isLoading && (
          <div className="p-6 text-center">
            <div className="inline-flex items-center">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              <span>Đang tải danh sách bài test...</span>
            </div>
          </div>
        )}

        {/* Tests Grid */}
        {!isLoading && !error && (
          <div className="p-6">
            {paginatedTests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || reportFilter !== "all"
                    ? "Không tìm thấy bài test nào"
                    : "Chưa có bài test nào"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || reportFilter !== "all"
                    ? "Thử điều chỉnh bộ lọc tìm kiếm"
                    : "Bài test sẽ xuất hiện khi được giao cho bạn"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedTests.map((test) => (
                  <div
                    key={test.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {test.title}
                          </h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500">
                              Mã test: {test.code}
                            </p>

                            {/* Report Count */}
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                Số đơn phúc khảo:
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {test.lecturersTestsDetailResponse?.length || 0}
                                /2
                              </span>
                            </div>

                            {/* Report Status */}
                            {test.hasReport ? (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Có báo cáo
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 flex items-center">
                                <XCircle className="w-3 h-3 mr-1" />
                                Chưa có báo cáo
                              </span>
                            )}

                            {/* Average Score */}
                            {test.testsScores > 0 && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">
                                  Điểm:
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(
                                    test.testsScores
                                  )} ${getScoreColor(test.testsScores)}`}
                                >
                                  {test.testsScores}/10
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button - Right Side */}
                      <div className="flex space-x-2">
                        {/* Only show create report button if report count is less than 2 */}
                        {(test.lecturersTestsDetailResponse?.length || 0) <
                          2 && (
                          <button
                            onClick={() => handleCreateAppeal(test)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors duration-200 flex items-center space-x-1"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Tạo đơn phúc khảo</span>
                          </button>
                        )}

                        {/* Show message when max reports reached */}
                        {(test.lecturersTestsDetailResponse?.length || 0) >=
                          2 && (
                          <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Đã đạt giới hạn phúc khảo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && filteredTests.length > 0 && (
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

      {/* Appeal Modal */}
      {showAppealModal && selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tạo đơn phúc khảo
                </h3>
                <button
                  onClick={() => {
                    setShowAppealModal(false);
                    setSelectedTest(null);
                    setAppealForm({ title: "", content: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isCreatingAppeal}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Bài test:{" "}
                <span className="font-medium">{selectedTest.title}</span>
              </p>
              <p className="text-sm text-gray-600">
                Mã test:{" "}
                <span className="font-medium">{selectedTest.code}</span>
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề đơn phúc khảo{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={appealForm.title}
                    onChange={(e) =>
                      setAppealForm({ ...appealForm, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tiêu đề đơn phúc khảo"
                    disabled={isCreatingAppeal}
                  />
                </div>

                {/* Content Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung phúc khảo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={appealForm.content}
                    onChange={(e) =>
                      setAppealForm({ ...appealForm, content: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập lý do và nội dung phúc khảo..."
                    disabled={isCreatingAppeal}
                  />
                </div>
              </div>

              {isCreatingAppeal && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                    <span className="text-sm text-blue-800">
                      Đang tạo đơn phúc khảo...
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAppealModal(false);
                    setSelectedTest(null);
                    setAppealForm({ title: "", content: "" });
                  }}
                  disabled={isCreatingAppeal}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitAppeal}
                  disabled={
                    isCreatingAppeal ||
                    !appealForm.title.trim() ||
                    !appealForm.content.trim()
                  }
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingAppeal ? "Đang tạo..." : "Tạo đơn phúc khảo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <XCircle className="w-5 h-5 mr-3" />
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
    </div>
  );
};

export default StudentTest;
