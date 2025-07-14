import React from "react";
import { Video, Calendar, Clock, User, ExternalLink, Copy } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  examiner: string;
  date: string;
  time: string;
  duration: number;
  meetingLink: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  description?: string;
  participants?: number;
  recording?: string;
}

const StudentMeetings: React.FC = () => {
  const meetings: Meeting[] = [
    {
      id: "1",
      title: "Phúc khảo bài thi SWD392 - Phát triển phần mềm",
      examiner: "TS. Nguyễn Văn A",
      date: "2025-07-15",
      time: "14:00",
      duration: 30,
      meetingLink: "https://meet.google.com/abc-def-ghi",
      status: "upcoming",
      description:
        "Thảo luận về kết quả phúc khảo bài thi giữa kỳ môn Phát triển phần mềm",
      participants: 2,
    },
    {
      id: "2",
      title: "Tư vấn học tập - Database Management",
      examiner: "PGS. Trần Thị B",
      date: "2025-07-12",
      time: "10:30",
      duration: 45,
      meetingLink: "https://meet.google.com/jkl-mno-pqr",
      status: "completed",
      description:
        "Hướng dẫn và giải đáp thắc mắc về môn học Database Management",
      participants: 3,
      recording: "https://drive.google.com/recording/123",
    },
    {
      id: "3",
      title: "Họp nhóm dự án cuối kỳ",
      examiner: "ThS. Lê Văn C",
      date: "2025-07-18",
      time: "16:00",
      duration: 60,
      meetingLink: "https://meet.google.com/stu-vwx-yz1",
      status: "upcoming",
      description:
        "Thảo luận tiến độ và yêu cầu dự án cuối kỳ môn Web Programming",
      participants: 5,
    },
    {
      id: "4",
      title: "Phúc khảo Quiz Mobile Development",
      examiner: "TS. Hoàng Thị D",
      date: "2025-07-10",
      time: "13:00",
      duration: 20,
      meetingLink: "https://meet.google.com/234-567-890",
      status: "cancelled",
      description: "Cuộc họp đã bị hủy do examiner có việc đột xuất",
      participants: 2,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const isToday = (dateString: string) => {
    const today = new Date().toDateString();
    const meetingDate = new Date(dateString).toDateString();
    return today === meetingDate;
  };

  const formatDateTime = (date: string, time: string) => {
    const meetingDate = new Date(`${date}T${time}`);
    return {
      date: meetingDate.toLocaleDateString("vi-VN"),
      time: meetingDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cuộc Họp</h1>
        <p className="text-gray-600">
          Danh sách các cuộc họp Google Meet được tạo bởi examiner
        </p>
      </div>

      <div className="space-y-6">
        {meetings.map((meeting) => {
          const dateTime = formatDateTime(meeting.date, meeting.time);
          const isUpcoming = meeting.status === "upcoming";
          const isOngoing = meeting.status === "ongoing";

          return (
            <div
              key={meeting.id}
              className={`bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 ${
                isToday(meeting.date)
                  ? "border-blue-300 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isUpcoming
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                        : isOngoing
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : meeting.status === "completed"
                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                        : "bg-gradient-to-r from-red-400 to-red-500"
                    }`}
                  >
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <User className="w-4 h-4 mr-1" />
                      {meeting.examiner}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    meeting.status
                  )}`}
                >
                  {getStatusText(meeting.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {dateTime.date}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {dateTime.time} ({meeting.duration} phút)
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  {meeting.participants} người tham gia
                </div>
              </div>

              {meeting.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {meeting.description}
                  </p>
                </div>
              )}

              {meeting.status !== "cancelled" && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Link cuộc họp:
                      </p>
                      <p className="text-sm text-blue-600 break-all">
                        {meeting.meetingLink}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(meeting.meetingLink)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                      title="Copy link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {isToday(meeting.date) && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                      Hôm nay
                    </span>
                  )}
                  ID: #{meeting.id}
                </div>
                <div className="flex space-x-2">
                  {meeting.recording && (
                    <a
                      href={meeting.recording}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 text-purple-600 border border-purple-300 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors duration-200"
                    >
                      <Video className="w-4 h-4 mr-1" />
                      Xem recording
                    </a>
                  )}
                  {(isUpcoming || isOngoing) && (
                    <a
                      href={meeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {isOngoing ? "Tham gia ngay" : "Tham gia cuộc họp"}
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {meetings.length === 0 && (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có cuộc họp nào
          </h3>
          <p className="text-gray-500">
            Examiner chưa tạo cuộc họp nào cho bạn. Các cuộc họp sẽ hiển thị ở
            đây khi được tạo.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentMeetings;
