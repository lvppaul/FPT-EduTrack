import React from "react";
import MetricCard from "../MetricCard";
import {
  Users,
  GraduationCap,
  UserCheck,
  FileText,
  BookOpen,
  ClipboardList,
  Mail,
  Clock,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const metrics = [
    {
      title: "Sinh Viên",
      value: "1,265",
      icon: Users,
    },
    {
      title: "Giảng Viên",
      value: "186",
      icon: GraduationCap,
    },
    {
      title: "Trưởng Khoa",
      value: "24",
      icon: UserCheck,
    },
    {
      title: "Kỳ Thi",
      value: "89",
      icon: FileText,
    },
    {
      title: "Bài Test",
      value: "342",
      icon: BookOpen,
    },
    {
      title: "Đơn Phúc Khảo",
      value: "67",
      icon: ClipboardList,
    },
    {
      title: "Cuộc Họp",
      value: "23",
      icon: Clock,
    },
    {
      title: "Thông Báo",
      value: "156",
      icon: Mail,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Tổng Quan Hệ Thống
        </h1>
        <p className="text-gray-600">
          Dashboard quản trị và thống kê tổng quan
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Hoạt Động Gần Đây
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Sinh viên mới đăng ký thành công
              </p>
              <p className="text-xs text-green-600">2 phút trước</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Lịch thi đã được cập nhật
              </p>
              <p className="text-xs text-blue-600">5 phút trước</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Yêu cầu đặt phòng đang chờ xử lý
              </p>
              <p className="text-xs text-orange-600">10 phút trước</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Đơn phúc khảo mới được gửi
              </p>
              <p className="text-xs text-purple-600">15 phút trước</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-teal-50 rounded-lg border border-teal-100">
            <div className="w-3 h-3 bg-teal-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Bài test mới được tạo bởi giảng viên
              </p>
              <p className="text-xs text-teal-600">25 phút trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
