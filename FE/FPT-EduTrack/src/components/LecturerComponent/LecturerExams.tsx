import React, { useState } from "react";
import { Eye, Edit, ArrowLeft } from "lucide-react";

interface ExamPeriod {
  id: string;
  name: string;
  code: string;
  semester: string;
  year: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "completed";
  totalExams: number;
  gradedExams: number;
  pendingExams: number;
  subjects: string[];
  description: string;
}

interface ExamToGrade {
  id: string;
  title: string;
  subject: string;
  studentName: string;
  studentId: string;
  submittedDate: string;
  duration: number;
  maxScore: number;
  currentScore?: number;
  status: "pending" | "graded" | "needs-review";
  examType: "midterm" | "final" | "quiz";
  answers: number;
  totalQuestions: number;
  examPeriodId: string;
}

const LecturerExams: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<ExamPeriod | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "graded">("all");

  const examPeriods: ExamPeriod[] = [
    {
      id: "1",
      name: "Kỳ thi giữa kỳ - Fall 2024",
      code: "MIDTERM_FA24",
      semester: "Fall",
      year: "2024",
      startDate: "2024-10-15",
      endDate: "2024-10-25",
      status: "completed",
      totalExams: 45,
      gradedExams: 42,
      pendingExams: 3,
      subjects: ["SWD392", "DBI202", "PRN221"],
      description: "Kỳ thi giữa kỳ học kỳ Fall 2024 cho các môn chuyên ngành",
    },
    {
      id: "2",
      name: "Kỳ thi cuối kỳ - Fall 2024",
      code: "FINAL_FA24",
      semester: "Fall",
      year: "2024",
      startDate: "2024-12-20",
      endDate: "2024-12-30",
      status: "ongoing",
      totalExams: 67,
      gradedExams: 25,
      pendingExams: 42,
      subjects: ["SWD392", "DBI202", "PRN221", "SWP391"],
      description: "Kỳ thi cuối kỳ học kỳ Fall 2024 cho tất cả các môn",
    },
    {
      id: "3",
      name: "Kỳ thi giữa kỳ - Spring 2025",
      code: "MIDTERM_SP25",
      semester: "Spring",
      year: "2025",
      startDate: "2025-03-10",
      endDate: "2025-03-20",
      status: "upcoming",
      totalExams: 52,
      gradedExams: 0,
      pendingExams: 0,
      subjects: ["SWD392", "DBI202", "PRN221", "SWP391", "LAB211"],
      description: "Kỳ thi giữa kỳ học kỳ Spring 2025",
    },
  ];

  const examsToGrade: ExamToGrade[] = [
    {
      id: "1",
      title: "Kiểm tra giữa kỳ - Phát triển phần mềm",
      subject: "SWD392",
      studentName: "Nguyễn Văn A",
      studentId: "SE170001",
      submittedDate: "2025-07-11",
      duration: 90,
      maxScore: 100,
      status: "pending",
      examType: "midterm",
      answers: 25,
      totalQuestions: 25,
      examPeriodId: "2",
    },
    {
      id: "2",
      title: "Bài kiểm tra Database Design",
      subject: "DBI202",
      studentName: "Trần Thị B",
      studentId: "SE170002",
      submittedDate: "2025-07-10",
      duration: 60,
      maxScore: 100,
      currentScore: 85,
      status: "graded",
      examType: "quiz",
      answers: 20,
      totalQuestions: 20,
      examPeriodId: "2",
    },
    {
      id: "3",
      title: "Quiz - Mobile Development",
      subject: "MMA301",
      studentName: "Lê Văn C",
      studentId: "SE170003",
      submittedDate: "2025-07-11",
      duration: 45,
      maxScore: 50,
      status: "pending",
      examType: "quiz",
      answers: 15,
      totalQuestions: 15,
      examPeriodId: "2",
    },
    {
      id: "4",
      title: "Thi cuối kỳ - Web Programming",
      subject: "PRN231",
      studentName: "Phạm Thị D",
      studentId: "SE170004",
      submittedDate: "2025-07-12",
      duration: 120,
      maxScore: 100,
      currentScore: 78,
      status: "graded",
      examType: "final",
      answers: 30,
      totalQuestions: 30,
      examPeriodId: "1",
    },
    {
      id: "5",
      title: "Quiz - React Development",
      subject: "SWD392",
      studentName: "Hoàng Văn E",
      studentId: "SE170005",
      submittedDate: "2025-07-13",
      duration: 60,
      maxScore: 100,
      status: "pending",
      examType: "quiz",
      answers: 20,
      totalQuestions: 20,
      examPeriodId: "2",
    },
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ chấm";
      case "graded":
        return "Đã chấm";
      case "needs-review":
        return "Cần xem lại";
      case "upcoming":
        return "Sắp tới";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã hoàn thành";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Filter exams for selected period
  const filteredExams = selectedPeriod
    ? examsToGrade.filter((exam) => {
        if (exam.examPeriodId !== selectedPeriod.id) return false;
        if (filter === "all") return true;
        return exam.status === filter;
      })
    : [];

  if (selectedPeriod) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedPeriod(null)}
            className="mb-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Quay lại danh sách kỳ thi</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {selectedPeriod.name}
            </h1>
            <p className="text-gray-600 mb-4">{selectedPeriod.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">Thời gian:</span>
                <span>
                  {formatDate(selectedPeriod.startDate)} -{" "}
                  {formatDate(selectedPeriod.endDate)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">Trạng thái:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {getStatusText(selectedPeriod.status)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800">Môn học:</span>
                <span>{selectedPeriod.subjects.join(", ")}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
                <p className="text-sm font-medium text-blue-600 mb-1">
                  Tổng bài thi
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {selectedPeriod.totalExams}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
                <p className="text-sm font-medium text-green-600 mb-1">
                  Đã chấm
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {selectedPeriod.gradedExams}
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 text-center border border-orange-200">
                <p className="text-sm font-medium text-orange-600 mb-1">
                  Chờ chấm
                </p>
                <p className="text-2xl font-bold text-orange-700">
                  {selectedPeriod.pendingExams}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 p-4 bg-gray-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Danh Sách Bài Thi
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Lọc:</span>
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as "all" | "pending" | "graded")
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="all">Tất cả</option>
                  <option value="pending">Chờ chấm</option>
                  <option value="graded">Đã chấm</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4">
            {filteredExams.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Không có bài thi nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {exam.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">
                              Sinh viên
                            </span>
                            <span className="text-gray-600">
                              {exam.studentName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {exam.studentId}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-700">
                              Môn học
                            </span>
                            <span className="text-gray-600">
                              {exam.subject}
                            </span>
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
                              Điểm số
                            </span>
                            <span className="text-gray-600">
                              {exam.currentScore !== undefined
                                ? `${exam.currentScore}/${exam.maxScore}`
                                : `--/${exam.maxScore}`}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                              exam.status === "pending"
                                ? "bg-orange-100 text-orange-800"
                                : exam.status === "graded"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {getStatusText(exam.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        {exam.status === "pending" && (
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Danh Sách Kỳ Thi
          </h1>
          <p className="text-gray-600">Quản lý và chấm điểm các kỳ thi</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {examPeriods.map((period) => (
              <div
                key={period.id}
                className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-200"
                onClick={() => setSelectedPeriod(period)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {period.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {period.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Mã:</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-gray-800">
                          {period.code}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">
                          Thời gian:
                        </span>
                        <span className="text-gray-600">
                          {formatDate(period.startDate)} -{" "}
                          {formatDate(period.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">
                          Trạng thái:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            period.status === "upcoming"
                              ? "bg-blue-100 text-blue-800"
                              : period.status === "ongoing"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getStatusText(period.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">
                          Môn học:
                        </span>
                        <span className="text-gray-600">
                          {period.subjects.join(", ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-600">
                          Tổng:{" "}
                          <span className="font-semibold">
                            {period.totalExams}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="text-gray-600">
                          Đã chấm:{" "}
                          <span className="font-semibold">
                            {period.gradedExams}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span className="text-gray-600">
                          Chờ chấm:{" "}
                          <span className="font-semibold">
                            {period.pendingExams}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-6">
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Xem chi tiết
                      <Eye className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerExams;
