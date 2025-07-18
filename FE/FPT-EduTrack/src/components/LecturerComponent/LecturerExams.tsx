import React, { useState } from "react";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  User,
  BookOpen,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import { getTestsByExamIdAndStudentId } from "../../service/testService";
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
    {
      id: "6",
      title: "Kiểm tra thực hành - Java Programming",
      subject: "PRN211",
      studentName: "Nguyễn Thị F",
      studentId: "SE170006",
      submittedDate: "2025-07-14",
      duration: 90,
      maxScore: 100,
      currentScore: 92,
      status: "graded",
      examType: "midterm",
      answers: 25,
      totalQuestions: 25,
      examPeriodId: "1",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "graded":
        return "text-green-600 bg-green-50 border-green-200";
      case "needs-review":
        return "text-red-600 bg-red-50 border-red-200";
      case "upcoming":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "ongoing":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "completed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "graded":
        return <CheckCircle className="w-4 h-4" />;
      case "needs-review":
        return <XCircle className="w-4 h-4" />;
      case "upcoming":
        return <Clock className="w-4 h-4" />;
      case "ongoing":
        return <BarChart3 className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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

  // Chi tiết kỳ thi view
  if (selectedPeriod) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedPeriod(null)}
            className="mb-4 flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách kỳ thi</span>
          </button>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedPeriod.name}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(selectedPeriod.startDate)} -{" "}
                      {formatDate(selectedPeriod.endDate)}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{selectedPeriod.subjects.length} môn học</span>
                  </span>
                </div>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  selectedPeriod.status
                )}`}
              >
                <div className="flex items-center space-x-1">
                  {getStatusIcon(selectedPeriod.status)}
                  <span>{getStatusText(selectedPeriod.status)}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{selectedPeriod.description}</p>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Tổng bài thi
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {selectedPeriod.totalExams}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Đã chấm
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {selectedPeriod.gradedExams}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-orange-600 font-medium">
                      Chờ chấm
                    </p>
                    <p className="text-2xl font-bold text-orange-700">
                      {selectedPeriod.pendingExams}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách bài thi */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Danh Sách Bài Thi
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Lọc:</span>
                  <select
                    value={filter}
                    onChange={(e) =>
                      setFilter(e.target.value as "all" | "pending" | "graded")
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả</option>
                    <option value="pending">Chờ chấm</option>
                    <option value="graded">Đã chấm</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredExams.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Không có bài thi nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {exam.title}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="font-medium">{exam.studentName}</p>
                              <p className="text-xs text-gray-500">
                                {exam.studentId}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Môn học:</span>
                            <p>{exam.subject}</p>
                          </div>
                          <div>
                            <span className="font-medium">Thời gian:</span>
                            <p>{exam.duration} phút</p>
                          </div>
                          <div>
                            <span className="font-medium">Điểm:</span>
                            <p>
                              {exam.currentScore !== undefined ? (
                                <span className="font-semibold text-green-600">
                                  {exam.currentScore}/{exam.maxScore}
                                </span>
                              ) : (
                                <span className="text-orange-600">
                                  Chưa chấm
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            exam.status
                          )}`}
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(exam.status)}
                            <span>{getStatusText(exam.status)}</span>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {exam.status === "pending" && (
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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

  // Danh sách kỳ thi view
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quản Lý Kỳ Thi
          </h1>
          <p className="text-gray-600">Quản lý và chấm điểm các kỳ thi</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {examPeriods.map((period) => (
              <div
                key={period.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedPeriod(period)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {period.name}
                    </h3>
                    <p className="text-sm text-gray-600">{period.code}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      period.status
                    )}`}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(period.status)}
                      <span>{getStatusText(period.status)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {period.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {period.totalExams}
                    </p>
                    <p className="text-xs text-gray-600">Tổng bài thi</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">
                      {period.gradedExams}
                    </p>
                    <p className="text-xs text-green-600">Đã chấm</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(period.startDate)} -{" "}
                      {formatDate(period.endDate)}
                    </span>
                  </div>
                  <button className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center space-x-1">
                    <span>Xem chi tiết</span>
                    <Eye className="w-4 h-4" />
                  </button>
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
