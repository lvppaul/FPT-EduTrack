import React from "react";
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: number;
  score?: number;
  maxScore: number;
  status: "completed" | "in-progress" | "pending" | "missed";
  examType: "midterm" | "final" | "quiz";
  attempts: number;
  maxAttempts: number;
}

const StudentExams: React.FC = () => {
  const exams: Exam[] = [
    {
      id: "1",
      title: "Kiểm tra giữa kỳ - Phát triển phần mềm",
      subject: "SWD392",
      date: "2025-07-10",
      duration: 90,
      score: 85,
      maxScore: 100,
      status: "completed",
      examType: "midterm",
      attempts: 1,
      maxAttempts: 1,
    },
    {
      id: "2",
      title: "Bài kiểm tra Database Design",
      subject: "DBI202",
      date: "2025-07-08",
      duration: 60,
      score: 72,
      maxScore: 100,
      status: "completed",
      examType: "quiz",
      attempts: 1,
      maxAttempts: 2,
    },
    {
      id: "3",
      title: "Thi cuối kỳ - Web Programming",
      subject: "PRN231",
      date: "2025-07-15",
      duration: 120,
      maxScore: 100,
      status: "pending",
      examType: "final",
      attempts: 0,
      maxAttempts: 1,
    },
    {
      id: "4",
      title: "Quiz - Mobile Development",
      subject: "PRM392",
      date: "2025-07-05",
      duration: 30,
      maxScore: 50,
      status: "missed",
      examType: "quiz",
      attempts: 0,
      maxAttempts: 2,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "missed":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "missed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case "final":
        return "bg-purple-100 text-purple-800";
      case "midterm":
        return "bg-blue-100 text-blue-800";
      case "quiz":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Kỳ Thi</h1>
        <p className="text-gray-600">
          Danh sách các bài thi đã hoàn thành và sắp tới
        </p>
      </div>

      <div className="grid gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-gray-500">{exam.subject}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getExamTypeColor(
                    exam.examType
                  )}`}
                >
                  {exam.examType === "final"
                    ? "Cuối kỳ"
                    : exam.examType === "midterm"
                    ? "Giữa kỳ"
                    : "Quiz"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    exam.status
                  )}`}
                >
                  {exam.status === "completed"
                    ? "Hoàn thành"
                    : exam.status === "pending"
                    ? "Chờ thi"
                    : exam.status === "missed"
                    ? "Đã bỏ lỡ"
                    : "Đang thi"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(exam.date).toLocaleDateString("vi-VN")}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {exam.duration} phút
              </div>
              <div className="flex items-center text-sm text-gray-600">
                {getStatusIcon(exam.status)}
                <span className="ml-2">
                  {exam.attempts}/{exam.maxAttempts} lần thi
                </span>
              </div>
            </div>

            {exam.score !== undefined && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Điểm số:
                  </span>
                  <span
                    className={`text-lg font-bold ${getScoreColor(
                      exam.score,
                      exam.maxScore
                    )}`}
                  >
                    {exam.score}/{exam.maxScore}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (exam.score / exam.maxScore) * 100 >= 80
                        ? "bg-green-500"
                        : (exam.score / exam.maxScore) * 100 >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${(exam.score / exam.maxScore) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                {exam.status === "completed"
                  ? "Đã hoàn thành"
                  : exam.status === "pending"
                  ? "Sắp diễn ra"
                  : exam.status === "missed"
                  ? "Đã bỏ lỡ"
                  : "Đang diễn ra"}
              </div>
              <div className="flex space-x-2">
                {exam.status === "completed" && (
                  <button className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200">
                    Xem chi tiết
                  </button>
                )}
                {exam.status === "pending" && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                    Vào thi
                  </button>
                )}
                {exam.status === "missed" &&
                  exam.attempts < exam.maxAttempts && (
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors duration-200">
                      Thi bù
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentExams;
