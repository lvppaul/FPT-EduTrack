import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Award,
} from "lucide-react";

interface Lecturer {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  status: "active" | "inactive";
  subjectsCount: number;
  studentsCount: number;
  averageRating: number;
}

const HeadOfDepartmentLecturerManagement: React.FC = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [filteredLecturers, setFilteredLecturers] = useState<Lecturer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  // Mock data - thay thế bằng API call thực tế
  useEffect(() => {
    const mockData: Lecturer[] = [
      {
        id: "1",
        name: "TS. Trần Thị Bình",
        email: "binh.tran@fpt.edu.vn",
        phone: "0912345678",
        department: "Công nghệ phần mềm",
        position: "Tiến sĩ",
        joinDate: "2020-01-15",
        status: "active",
        subjectsCount: 3,
        studentsCount: 120,
        averageRating: 4.5,
      },
      {
        id: "2",
        name: "ThS. Phạm Văn Cường",
        email: "cuong.pham@fpt.edu.vn",
        phone: "0987654321",
        department: "Công nghệ phần mềm",
        position: "Thạc sĩ",
        joinDate: "2019-08-20",
        status: "active",
        subjectsCount: 2,
        studentsCount: 85,
        averageRating: 4.2,
      },
      {
        id: "3",
        name: "TS. Nguyễn Minh Đức",
        email: "duc.nguyen@fpt.edu.vn",
        phone: "0969696969",
        department: "Công nghệ phần mềm",
        position: "Tiến sĩ",
        joinDate: "2018-03-10",
        status: "inactive",
        subjectsCount: 4,
        studentsCount: 150,
        averageRating: 4.7,
      },
    ];

    setLecturers(mockData);
    setFilteredLecturers(mockData);
  }, []);

  // Filter lecturers
  useEffect(() => {
    let filtered = lecturers;

    if (searchTerm) {
      filtered = filtered.filter(
        (lecturer) =>
          lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lecturer.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (lecturer) => lecturer.status === statusFilter
      );
    }

    setFilteredLecturers(filtered);
  }, [searchTerm, statusFilter, lecturers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Đang hoạt động
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Tạm nghỉ
          </span>
        );
      default:
        return null;
    }
  };

  const handleViewDetails = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quản Lý Giảng Viên
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin và hoạt động của giảng viên trong khoa
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Thêm giảng viên
        </button>
      </div>

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
                placeholder="Tìm kiếm theo tên, email, chức vụ..."
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
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm nghỉ</option>
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
              <Filter size={16} />
              Lọc
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng giảng viên</p>
              <p className="text-xl font-bold text-gray-900">
                {lecturers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Đang hoạt động</p>
              <p className="text-xl font-bold text-gray-900">
                {lecturers.filter((l) => l.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tiến sĩ</p>
              <p className="text-xl font-bold text-gray-900">
                {lecturers.filter((l) => l.position.includes("TS")).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Thạc sĩ</p>
              <p className="text-xl font-bold text-gray-900">
                {lecturers.filter((l) => l.position.includes("ThS")).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lecturers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chức vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số môn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLecturers.map((lecturer) => (
                <tr key={lecturer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {lecturer.name.split(" ").slice(-1)[0].charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {lecturer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Từ {formatDate(lecturer.joinDate)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Mail size={14} />
                        {lecturer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone size={14} />
                        {lecturer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {lecturer.position}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lecturer.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {lecturer.subjectsCount} môn học
                    </div>
                    <div className="text-sm text-gray-500">
                      {lecturer.studentsCount} sinh viên
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium text-gray-900">
                        {lecturer.averageRating}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(lecturer.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(lecturer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedLecturer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Chi tiết giảng viên
              </h3>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <p className="text-gray-900">{selectedLecturer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chức vụ
                  </label>
                  <p className="text-gray-900">{selectedLecturer.position}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedLecturer.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <p className="text-gray-900">{selectedLecturer.phone}</p>
                </div>
              </div>

              {/* Department Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khoa
                </label>
                <p className="text-gray-900">{selectedLecturer.department}</p>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedLecturer.subjectsCount}
                  </div>
                  <div className="text-sm text-gray-600">Môn học</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedLecturer.studentsCount}
                  </div>
                  <div className="text-sm text-gray-600">Sinh viên</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {selectedLecturer.averageRating}
                  </div>
                  <div className="text-sm text-gray-600">Đánh giá TB</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedLecturer(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Đóng
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadOfDepartmentLecturerManagement;
