import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileCheck,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import AuthUtils from "../../utils/authUtils";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const HeadOfDepartmentSidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
}) => {
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
      id: "grade-approval",
      label: "Xác Nhận Điểm",
      icon: FileCheck,
      description: "Xác nhận điểm chấm từ giảng viên",
    },

    {
      id: "exams",
      label: "Quản Lý Kỳ Thi",
      icon: ClipboardCheck,
      description: "Theo dõi và quản lý kỳ thi",
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Trưởng Khoa</h2>
            <p className="text-sm text-gray-500">Quản lý khoa</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <IconComponent
                    size={20}
                    className={`${
                      isActive
                        ? "text-blue-700"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        isActive ? "text-blue-700" : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">TK</span>
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800 text-sm">Trưởng Khoa</div>
            <div className="text-xs text-gray-500">Đang hoạt động</div>
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

export default HeadOfDepartmentSidebar;
