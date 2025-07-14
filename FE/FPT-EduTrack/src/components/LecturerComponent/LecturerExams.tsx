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
} from "lucide-react";

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
}

const LecturerExams: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "pending" | "graded">("all");

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
      default:
        return "Không xác định";
    }
  };

  const getExamTypeText = (type: string) => {
    switch (type) {
      case "midterm":
        return "Giữa kỳ";
      case "final":
        return "Cuối kỳ";
      case "quiz":
        return "Kiểm tra";
      default:
        return type;
    }
  };

  const filteredExams = examsToGrade.filter((exam) => {
    if (filter === "all") return true;
    return exam.status === filter;
  });

  const pendingCount = examsToGrade.filter(
    (exam) => exam.status === "pending"
  ).length;
  const gradedCount = examsToGrade.filter(
    (exam) => exam.status === "graded"
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chấm Điểm Bài Thi
        </h1>
        <p className="text-gray-600">
          Quản lý và chấm điểm các bài thi của sinh viên
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ chấm điểm</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Đã chấm xong</p>
              <p className="text-2xl font-bold text-gray-900">{gradedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng bài thi</p>
              <p className="text-2xl font-bold text-gray-900">
                {examsToGrade.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "all", label: "Tất cả", count: examsToGrade.length },
              { id: "pending", label: "Chờ chấm", count: pendingCount },
              { id: "graded", label: "Đã chấm", count: gradedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setFilter(tab.id as "all" | "pending" | "graded")
                }
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.id
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày nộp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exam.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {exam.subject} • {getExamTypeText(exam.examType)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exam.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {exam.studentId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(exam.submittedDate).toLocaleDateString("vi-VN")}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {exam.duration} phút
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        exam.status
                      )}`}
                    >
                      {getStatusIcon(exam.status)}
                      <span className="ml-1">{getStatusText(exam.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exam.currentScore !== undefined ? (
                      <div className="text-sm font-medium text-gray-900">
                        {exam.currentScore}/{exam.maxScore}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Chưa chấm</span>
                    )}
                    <div className="text-xs text-gray-500">
                      {exam.answers}/{exam.totalQuestions} câu
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-sm font-medium transition-colors duration-200">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </button>
                      {exam.status === "pending" ? (
                        <button className="inline-flex items-center px-3 py-1.5 border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-md text-sm font-medium transition-colors duration-200">
                          <Edit className="w-4 h-4 mr-1" />
                          Chấm điểm
                        </button>
                      ) : (
                        <button className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md text-sm font-medium transition-colors duration-200">
                          <Edit className="w-4 h-4 mr-1" />
                          Chỉnh sửa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExams.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không có bài thi nào để hiển thị</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerExams;
