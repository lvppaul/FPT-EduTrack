import React, { useState } from "react";
import {
  FileText,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Send,
} from "lucide-react";

interface Appeal {
  id: string;
  examTitle: string;
  subject: string;
  studentName: string;
  studentId: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected" | "under-review";
  reason: string;
  currentScore: number;
  requestedScore?: number;
  response?: string;
  responseDate?: string;
}

const LecturerAppeals: React.FC = () => {
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [selectedAppeal, setSelectedAppeal] = useState<Appeal | null>(null);
  const [response, setResponse] = useState("");
  const [decision, setDecision] = useState<"approve" | "reject" | "">("");

  const appeals: Appeal[] = [
    {
      id: "1",
      examTitle: "Kiểm tra giữa kỳ - Phát triển phần mềm",
      subject: "SWD392",
      studentName: "Nguyễn Văn A",
      studentId: "SE170001",
      submittedDate: "2025-07-11",
      status: "pending",
      reason:
        "Tôi cho rằng câu 15 có đáp án không chính xác. Theo tài liệu học từ slide bài giảng tuần 5, đáp án đúng phải là option B chứ không phải option A như trong đáp án.",
      currentScore: 85,
      requestedScore: 90,
    },
    {
      id: "2",
      examTitle: "Bài kiểm tra Database Design",
      subject: "DBI202",
      studentName: "Trần Thị B",
      studentId: "SE170002",
      submittedDate: "2025-07-09",
      status: "approved",
      reason:
        "Câu hỏi về normalization có vấn đề về cách hiểu đề bài. Em nghĩ đáp án của em là đúng theo cách hiểu thông thường.",
      currentScore: 72,
      requestedScore: 78,
      response:
        "Sau khi xem xét, chúng tôi đồng ý với lý do phúc khảo của bạn. Câu hỏi có thể gây nhầm lẫn và đáp án của bạn cũng hợp lý. Điểm đã được cập nhật.",
      responseDate: "2025-07-10",
    },
    {
      id: "3",
      examTitle: "Quiz - Mobile Development",
      subject: "MMA301",
      studentName: "Lê Văn C",
      studentId: "SE170003",
      submittedDate: "2025-07-10",
      status: "rejected",
      reason:
        "Em nghĩ câu 8 về lifecycle của Activity bị chấm sai. Em đã trả lời đúng nhưng vẫn bị trừ điểm.",
      currentScore: 45,
      requestedScore: 50,
      response:
        "Sau khi xem xét lại bài làm, đáp án của bạn không chính xác. Lifecycle của Activity bao gồm cả onRestart() method mà bạn đã bỏ sót. Điểm giữ nguyên.",
      responseDate: "2025-07-11",
    },
    {
      id: "4",
      examTitle: "Thi cuối kỳ - Web Programming",
      subject: "PRN231",
      studentName: "Phạm Thị D",
      studentId: "SE170004",
      submittedDate: "2025-07-12",
      status: "under-review",
      reason:
        "Câu hỏi về React Hooks có vẻ như có nhiều đáp án đúng. Em chọn useEffect nhưng bị sai, trong khi em nghĩ cả useState và useEffect đều đúng trong trường hợp này.",
      currentScore: 78,
      requestedScore: 85,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "approved":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "under-review":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "under-review":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      case "under-review":
        return "Đang xem xét";
      default:
        return "Không xác định";
    }
  };

  const filteredAppeals = appeals.filter((appeal) => {
    if (filter === "all") return true;
    return appeal.status === filter;
  });

  const pendingCount = appeals.filter(
    (appeal) => appeal.status === "pending"
  ).length;
  const approvedCount = appeals.filter(
    (appeal) => appeal.status === "approved"
  ).length;
  const rejectedCount = appeals.filter(
    (appeal) => appeal.status === "rejected"
  ).length;

  const handleResponseSubmit = () => {
    if (!selectedAppeal || !response || !decision) return;

    // Here you would typically send the response to your backend
    console.log("Submitting response:", {
      appealId: selectedAppeal.id,
      decision,
      response,
    });

    // Reset form
    setSelectedAppeal(null);
    setResponse("");
    setDecision("");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Xử Lý Đơn Phúc Khảo
        </h1>
        <p className="text-gray-600">
          Quản lý và phản hồi các đơn phúc khảo từ sinh viên
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
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
              <p className="text-sm font-medium text-gray-600">Đã duyệt</p>
              <p className="text-2xl font-bold text-gray-900">
                {approvedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Từ chối</p>
              <p className="text-2xl font-bold text-gray-900">
                {rejectedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số</p>
              <p className="text-2xl font-bold text-gray-900">
                {appeals.length}
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
              { id: "all", label: "Tất cả", count: appeals.length },
              { id: "pending", label: "Chờ xử lý", count: pendingCount },
              { id: "approved", label: "Đã duyệt", count: approvedCount },
              { id: "rejected", label: "Từ chối", count: rejectedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setFilter(
                    tab.id as "all" | "pending" | "approved" | "rejected"
                  )
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

      {/* Appeals List */}
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
                  Ngày gửi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppeals.map((appeal) => (
                <tr key={appeal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {appeal.examTitle}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appeal.subject}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {appeal.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appeal.studentId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(appeal.submittedDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{appeal.currentScore}</span>
                      {appeal.requestedScore && (
                        <span className="text-gray-500">
                          {" "}
                          → {appeal.requestedScore}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        appeal.status
                      )}`}
                    >
                      {getStatusIcon(appeal.status)}
                      <span className="ml-1">
                        {getStatusText(appeal.status)}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedAppeal(appeal)}
                      className="inline-flex items-center px-3 py-1.5 border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {appeal.status === "pending" ? "Xử lý" : "Xem chi tiết"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppeals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              Không có đơn phúc khảo nào để hiển thị
            </p>
          </div>
        )}
      </div>

      {/* Appeal Details Modal */}
      {selectedAppeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết đơn phúc khảo
                </h3>
                <button
                  onClick={() => setSelectedAppeal(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Appeal Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedAppeal.examTitle}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Sinh viên:</span>
                    <span className="ml-2 font-medium">
                      {selectedAppeal.studentName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">MSSV:</span>
                    <span className="ml-2 font-medium">
                      {selectedAppeal.studentId}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Môn học:</span>
                    <span className="ml-2 font-medium">
                      {selectedAppeal.subject}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Ngày gửi:</span>
                    <span className="ml-2 font-medium">
                      {new Date(
                        selectedAppeal.submittedDate
                      ).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Appeal Reason */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  Lý do phúc khảo:
                </h4>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-gray-700">{selectedAppeal.reason}</p>
                </div>
              </div>

              {/* Existing Response */}
              {selectedAppeal.response && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Phản hồi:</h4>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-gray-700">{selectedAppeal.response}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Ngày phản hồi:{" "}
                      {selectedAppeal.responseDate &&
                        new Date(
                          selectedAppeal.responseDate
                        ).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              )}

              {/* Response Form (for pending appeals) */}
              {selectedAppeal.status === "pending" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quyết định:
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="approve"
                          checked={decision === "approve"}
                          onChange={(e) =>
                            setDecision(e.target.value as "approve" | "reject")
                          }
                          className="mr-2"
                        />
                        Chấp nhận
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="reject"
                          checked={decision === "reject"}
                          onChange={(e) =>
                            setDecision(e.target.value as "approve" | "reject")
                          }
                          className="mr-2"
                        />
                        Từ chối
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phản hồi:
                    </label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nhập phản hồi của bạn..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedAppeal(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleResponseSubmit}
                      disabled={!response || !decision}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerAppeals;
