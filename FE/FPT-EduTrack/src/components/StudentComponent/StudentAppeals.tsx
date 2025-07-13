import React, { useState } from "react";
import {
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
} from "lucide-react";

interface Appeal {
  id: string;
  examTitle: string;
  subject: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected" | "under-review";
  reason: string;
  currentScore: number;
  requestedScore?: number;
  response?: string;
  responseDate?: string;
}

const StudentAppeals: React.FC = () => {
  const [showNewAppealForm, setShowNewAppealForm] = useState(false);
  const [newAppeal, setNewAppeal] = useState({
    examId: "",
    reason: "",
    requestedScore: "",
  });

  const appeals: Appeal[] = [
    {
      id: "1",
      examTitle: "Kiểm tra giữa kỳ - Phát triển phần mềm",
      subject: "SWD392",
      submittedDate: "2025-07-11",
      status: "pending",
      reason:
        "Tôi cho rằng câu 15 có đáp án không chính xác. Theo tài liệu học...",
      currentScore: 85,
      requestedScore: 90,
    },
    {
      id: "2",
      examTitle: "Bài kiểm tra Database Design",
      subject: "DBI202",
      submittedDate: "2025-07-09",
      status: "approved",
      reason: "Câu hỏi về normalization có vấn đề về cách hiểu đề bài...",
      currentScore: 72,
      requestedScore: 78,
      response:
        "Sau khi xem xét, chúng tôi đồng ý với lý do phúc khảo của bạn. Điểm đã được cập nhật.",
      responseDate: "2025-07-10",
    },
    {
      id: "3",
      examTitle: "Quiz - Mobile Development",
      subject: "PRM392",
      submittedDate: "2025-07-06",
      status: "rejected",
      reason: "Tôi nghĩ câu 8 về lifecycle có nhiều đáp án đúng...",
      currentScore: 45,
      response:
        "Sau khi xem xét kỹ lưỡng, chúng tôi không thể chấp nhận yêu cầu phúc khảo này. Đáp án của bạn không chính xác.",
      responseDate: "2025-07-07",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "under-review":
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case "rejected":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Được chấp nhận";
      case "pending":
        return "Chờ xử lý";
      case "under-review":
        return "Đang xem xét";
      case "rejected":
        return "Bị từ chối";
      default:
        return "Không xác định";
    }
  };

  const handleSubmitAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle appeal submission logic here
    console.log("Submitting appeal:", newAppeal);
    setShowNewAppealForm(false);
    setNewAppeal({ examId: "", reason: "", requestedScore: "" });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Đơn Phúc Khảo
          </h1>
          <p className="text-gray-600">
            Quản lý các đơn phúc khảo bài thi của bạn
          </p>
        </div>
        <button
          onClick={() => setShowNewAppealForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tạo đơn mới
        </button>
      </div>

      {/* New Appeal Form */}
      {showNewAppealForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tạo đơn phúc khảo mới
            </h3>
            <form onSubmit={handleSubmitAppeal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bài thi
                </label>
                <select
                  value={newAppeal.examId}
                  onChange={(e) =>
                    setNewAppeal({ ...newAppeal, examId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Chọn bài thi</option>
                  <option value="swd392">SWD392 - Kiểm tra giữa kỳ</option>
                  <option value="dbi202">DBI202 - Database Design</option>
                  <option value="prn231">PRN231 - Web Programming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm mong muốn
                </label>
                <input
                  type="number"
                  value={newAppeal.requestedScore}
                  onChange={(e) =>
                    setNewAppeal({
                      ...newAppeal,
                      requestedScore: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập điểm mong muốn"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do phúc khảo
                </label>
                <textarea
                  value={newAppeal.reason}
                  onChange={(e) =>
                    setNewAppeal({ ...newAppeal, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Mô tả lý do bạn muốn phúc khảo bài thi này..."
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Gửi đơn
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewAppealForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appeals List */}
      <div className="space-y-6">
        {appeals.map((appeal) => (
          <div
            key={appeal.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {appeal.examTitle}
                  </h3>
                  <p className="text-sm text-gray-500">{appeal.subject}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(appeal.status)}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    appeal.status
                  )}`}
                >
                  {getStatusText(appeal.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Ngày gửi:{" "}
                {new Date(appeal.submittedDate).toLocaleDateString("vi-VN")}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                Điểm hiện tại: {appeal.currentScore}/100
                {appeal.requestedScore && ` → ${appeal.requestedScore}/100`}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Lý do phúc khảo:
              </h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {appeal.reason}
              </p>
            </div>

            {appeal.response && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Phản hồi từ giảng viên:
                </h4>
                <div
                  className={`p-3 rounded-lg ${
                    appeal.status === "approved"
                      ? "bg-green-50 border border-green-200"
                      : appeal.status === "rejected"
                      ? "bg-red-50 border border-red-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <p className="text-sm text-gray-700 mb-2">
                    {appeal.response}
                  </p>
                  {appeal.responseDate && (
                    <p className="text-xs text-gray-500">
                      Phản hồi ngày:{" "}
                      {new Date(appeal.responseDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">ID đơn: #{appeal.id}</div>
              <button className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors duration-200">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {appeals.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có đơn phúc khảo nào
          </h3>
          <p className="text-gray-500 mb-4">
            Bạn chưa gửi đơn phúc khảo nào. Nhấn nút "Tạo đơn mới" để bắt đầu.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentAppeals;
