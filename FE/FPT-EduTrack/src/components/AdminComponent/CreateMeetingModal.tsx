import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, Users, FileText, Mail } from "lucide-react";
import type {
  CreateMeetingsRequest,
  AttendeeEmail,
} from "../../types/meetingType";
import type { User } from "../../types/userType";
import { createGoogleEvent } from "../../service/googleAuthService";
import { getAllLecturers, getAllStudents } from "../../service/userService";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    summary: "",
    description: "",
    startTime: "",
    endTime: "",
  });

  const [lecturers, setLecturers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedLecturers, setSelectedLecturers] = useState<number[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const [lecturersResponse, studentsResponse] = await Promise.all([
        getAllLecturers(),
        getAllStudents(),
      ]);

      if (lecturersResponse?.data) {
        setLecturers(lecturersResponse.data);
      }
      if (studentsResponse?.data) {
        setStudents(studentsResponse.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Không thể tải danh sách người dùng");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLecturerSelect = (lecturerId: number) => {
    setSelectedLecturers((prev) =>
      prev.includes(lecturerId)
        ? prev.filter((id) => id !== lecturerId)
        : [...prev, lecturerId]
    );
  };

  const handleStudentSelect = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.summary.trim()) {
      setError("Vui lòng nhập tiêu đề cuộc họp");
      return;
    }

    if (!formData.startTime || !formData.endTime) {
      setError("Vui lòng chọn thời gian bắt đầu và kết thúc");
      return;
    }

    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      setError("Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    if (selectedLecturers.length === 0 && selectedStudents.length === 0) {
      setError("Vui lòng chọn ít nhất một người tham gia");
      return;
    }

    try {
      setIsLoading(true);

      // Combine selected lecturers and students emails
      const selectedLecturerEmails = lecturers
        .filter((lecturer) => selectedLecturers.includes(lecturer.id))
        .map((lecturer) => ({ email: lecturer.email }));

      const selectedStudentEmails = students
        .filter((student) => selectedStudents.includes(student.id))
        .map((student) => ({ email: student.email }));

      const attendeeEmails: AttendeeEmail[] = [
        ...selectedLecturerEmails,
        ...selectedStudentEmails,
      ];

      const meetingRequest: CreateMeetingsRequest = {
        summary: formData.summary.trim(),
        description: formData.description.trim(),
        startTime: {
          dateTime: new Date(formData.startTime).toISOString(),
        },
        endTime: {
          dateTime: new Date(formData.endTime).toISOString(),
        },
        attendeeEmails,
      };

      await createGoogleEvent(meetingRequest);

      // Reset form
      setFormData({
        summary: "",
        description: "",
        startTime: "",
        endTime: "",
      });
      setSelectedLecturers([]);
      setSelectedStudents([]);

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create meeting:", error);
      setError("Có lỗi xảy ra khi tạo cuộc họp. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        summary: "",
        description: "",
        startTime: "",
        endTime: "",
      });
      setSelectedLecturers([]);
      setSelectedStudents([]);
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Create New Meeting
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Meeting Title */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Meeting Title *
            </label>
            <input
              type="text"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="Enter meeting title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 mr-2" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter meeting description..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Start Time *
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                End Time *
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">
                Select Attendees *
              </h3>
            </div>

            {isLoadingUsers ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Loading users...
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lecturers */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Lecturers ({selectedLecturers.length} selected)
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                    {lecturers.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No lecturers available
                      </div>
                    ) : (
                      lecturers.map((lecturer) => (
                        <label
                          key={lecturer.id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLecturers.includes(lecturer.id)}
                            onChange={() => handleLecturerSelect(lecturer.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            disabled={isLoading}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {lecturer.fullname}
                            </div>
                            <div className="text-xs text-gray-500">
                              {lecturer.email}
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Students */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Students ({selectedStudents.length} selected)
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-40 overflow-y-auto">
                    {students.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500 text-center">
                        No students available
                      </div>
                    ) : (
                      students.map((student) => (
                        <label
                          key={student.id}
                          className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => handleStudentSelect(student.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-3"
                            disabled={isLoading}
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {student.fullname}
                            </div>
                            <div className="text-xs text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {(selectedLecturers.length > 0 || selectedStudents.length > 0) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Mail className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Selected Attendees Summary
                  </h4>
                  <p className="text-sm text-blue-700">
                    {selectedLecturers.length} lecturer(s) and{" "}
                    {selectedStudents.length} student(s) will be invited to this
                    meeting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isLoadingUsers}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg transition-colors duration-200 disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Meeting"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeetingModal;
