import React from "react";
import {
  Users,
  FileCheck,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
} from "lucide-react";

const HeadOfDepartmentDashboard: React.FC = () => {
  // Mock data - thay thế bằng API call thực tế
  const stats = {
    totalLecturers: 25,
    pendingApprovals: 12,
    approvedThisMonth: 145,
    averageScore: 82.5,
    totalExams: 35,
    ongoingExams: 8,
  };

  const recentSubmissions = [
    {
      id: "1",
      studentName: "Nguyễn Văn An",
      examCode: "SWD392_FE",
      lecturerName: "TS. Trần Thị B",
      score: 85,
      status: "pending",
      submittedAt: "2025-01-18T10:30:00Z",
    },
    {
      id: "2",
      studentName: "Lê Thị Cẩm",
      examCode: "SWD392_BE",
      lecturerName: "ThS. Phạm Văn C",
      score: 72,
      status: "approved",
      submittedAt: "2025-01-18T09:15:00Z",
    },
    {
      id: "3",
      studentName: "Hoàng Minh Đức",
      examCode: "SWD392_API",
      lecturerName: "TS. Trần Thị B",
      score: 92,
      status: "pending",
      submittedAt: "2025-01-18T08:45:00Z",
    },
  ];

  const upcomingDeadlines = [
    {
      title: "Duyệt điểm kỳ thi cuối kỳ",
      date: "2025-01-20",
      count: 15,
      priority: "high",
    },
    {
      title: "Báo cáo thống kê tháng",
      date: "2025-01-25",
      count: 1,
      priority: "medium",
    },
    {
      title: "Họp khoa định kỳ",
      date: "2025-01-30",
      count: 1,
      priority: "low",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={12} className="text-yellow-600" />;
      case "approved":
        return <CheckCircle size={12} className="text-green-600" />;
      case "rejected":
        return <XCircle size={12} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Trưởng Khoa
        </h1>
        <p className="text-gray-600">
          Tổng quan hoạt động và chỉ số quan trọng của khoa
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giảng viên</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalLecturers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp size={16} className="text-green-600 mr-1" />
            <span className="text-green-600">+2 tháng này</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pendingApprovals}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <AlertTriangle size={16} className="text-yellow-600 mr-1" />
            <span className="text-yellow-600">Cần xử lý</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Đã duyệt tháng này
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.approvedThisMonth}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileCheck size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp size={16} className="text-green-600 mr-1" />
            <span className="text-green-600">+15% so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Điểm TB khoa</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.averageScore}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award size={24} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp size={16} className="text-green-600 mr-1" />
            <span className="text-green-600">+2.3 điểm so với kỳ trước</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Bài chấm gần đây
                </h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem tất cả
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {submission.studentName}
                        </h3>
                        <span className="text-sm text-gray-500">
                          • {submission.examCode}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Chấm bởi: {submission.lecturerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(submission.submittedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900">
                        {submission.score}
                      </span>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(submission.status)}
                        <span
                          className={`text-sm ${
                            submission.status === "pending"
                              ? "text-yellow-600"
                              : submission.status === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {submission.status === "pending"
                            ? "Chờ duyệt"
                            : submission.status === "approved"
                            ? "Đã duyệt"
                            : "Từ chối"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Công việc sắp tới
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className={`p-4 border-l-4 rounded-lg ${getPriorityColor(
                      deadline.priority
                    )}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {deadline.title}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      Hạn: {new Date(deadline.date).toLocaleDateString("vi-VN")}
                    </p>
                    {deadline.count > 1 && (
                      <p className="text-xs text-gray-500">
                        {deadline.count} công việc
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Thao tác nhanh
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <FileCheck size={20} className="text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Duyệt điểm chấm
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <BarChart3 size={20} className="text-green-600" />
                  <span className="font-medium text-green-900">
                    Xem báo cáo
                  </span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <Users size={20} className="text-purple-600" />
                  <span className="font-medium text-purple-900">
                    Quản lý giảng viên
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadOfDepartmentDashboard;
