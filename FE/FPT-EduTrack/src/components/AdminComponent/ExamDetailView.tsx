import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Upload,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import type { Exam, Test } from "../../types/examType";
import { ExamStatus } from "../../enum/examStatus";
import TestCard from "./TestCard";
import TestDetailView from "./TestDetailView";
import Pagination from "../Pagination";
import UploadTestModal from "./UploadTestModal";
import { upLoadTest } from "../../service/testService";
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

  // Pagination states for tests
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleViewTest = (test: Test) => {
    setSelectedTest(test);
    setShowTestDetail(true);
  };

  const handleBackFromTestDetail = () => {
    setShowTestDetail(false);
    setSelectedTest(null);
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
      console.log("Uploading test with exam id:", exam.id);
      console.log("Uploading test with formData:", formData);

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
      <TestDetailView test={selectedTest} onBack={handleBackFromTestDetail} />
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
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-800">Trạng thái:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                exam.status === "In-Process"
                  ? "bg-blue-100 text-blue-800"
                  : exam.status === "Completed"
                  ? "bg-green-100 text-green-800"
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
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
