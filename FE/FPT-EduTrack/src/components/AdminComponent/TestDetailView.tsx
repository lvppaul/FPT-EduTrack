import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import type { Test } from "../../types/examType";
import Pagination from "../Pagination";

interface TestDetailViewProps {
  test: Test;
  onBack: () => void;
}

const TestDetailView: React.FC<TestDetailViewProps> = ({ test, onBack }) => {
  // Pagination states for lecturers grading
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
              <p className="text-gray-600 mb-4">Mã test: {test.code}</p>
            </div>
            <div className="text-right">
              <div
                className={`text-3xl font-bold ${getScoreColor(
                  test.testsScores || 0
                )}`}
              >
                {test.testsScores || "N/A"}
              </div>
              <p className="text-sm text-gray-500">Điểm số</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
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
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">Student ID:</span>
              <span className="text-gray-600">#{test.studentId}</span>
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
          <h2 className="text-lg font-bold text-gray-900">
            Chi Tiết Chấm Điểm
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {test.lecturersTestsDetailResponse?.length || 0} giảng viên đã chấm
            điểm
          </p>
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
    </div>
  );
};

export default TestDetailView;
