import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  FileText,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import type { Report } from "../../types/requestType";
import TestDetailView from "./TestDetailView";
import { GradingReport } from "../../service/reportService";
interface ReportDetailViewProps {
  report: Report;
  onBack: () => void;
  onRefreshReport?: () => void;
}

const ReportDetailView: React.FC<ReportDetailViewProps> = ({
  report,
  onBack,
  onRefreshReport,
}) => {
  const [selectedTest, setSelectedTest] = useState<Report["test"] | null>(null);
  const [showTestDetail, setShowTestDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleGradingReport = async (reportId: number) => {
    try {
      setIsLoading(true);
      const response = await GradingReport(reportId);

      if (response) {
        setNotification({
          type: "success",
          message: "Cập nhật trạng thái thành công",
        });

        // Auto hide notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);

        // Refresh the report data
        if (onRefreshReport) {
          onRefreshReport();
        }
      }
    } catch (error) {
      console.error("Error updating report status:", error);
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi cập nhật trạng thái. Vui lòng thử lại.",
      });

      // Auto hide error notification after 4 seconds
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTest = (test: Report["test"]) => {
    setSelectedTest(test);
    setShowTestDetail(true);
  };

  const handleBackFromTestDetail = () => {
    setShowTestDetail(false);
    setSelectedTest(null);
  };

  const handleRefreshTestData = () => {
    if (onRefreshReport) {
      onRefreshReport();
    }
  };

  // Status options
  const statusOptions = [
    { id: "1", name: "Đang chờ xử lí", color: "bg-yellow-100 text-yellow-800" },
    { id: "2", name: "Đang chấm bài", color: "bg-blue-100 text-blue-800" },
    { id: "3", name: "Đã chấm", color: "bg-green-100 text-green-800" },
    { id: "4", name: "Đang chờ họp", color: "bg-orange-100 text-orange-800" },
    { id: "5", name: "Đã xác nhận", color: "bg-purple-100 text-purple-800" },
    { id: "6", name: "Đã từ chối", color: "bg-red-100 text-red-800" },
  ];

  const getStatusInfo = (statusId: number) => {
    return (
      statusOptions.find((s) => s.id === statusId.toString()) || {
        name: "Không xác định",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show test detail view if a test is selected
  if (showTestDetail && selectedTest) {
    return (
      <TestDetailView
        test={selectedTest}
        onBack={handleBackFromTestDetail}
        onRefreshTest={handleRefreshTestData}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách báo cáo</span>
        </button>

        {/* Report Detail Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {report.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium text-gray-800">Ngày tạo:</span>
              <span>{formatDate(report.createdAt)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="font-medium text-gray-800">Sinh viên:</span>
              <span>{report.student?.fullname || "N/A"}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="font-medium text-gray-800">Loại:</span>
              <span>{report.isSecond ? "Báo cáo lần 2" : "Báo cáo lần 1"}</span>
            </div>
            {report.reportStatusId == 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleGradingReport(report.id)}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Chấm Điểm
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <span className="font-medium text-gray-800">Trạng thái:</span>
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                getStatusInfo(report.reportStatusId).color
              }`}
            >
              {getStatusInfo(report.reportStatusId).name}
            </span>
          </div>

          {/* Report Content */}
          <div className="mt-4">
            <h3 className="font-medium text-gray-800 mb-2">
              Nội dung báo cáo:
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {report.content}
              </p>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Thông Tin Sinh Viên
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {report.student?.fullname || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {report.student?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Test Information */}
        {report.test && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Bài Thi Liên Quan
              </h2>

              {report.test && (
                <button
                  onClick={() => handleViewTest(report.test)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Xem Chi Tiết Bài Thi
                </button>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">
                    Tiêu đề bài thi
                  </span>
                  <span className="text-gray-900">
                    {report.test.title || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">Mã bài thi</span>
                  <span className="text-gray-900">
                    {report.test.code || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">Điểm số</span>
                  <span className="text-gray-900">
                    {report.test.testsScores
                      ? `${report.test.testsScores} điểm`
                      : "Chưa chấm"}
                  </span>
                </div>

                {report.test.link && (
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-700">
                      File bài thi
                    </span>
                    <button
                      onClick={() => window.open(report.test.link, "_blank")}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Tải xuống
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default ReportDetailView;
