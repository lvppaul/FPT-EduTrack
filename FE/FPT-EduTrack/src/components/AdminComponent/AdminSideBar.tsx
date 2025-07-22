import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  MessageSquare,
  Building,
  UserCog,
  LogOut,
} from "lucide-react";
import AuthUtils from "../../utils/authUtils";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthUtils.clearAuthData();
    navigate("/login");
  };
  const menuItems = [
    {
      id: "overview",
      label: "Tổng Quan",
      icon: LayoutDashboard,
      description: "Dashboard và thống kê tổng quát",
    },
    {
      id: "account",
      label: "Quản Lý Người Dùng",
      icon: Users,
      description: "Quản lý tài khoản sinh viên, giảng viên",
    },
    {
      id: "exam",
      label: "Quản Lý Kỳ Thi",
      icon: FileText,
      description: "Tạo và quản lý các kỳ thi",
    },
    {
      id: "test",
      label: "Quản Lý Bài Test",
      icon: ClipboardCheck,
      description: "Quản lý các bài test trong kỳ thi gần nhất",
    },
    {
      id: "request",
      label: "Quản Lý Yêu Cầu",
      icon: MessageSquare,
      description: "Xử lý các yêu cầu từ người dùng",
    },
    {
      id: "meeting",
      label: "Quản Lý Cuộc Họp",
      icon: Building,
      description: "Tổ chức và quản lý cuộc họp",
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6 flex-1">
        {/* Logo/Brand Section */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">FPT</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">EduTrack</h2>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <div key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-gray-50 group ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                  <div className="flex-1">
                    <span className="font-medium text-sm">{item.label}</span>
                    {!isActive && (
                      <p className="text-xs text-gray-400 mt-0.5 group-hover:text-gray-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </nav>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-purple-900">
                Cần hỗ trợ?
              </h4>
              <p className="text-xs text-purple-700 mt-1">
                Liên hệ với bộ phận kỹ thuật để được hỗ trợ
              </p>
              <button className="mt-2 text-xs text-purple-600 hover:text-purple-800 font-medium">
                Liên hệ hỗ trợ →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
            <UserCog className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              Admin Name
            </p>
            <p className="text-xs text-gray-500 truncate">admin@fpt.edu.vn</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 group"
        >
          <LogOut size={20} className="text-red-500 group-hover:text-red-600" />
          <div className="flex-1">
            <div className="font-medium">Đăng xuất</div>
            <div className="text-xs text-red-400 mt-0.5">
              Thoát khỏi hệ thống
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
