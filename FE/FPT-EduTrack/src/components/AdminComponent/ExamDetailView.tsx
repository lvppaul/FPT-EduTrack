import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  Edit,
  RefreshCw,
} from "lucide-react";
import type { Exam, Test } from "../../types/examType";
import { ExamStatus } from "../../enum/examStatus";
import TestCard from "./TestCard";
import TestDetailView from "./TestDetailView";
import Pagination from "../Pagination";
import UploadTestModal from "./UploadTestModal";
import { upLoadTest } from "../../service/testService";
import { updateExamStatus } from "../../service/examService";
interface ExamDetailViewProps {
  exam: Exam;
  onBack: () => void;
  onRefreshExam?: () => void;
}

const ExamDetailView: React.FC<ExamDetailViewProps> = ({
  exam,
  onBack,
  onRefreshExam,
}) => {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showTestDetail, setShowTestDetail] = useState(false);

  // Upload modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Status modal states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Pagination states for tests
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Update selectedTest when exam data changes
  useEffect(() => {
    if (selectedTest && exam.test) {
      const updatedTest = exam.test.find((test) => test.id === selectedTest.id);
      if (
        updatedTest &&
        JSON.stringify(updatedTest) !== JSON.stringify(selectedTest)
      ) {
        setSelectedTest(updatedTest);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exam.test]);

  // Status options
  const statusOptions = [
    {
      value: "InProgress",
      label: "Đang diễn ra",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "Completed",
      label: "Đã hoàn thành",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "Grading",
      label: "Đang chấm điểm",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "ResultsPublished",
      label: "Kết quả đã công bố",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "UnderReview",
      label: "Đang xem xét",
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: "Postponed",
      label: "Đã hoãn",
      color: "bg-gray-100 text-gray-800",
    },
    { value: "Cancelled", label: "Đã hủy", color: "bg-red-100 text-red-800" },
  ];

  // Map status string to number for API
  const getStatusNumber = (status: string): number => {
    const statusMap: { [key: string]: number } = {
      InProgress: 0,
      Completed: 1,
      Grading: 2,
      ResultsPublished: 3,
      UnderReview: 4,
      Postponed: 5,
      Cancelled: 6,
    };
    return statusMap[status] || 0;
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const statusNumber = getStatusNumber(newStatus);
      await updateExamStatus(exam.id, statusNumber);

      setNotification({
        type: "success",
        message: "Cập nhật trạng thái thành công!",
      });

      // Refresh exam data
      if (onRefreshExam) {
        onRefreshExam();
      }

      // Close modal
      setShowStatusModal(false);

      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewTest = (test: Test) => {
    setSelectedTest(test);
    setShowTestDetail(true);
  };

  const handleBackFromTestDetail = () => {
    setShowTestDetail(false);
    setSelectedTest(null);
  };

  // Handle refresh test data when assign lecturer or other actions
  const handleRefreshTestData = () => {
    if (onRefreshExam) {
      onRefreshExam();
    }
  };

  // Pagination logic for tests
  const tests = exam.test || [];
  const totalItems = tests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTests = tests.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Upload handlers
  const handleUploadTest = async (formData: FormData) => {
    setIsUploading(true);
    try {
      await upLoadTest(exam.id, formData);

      // Simulate API call - Remove this when using real API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setNotification({
        type: "success",
        message: "Upload test thành công!",
      });

      // Refresh exam data after successful upload
      if (onRefreshExam) {
        onRefreshExam();
      }

      // Auto hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error uploading test:", error);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi upload test. Vui lòng thử lại.",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  // Show test detail view if a test is selected
  if (showTestDetail && selectedTest) {
    return (
      <TestDetailView
        test={selectedTest}
        onBack={handleBackFromTestDetail}
        onRefreshTest={handleRefreshTestData}
      />
    );
  }
  const getStatusText = (status: string) => {
    switch (status) {
      case ExamStatus.InProgress:
        return "Đang diễn ra";
      case ExamStatus.Completed:
        return "Đã hoàn thành";
      case ExamStatus.Grading:
        return "Đang chấm điểm";
      case ExamStatus.ResultsPublished:
        return "Kết quả đã công bố";
      case ExamStatus.UnderReview:
        return "Đang xem xét";
      case ExamStatus.Postponed:
        return "Đã hoãn";
      case ExamStatus.Cancelled:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách kỳ thi</span>
        </button>

        {/* Exam Detail Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{exam.name}</h1>
          <p className="text-gray-600 mb-4">Mã kỳ thi: {exam.code}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium text-gray-800">Ngày tạo:</span>
              <span>{formatDate(exam.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-medium text-gray-800">Thời gian:</span>
              <span>
                {exam.duration ? `${exam.duration} phút` : "Chưa xác định"}
              </span>
            </div>

            <div className="flex justify-end items-center">
              <button
                onClick={() => setShowStatusModal(true)}
                disabled={isUpdatingStatus}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Edit className="w-4 h-4 mr-2" />
                {isUpdatingStatus ? "Đang cập nhật..." : "Cập nhật trạng thái"}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-800">Trạng thái:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                exam.status === "InProgress"
                  ? "bg-blue-100 text-blue-800"
                  : exam.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : exam.status === "Grading"
                  ? "bg-yellow-100 text-yellow-800"
                  : exam.status === "ResultsPublished"
                  ? "bg-purple-100 text-purple-800"
                  : exam.status === "UnderReview"
                  ? "bg-orange-100 text-orange-800"
                  : exam.status === "Postponed"
                  ? "bg-gray-100 text-gray-800"
                  : exam.status === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {getStatusText(exam.status)}
            </span>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-4 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Danh Sách Bài Test
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Tổng: {exam.test?.length || 0} bài test
              </p>
            </div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Test
            </button>
          </div>
        </div>

        <div className="p-4">
          {!exam.test || exam.test.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Không có bài test nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedTests.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  onViewTest={handleViewTest}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination for tests */}
        {tests.length > 0 && (
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

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cập nhật trạng thái kỳ thi
                </h3>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isUpdatingStatus}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Kỳ thi: <span className="font-medium">{exam.name}</span>
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => handleStatusUpdate(status.value)}
                    disabled={isUpdatingStatus || exam.status === status.value}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                      exam.status === status.value
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
                            status.value === "InProgress"
                              ? "bg-blue-500"
                              : status.value === "Completed"
                              ? "bg-green-500"
                              : status.value === "Grading"
                              ? "bg-yellow-500"
                              : status.value === "ResultsPublished"
                              ? "bg-purple-500"
                              : status.value === "UnderReview"
                              ? "bg-orange-500"
                              : status.value === "Postponed"
                              ? "bg-gray-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {status.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {status.value}
                          </p>
                        </div>
                      </div>
                      {exam.status === status.value && (
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
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdatingStatus}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Test Modal */}
      <UploadTestModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadTest}
        examId={exam.id}
        isLoading={isUploading}
      />
    </div>
  );
};

export default ExamDetailView;
