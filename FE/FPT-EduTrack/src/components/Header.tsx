import React, { useState } from "react";
import { Bell, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, handleLogout } = useAuth();

  const handleLogoutClick = () => {
    handleLogout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role?.toLowerCase()) {
      case "examiner":
        return "Examiner";
      case "student":
        return "Student";
      case "lecturer":
        return "Lecturer";
      case "headofdepartment":
        return "Head of Department";
      default:
        return "User";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4"></div>

        <div className="flex items-center space-x-4">
          {/* Notification Button */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings Button */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {user?.sub || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleDisplayName(user?.Role || "")}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Overlay to close dropdown when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>

                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-2">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.sub || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getRoleDisplayName(user?.Role || "")}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <User className="w-4 h-4 mr-3" />
                      View Profile
                    </button>

                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>

                    <hr className="my-2 border-gray-100" />

                    {/* Logout Button */}
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
