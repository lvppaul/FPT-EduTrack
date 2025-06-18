import React, { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Video,
  Calendar,
  Clock,
  Users,
  Link,
  Play,
  Copy,
} from "lucide-react";

interface Meeting {
  id: string;
  code: string;
  participants: number;
  maxParticipants: number;
  status: "Scheduled" | "In-Progress" | "Completed" | "Cancelled";
  meetLink: string;
  scheduledTime: string;
  duration: string;
  subject?: string;
}

const MeetingManagement: React.FC = () => {
  const [meetings] = useState<Meeting[]>([
    {
      id: "1",
      code: "M00001",

      participants: 4,
      maxParticipants: 4,
      status: "In-Progress",
      meetLink: "https://meet.google.com/abc-defg-hij",
      scheduledTime: "2024-01-15 08:00",
      duration: "2 hours",
      subject: "SWD392",
    },
    {
      id: "2",
      code: "M00002",

      participants: 4,
      maxParticipants: 4,
      status: "Scheduled",
      meetLink: "https://meet.google.com/xyz-uvwx-yzab",
      scheduledTime: "2024-01-15 14:00",
      duration: "1.5 hours",
      subject: "DBI202",
    },
    {
      id: "3",
      code: "M00003",

      participants: 4,
      maxParticipants: 4,
      status: "Completed",
      meetLink: "https://meet.google.com/pqr-stuv-wxyz",
      scheduledTime: "2024-01-14 10:00",
      duration: "3 hours",
      subject: "PRJ301",
    },
    {
      id: "4",
      code: "M00004",

      participants: 0,
      maxParticipants: 4,
      status: "Cancelled",
      meetLink: "https://meet.google.com/def-ghij-klmn",
      scheduledTime: "2024-01-15 16:00",
      duration: "1 hour",
    },
    {
      id: "5",
      code: "M00005",

      participants: 0,
      maxParticipants: 4,
      status: "Scheduled",
      meetLink: "https://meet.google.com/opq-rstu-vwxy",
      scheduledTime: "2024-01-16 09:00",
      duration: "2 hours",
      subject: "MAD101",
    },
  ]);

  const [selectedMeetings, setSelectedMeetings] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const itemsPerPage = 10;
  const totalMeetings = meetings.length;

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch = meeting.code
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMeetings = filteredMeetings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMeetings(paginatedMeetings.map((meeting) => meeting.id));
    } else {
      setSelectedMeetings([]);
    }
  };

  const handleSelectMeeting = (meetingId: string, checked: boolean) => {
    if (checked) {
      setSelectedMeetings([...selectedMeetings, meetingId]);
    } else {
      setSelectedMeetings(selectedMeetings.filter((id) => id !== meetingId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "In-Progress":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-500";
      case "In-Progress":
        return "bg-green-500";
      case "Completed":
        return "bg-gray-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const copyMeetLink = (link: string) => {
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  const joinMeeting = (link: string) => {
    window.open(link, "_blank");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Meeting Management
              </h1>
              <p className="text-gray-600 mt-1">
                Total: {totalMeetings} meetings
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <Plus className="w-4 h-4" />
                <span>New Meeting</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 flex-wrap gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by code, title, or host..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedMeetings.length === paginatedMeetings.length &&
                      paginatedMeetings.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Participants
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Meeting Link
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedMeetings.map((meeting) => (
                <tr
                  key={meeting.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedMeetings.includes(meeting.id)}
                      onChange={(e) =>
                        handleSelectMeeting(meeting.id, e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 text-lg">
                        {meeting.code}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(meeting.scheduledTime).toLocaleString()} (
                        {meeting.duration})
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="font-semibold text-gray-900">
                        {meeting.participants}
                      </span>
                      <span className="text-gray-500 text-sm">
                        / {meeting.maxParticipants}
                      </span>
                    </div>
                    <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{
                          width: `${
                            (meeting.participants / meeting.maxParticipants) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        meeting.status
                      )}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 ${getStatusDot(
                          meeting.status
                        )} rounded-full mr-1.5`}
                      ></div>
                      {meeting.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-gray-50 rounded-lg px-2 py-1">
                        <Link className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600 font-mono">
                          {meeting.meetLink.replace(
                            "https://meet.google.com/",
                            ""
                          )}
                        </span>
                      </div>
                      <button
                        onClick={() => copyMeetLink(meeting.meetLink)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                        title="Copy link"
                      >
                        <Copy className="w-3 h-3 text-gray-500" />
                      </button>
                      {meeting.status === "In-Progress" && (
                        <button
                          onClick={() => joinMeeting(meeting.meetLink)}
                          className="p-1 hover:bg-green-100 rounded transition-colors duration-200 text-green-600"
                          title="Join meeting"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActionMenu(
                            showActionMenu === meeting.id ? null : meeting.id
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>

                      {showActionMenu === meeting.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => joinMeeting(meeting.meetLink)}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Video className="w-4 h-4" />
                              <span>Join Meeting</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                              <Edit className="w-4 h-4" />
                              <span>Edit Meeting</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                              <Trash2 className="w-4 h-4" />
                              <span>Cancel Meeting</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredMeetings.length)} of{" "}
            {filteredMeetings.length} results
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === totalPages
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingManagement;
