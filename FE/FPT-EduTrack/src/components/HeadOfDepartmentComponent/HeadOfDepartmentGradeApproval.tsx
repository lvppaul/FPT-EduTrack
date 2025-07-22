import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  User,
  FileText,
  AlertCircle,
  Search,
  Filter,
  Download,
} from "lucide-react";

interface GradeSubmission {
  id: string;
  examId: string;
  examCode: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  lecturerId: string;
  lecturerName: string;
  subject: string;
  submittedScore: number;
  maxScore: number;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  comments?: string;
  appealCount?: number;
}

const HeadOfDepartmentGradeApproval: React.FC = () => {
  const [submissions, setSubmissions] = useState<GradeSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<
    GradeSubmission[]
  >([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<GradeSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - thay thế bằng API call thực tế
  useEffect(() => {
    const mockData: GradeSubmission[] = [
      {
        id: "1",
        examId: "exam1",
        examCode: "SWD392_FE",
        examTitle: "Kiểm tra cuối kỳ SWD392",
        studentId: "std1",
        studentName: "Nguyễn Văn An",
        studentCode: "HE170001",
        lecturerId: "lec1",
        lecturerName: "TS. Trần Thị B",
        subject: "Software Development",
        submittedScore: 85,
        maxScore: 100,
        submittedAt: "2025-01-15T10:30:00Z",
        status: "pending",
        comments: "Sinh viên làm bài tốt, có hiểu biết sâu về framework",
        appealCount: 0,
      },
      {
        id: "2",
        examId: "exam2",
        examCode: "SWD392_BE",
        examTitle: "Kiểm tra giữa kỳ SWD392",
        studentId: "std2",
        studentName: "Lê Thị Cẩm",
        studentCode: "HE170002",
        lecturerId: "lec2",
        lecturerName: "ThS. Phạm Văn C",
        subject: "Software Development",
        submittedScore: 72,
        maxScore: 100,
        submittedAt: "2025-01-14T14:20:00Z",
        status: "approved",
        comments: "Điểm phù hợp với năng lực sinh viên",
        appealCount: 1,
      },
      {
        id: "3",
        examId: "exam3",
        examCode: "SWD392_API",
        examTitle: "Bài tập lớn API Design",
        studentId: "std3",
        studentName: "Hoàng Minh Đức",
        studentCode: "HE170003",
        lecturerId: "lec1",
        lecturerName: "TS. Trần Thị B",
        subject: "Software Development",
        submittedScore: 92,
        maxScore: 100,
        submittedAt: "2025-01-13T16:45:00Z",
        status: "pending",
        comments: "Thiết kế API rất tốt, code clean và có documentation đầy đủ",
        appealCount: 0,
      },
    ];

    setSubmissions(mockData);
    setFilteredSubmissions(mockData);
  }, []);

  // Filter submissions
  useEffect(() => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.studentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.studentCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.examCode
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.status === statusFilter
      );
    }

    setFilteredSubmissions(filtered);
  }, [searchTerm, statusFilter, submissions]);

  const handleApprove = async (id: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === id
            ? { ...sub, status: "approved" as const, comments: approvalComment }
            : sub
        )
      );
      setIsLoading(false);
      setShowModal(false);
      setApprovalComment("");
      setSelectedSubmission(null);
    }, 1000);
  };

  const handleReject = async (id: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === id
            ? { ...sub, status: "rejected" as const, comments: approvalComment }
            : sub
        )
      );
      setIsLoading(false);
      setShowModal(false);
      setApprovalComment("");
      setSelectedSubmission(null);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} />
            Chờ duyệt
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} />
            Đã duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} />
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sinh viên, mã sinh viên, mã bài thi..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Filter size={16} />
              Lọc
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Download size={16} />
              Xuất
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
              <p className="text-xl font-bold text-gray-900">
                {submissions.filter((s) => s.status === "pending").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đã duyệt</p>
              <p className="text-xl font-bold text-gray-900">
                {submissions.filter((s) => s.status === "approved").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Từ chối</p>
              <p className="text-xl font-bold text-gray-900">
                {submissions.filter((s) => s.status === "rejected").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng cộng</p>
              <p className="text-xl font-bold text-gray-900">
                {submissions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm số
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày nộp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {submission.studentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.studentCode}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">
                        {submission.examCode}
                      </div>
                      <div className="text-sm text-gray-500">
                        {submission.examTitle}
                      </div>
                      <div className="text-xs text-gray-400">
                        {submission.subject}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {submission.lecturerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        {submission.submittedScore}
                      </span>
                      <span className="text-gray-500">
                        / {submission.maxScore}
                      </span>
                      {(submission.appealCount ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <AlertCircle size={12} />
                          {submission.appealCount} khiếu nại
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(submission.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(submission.submittedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedSubmission(submission);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      {submission.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Phê duyệt"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission);
                              setShowModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Từ chối"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for approval/rejection */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết bài chấm - {selectedSubmission.examCode}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sinh viên
                  </label>
                  <p className="text-gray-900">
                    {selectedSubmission.studentName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedSubmission.studentCode}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giảng viên chấm
                  </label>
                  <p className="text-gray-900">
                    {selectedSubmission.lecturerName}
                  </p>
                </div>
              </div>

              {/* Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm số
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {selectedSubmission.submittedScore}
                  </span>
                  <span className="text-gray-500">
                    / {selectedSubmission.maxScore}
                  </span>
                </div>
              </div>

              {/* Lecturer Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhận xét của giảng viên
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedSubmission.comments}
                </p>
              </div>

              {/* Head's Comments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nhận xét của trưởng khoa
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Nhập nhận xét về điểm chấm..."
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedSubmission(null);
                  setApprovalComment("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              {selectedSubmission.status === "pending" && (
                <>
                  <button
                    onClick={() => handleReject(selectedSubmission.id)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <XCircle size={16} />
                    Từ chối
                  </button>
                  <button
                    onClick={() => handleApprove(selectedSubmission.id)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Phê duyệt
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadOfDepartmentGradeApproval;
