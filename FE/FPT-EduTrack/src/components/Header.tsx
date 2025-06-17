import React from "react";
import { Bell, Settings, User } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
