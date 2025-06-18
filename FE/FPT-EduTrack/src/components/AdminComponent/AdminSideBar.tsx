import React from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  MessageSquare,
  Building,
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
    <div className="w-64 bg-white shadow-lg h-full border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-8">Dashboard</h2>
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
    </div>
  );
};

export default AdminSidebar;
