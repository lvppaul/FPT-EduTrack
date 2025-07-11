import React from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  MessageSquare,
  Building,
  UserCog,
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "account", label: "User Management", icon: Users },
    { id: "exam", label: "Exam Management", icon: FileText },
    { id: "test", label: "Test Management", icon: ClipboardCheck },
    { id: "request", label: "Request Management", icon: MessageSquare },
    { id: "meeting", label: "Meeting Management", icon: Building },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen border-r border-gray-200 flex flex-col">
      <div className="p-6 flex-1">
        {/* Logo/Brand Section */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">FPT</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">EduTrack</h2>
            <p className="text-xs text-gray-500">Admin Portal</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onItemClick(item.id)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Info Section */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
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
      </div>
    </div>
  );
};

export default AdminSidebar;
