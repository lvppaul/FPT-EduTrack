import React, { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import type { ExamResponse, Exam } from "../../types/examType";
import { getExams } from "../../service/examService";
import { ExamStatus } from "../../enum/examStatus";
import ExamDetailView from "./ExamDetailView";
import Pagination from "../Pagination";
const ExamManagement: React.FC = () => {
  const [examsResponse, setExamsResponse] = useState<ExamResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchExams = async () => {
    try {
      const response = await getExams();
      setExamsResponse(response);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

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

  const filteredExams =
    examsResponse?.data.filter((exam) => {
      const matchesSearch =
        exam.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.id.toString().includes(searchTerm);
      const matchesStatus =
        statusFilter === "Tất cả" || exam.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  // Pagination logic
  const totalItems = filteredExams.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExams = filteredExams.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Tạo kỳ thi mới
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm kỳ thi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="0">Đang diễn ra</option>
                <option value="1">Đã hoàn thành</option>
                <option value="2">Đang chấm điểm</option>
                <option value="3">Kết quả đã công bố</option>
                <option value="4">Đang xem xét</option>
                <option value="5">Đã hoãn</option>
                <option value="6">Đã hủy</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredExams.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Không có kỳ thi nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paginatedExams.map((exam) => (
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
        {filteredExams.length > 0 && (
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

export default ExamManagement;
