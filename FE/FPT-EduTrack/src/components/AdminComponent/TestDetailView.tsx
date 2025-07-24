import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Star,
  Plus,
  X,
} from "lucide-react";
import type { Test } from "../../types/examType";
import Pagination from "../Pagination";
import type { User as UserType } from "../../types/userType";
import { getAllLecturers } from "../../service/userService";
import { assignLecturerToTest } from "../../service/testService";
interface TestDetailViewProps {
  test: Test;
  onBack: () => void;
  onRefreshTest?: () => void;
}

const TestDetailView: React.FC<TestDetailViewProps> = ({
  test,
  onBack,
  onRefreshTest,
}) => {
  // Pagination states for lecturers grading
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [lecturers, setLecturers] = useState<UserType[]>([]);

  // Assign lecturer modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignForm, setAssignForm] = useState({
    lecturerId: "",
    score: 0,
    reason: "",
    isGrading: true,
  });
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchLecturers = async () => {
    try {
      const response = await getAllLecturers();
      setLecturers(response.data);
    } catch (error) {
      console.error("Failed to fetch lecturers:", error);
    }
  };
  useEffect(() => {
    fetchLecturers();
  }, []);

  // Handle assign form input changes
  const handleAssignFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setAssignForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle assign lecturer
  const handleAssignLecturer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignForm.lecturerId) {
      setNotification({
        type: "error",
        message: "Vui lòng chọn giảng viên",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setIsAssigning(true);
    try {
      const assignData = {
        testId: test.id,
        lecturerId: parseInt(assignForm.lecturerId),
        score: assignForm.score,
        reason: assignForm.reason,
        isGrading: assignForm.isGrading,
      };

      await assignLecturerToTest(assignData);

      setNotification({
        type: "success",
        message: "Phân công giảng viên thành công!",
      });

      // Reset form and close modal
      setAssignForm({
        lecturerId: "",
        score: 0,
        reason: "",
        isGrading: true,
      });
      setIsAssignModalOpen(false);

      // Refresh test data after successful assignment
      if (onRefreshTest) {
        onRefreshTest();
      }

      // Auto hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Error assigning lecturer:", error);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi phân công giảng viên. Vui lòng thử lại.",
      });
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsAssigning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    if (score >= 4) return "text-orange-600";
    return "text-red-600";
  };

  // Pagination logic for lecturers grading
  const lecturersGrading = test.lecturersTestsDetailResponse || [];
  const totalItems = lecturersGrading.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLecturers = lecturersGrading.slice(
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span> Quay lại danh sách test</span>
        </button>

        {/* Test Detail Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {test.title}
              </h1>
              <p className="text-gray-600 mb-4">ID: {test.id}</p>
              <p className="text-gray-600 mb-4">Mã test: {test.code}</p>
            </div>
            <div className="text-right">
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  test.testsScores || 0
                )}`}
              >
                {test.testsScores || "0"}
              </div>
              <p className="text-sm text-gray-500">Điểm số</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">Mã sinh viên:</span>
              <span className="text-gray-600">{test.studentId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Sinh viên:</span>
              <span className="text-gray-600">{test.studentName}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-700">
                Trạng thái báo cáo:
              </span>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  test.hasReport
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {test.hasReport ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Có báo cáo
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" />
                    Không có báo cáo
                  </>
                )}
              </span>
            </div>
          </div>

          {test.content && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Nội dung test:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {test.content}
              </p>
            </div>
          )}

          {test.link && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">Link bài test:</h3>
              <a
                href={test.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {test.link}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Lecturers Grading Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-4 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Chi Tiết Chấm Điểm
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {test.lecturersTestsDetailResponse?.length || 0} giảng viên đã
                chấm điểm
              </p>
            </div>
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Assign Lecturer
            </button>
          </div>
        </div>

        <div className="p-4">
          {!test.lecturersTestsDetailResponse ||
          test.lecturersTestsDetailResponse.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Chưa có giảng viên nào chấm điểm</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedLecturers.map((grading, index) => (
                <div
                  key={`${grading.lecturerId}-${index}`}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {grading.lecturer.fullname}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {grading.lecturer.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Vai trò:
                          </span>
                          <span className="ml-2 text-gray-600">
                            {grading.lecturer.roleName}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Trạng thái chấm:
                          </span>
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              grading.isGrading
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {grading.isGrading ? "Đang chấm" : "Đã hoàn thành"}
                          </span>
                        </div>
                      </div>

                      {grading.reason && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium text-gray-700 text-sm">
                            Nhận xét:
                          </span>
                          <p className="text-gray-600 text-sm mt-1">
                            {grading.reason}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-4">
                      <div
                        className={`text-2xl font-bold ${getScoreColor(
                          grading.score
                        )}`}
                      >
                        {grading.score}
                      </div>
                      <p className="text-xs text-gray-500">Điểm</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination for lecturers grading */}
        {lecturersGrading.length > 0 && (
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

      {/* Assign Lecturer Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Assign Lecturer
              </h2>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                disabled={isAssigning}
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAssignLecturer} className="p-6 space-y-4">
              {/* Lecturer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giảng viên <span className="text-red-500">*</span>
                </label>
                <select
                  name="lecturerId"
                  value={assignForm.lecturerId}
                  onChange={handleAssignFormChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn giảng viên</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.email} - {lecturer.fullname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm số
                </label>
                <input
                  type="number"
                  name="score"
                  value={assignForm.score}
                  onChange={handleAssignFormChange}
                  min="0"
                  max="10"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.0"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do / Nhận xét
                </label>
                <textarea
                  name="reason"
                  value={assignForm.reason}
                  onChange={handleAssignFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập lý do hoặc nhận xét (tùy chọn)"
                />
              </div>

              {/* Is Grading */}
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isGrading"
                    checked={assignForm.isGrading}
                    onChange={handleAssignFormChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Đang trong quá trình chấm điểm
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  disabled={isAssigning}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isAssigning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Assign</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestDetailView;
