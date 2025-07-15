import React from "react";
import {
  Video,
  Calendar,
  Clock,
  User,
  ExternalLink,
  Copy,
  Plus,
} from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  studentName: string;
  studentId: string;
  date: string;
  time: string;
  duration: number;
  meetingLink: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  description?: string;
  participants?: number;
  recording?: string;
  purpose: "appeal-review" | "consultation" | "project-review";
}

const LecturerMeetings: React.FC = () => {
  const meetings: Meeting[] = [
    {
      id: "1",
      title: "Phúc khảo bài thi SWD392 - Phát triển phần mềm",
      studentName: "Nguyễn Văn A",
      studentId: "SE170001",
      date: "2025-07-15",
      time: "14:00",
      duration: 30,
      meetingLink: "https://meet.google.com/abc-def-ghi",
      status: "upcoming",
      description:
        "Thảo luận về kết quả phúc khảo bài thi giữa kỳ môn Phát triển phần mềm",
      participants: 2,
      purpose: "appeal-review",
    },
    {
      id: "2",
      title: "Tư vấn học tập - Database Management",
      studentName: "Trần Thị B",
      studentId: "SE170002",
      date: "2025-07-12",
      time: "10:30",
      duration: 45,
      meetingLink: "https://meet.google.com/jkl-mno-pqr",
      status: "completed",
      description:
        "Hướng dẫn và giải đáp thắc mắc về môn học Database Management",
      participants: 2,
      recording: "https://drive.google.com/recording/123",
      purpose: "consultation",
    },
    {
      id: "3",
      title: "Review dự án cuối kỳ - Mobile App",
      studentName: "Lê Văn C",
      studentId: "SE170003",
      date: "2025-07-18",
      time: "16:00",
      duration: 60,
      meetingLink: "https://meet.google.com/stu-vwx-yz1",
      status: "upcoming",
      description: "Đánh giá và góp ý về dự án ứng dụng di động cuối kỳ",
      participants: 2,
      purpose: "project-review",
    },
    {
      id: "4",
      title: "Tư vấn hướng nghiệp - Web Development",
      studentName: "Phạm Thị D",
      studentId: "SE170004",
      date: "2025-07-14",
      time: "09:00",
      duration: 30,
      meetingLink: "https://meet.google.com/abc-123-xyz",
      status: "completed",
      description:
        "Tư vấn về lộ trình học tập và phát triển sự nghiệp trong lĩnh vực web development",
      participants: 2,
      recording: "https://drive.google.com/recording/456",
      purpose: "consultation",
    },
    {
      id: "5",
      title: "Họp báo cáo tiến độ - Capstone Project",
      studentName: "Hoàng Văn E",
      studentId: "SE170005",
      date: "2025-07-13",
      time: "15:30",
      duration: 45,
      meetingLink: "https://meet.google.com/def-456-abc",
      status: "ongoing",
      description:
        "Báo cáo tiến độ và thảo luận về các vấn đề trong dự án tốt nghiệp",
      participants: 2,
      purpose: "project-review",
    },
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
      console.log("Copied to clipboard:", text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "ongoing":
        return "text-green-600 bg-green-50 border-green-200";
      case "completed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPurposeText = (purpose: string) => {
    switch (purpose) {
      case "appeal-review":
        return "Phúc khảo";
      case "consultation":
        return "Tư vấn";
      case "project-review":
        return "Review dự án";
      default:
        return "Khác";
    }
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case "appeal-review":
        return "bg-orange-100 text-orange-800";
      case "consultation":
        return "bg-blue-100 text-blue-800";
      case "project-review":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const upcomingMeetings = meetings.filter(
    (m) => m.status === "upcoming"
  ).length;
  const completedMeetings = meetings.filter(
    (m) => m.status === "completed"
  ).length;
  const ongoingMeetings = meetings.filter((m) => m.status === "ongoing").length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cuộc Họp</h1>
          <p className="text-gray-600">Quản lý các cuộc họp với sinh viên</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
          <Plus className="w-4 h-4 mr-2" />
          Tạo cuộc họp mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sắp diễn ra</p>
              <p className="text-2xl font-bold text-gray-900">
                {upcomingMeetings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Đang diễn ra</p>
              <p className="text-2xl font-bold text-gray-900">
                {ongoingMeetings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedMeetings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng cuộc họp</p>
              <p className="text-2xl font-bold text-gray-900">
                {meetings.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách cuộc họp
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-green-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {meeting.title}
                          </h3>

                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <User className="w-4 h-4 mr-1" />
                              {meeting.studentName} ({meeting.studentId})
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPurposeColor(
                                meeting.purpose
                              )}`}
                            >
                              {getPurposeText(meeting.purpose)}
                            </span>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(meeting.date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {meeting.time} ({meeting.duration} phút)
                            </div>
                            {meeting.participants && (
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {meeting.participants} người tham gia
                              </div>
                            )}
                          </div>

                          {meeting.description && (
                            <p className="text-sm text-gray-600 mb-4">
                              {meeting.description}
                            </p>
                          )}
                        </div>

                        <div className="ml-4 flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              meeting.status
                            )}`}
                          >
                            {getStatusText(meeting.status)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {meeting.status === "upcoming" && (
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Tham gia họp
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        )}

                        {meeting.status === "ongoing" && (
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium animate-pulse"
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Đang họp - Tham gia
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        )}

                        {meeting.recording &&
                          meeting.status === "completed" && (
                            <a
                              href={meeting.recording}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 text-sm font-medium"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Xem bản ghi
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          )}

                        <button
                          onClick={() => copyToClipboard(meeting.meetingLink)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors duration-200 text-sm"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {meetings.length === 0 && (
          <div className="text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có cuộc họp nào được tạo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LecturerMeetings;
