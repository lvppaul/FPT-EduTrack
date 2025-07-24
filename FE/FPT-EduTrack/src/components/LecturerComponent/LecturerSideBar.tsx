import React from "react";
import { MessageSquare, GraduationCap } from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const LecturerSidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
}) => {
  const menuItems = [
    {
      id: "grading",
      label: "Các Bài Cần Chấm",
      icon: GraduationCap,
      description: "Bài Thi cần chấm điểm",
    },
    {
      id: "re-grading",
      label: "Các Bài Cần Chấm Lại",
      icon: GraduationCap,
      description: "Các Bài cần chấm lại",
    },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6 flex-1">
        {/* Logo/Brand Section */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">FPT</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">EduTrack</h2>
            <p className="text-xs text-gray-500">Lecturer Portal</p>
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
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
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
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <div className="flex items-start space-x-3">
            <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-900">
                Cần hỗ trợ?
              </h4>
              <p className="text-xs text-green-700 mt-1">
                Liên hệ với bộ phận kỹ thuật để được hỗ trợ
              </p>
              <a
                href="https://daihoc.fpt.edu.vn/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-xs text-green-600 hover:text-green-800 font-medium"
              >
                Liên hệ hỗ trợ →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerSidebar;
