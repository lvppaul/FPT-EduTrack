import React, { useEffect, useState, useCallback } from "react";
import {
  Edit,
  Trash2,
  Eye,
  Plus,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import type {
  ExamResponse,
  Exam,
  ExamCreateRequest,
} from "../../types/examType";
import { getExams } from "../../service/examService";
import { ExamStatus } from "../../enum/examStatus";
import ExamDetailView from "./ExamDetailView";
import CreateExamModal from "./CreateExamModal";
import Pagination from "../Pagination";

const ExamManagement: React.FC = () => {
  const [examsResponse, setExamsResponse] = useState<ExamResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Pagination states - server-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchExams = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getExams(currentPage, itemsPerPage);
      setExamsResponse(response);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

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

  const handleViewExam = (exam: Exam) => {
    setSelectedExam(exam);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedExam(null);
  };

  // Modal handlers
  const handleCreateExam = async (examData: ExamCreateRequest) => {
    try {
      setIsCreating(true);
      // TODO: Replace with actual API call
      console.log("Creating exam:", examData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success notification
      setNotification({
        type: "success",
        message: "Kỳ thi đã được tạo thành công!",
      });

      // Close modal and refresh data
      setIsCreateModalOpen(false);
      fetchExams();

      // Auto hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Failed to create exam:", error);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi tạo kỳ thi. Vui lòng thử lại.",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  // Server-side pagination - no client-side filtering needed
  const allExams = examsResponse?.data || [];

  // For server-side pagination, get total from API response
  const totalItems = examsResponse?.count || allExams.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Display all exams from current page
  const displayExams = allExams;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Exam Detail View
  if (showDetail && selectedExam) {
    return <ExamDetailView exam={selectedExam} onBack={handleBackToList} />;
  }

  // Main List View
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-white to-indigo-50 rounded-t-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản Lý Kỳ Thi
              </h1>
              <p className="text-gray-600 mt-1">
                Tổng: {examsResponse?.count || 0} kỳ thi
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo kỳ thi mới
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
            </div>
          ) : allExams.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Không có kỳ thi nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayExams.map((exam: Exam) => (
                <div
                  key={exam.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {exam.code}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            Mã kỳ thi
                          </span>
                          <span className="text-gray-600">{exam.code}</span>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            Thời gian
                          </span>
                          <span className="text-gray-600">
                            {exam.duration} phút
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">
                            Trạng thái
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium w-fit ${
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
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleViewExam(exam)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalItems > 0 && (
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

      {/* Create Exam Modal */}
      <CreateExamModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateExam}
        isLoading={isCreating}
      />
    </div>
  );
};

export default ExamManagement;
