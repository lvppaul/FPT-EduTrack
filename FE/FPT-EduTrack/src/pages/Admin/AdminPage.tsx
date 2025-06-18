import React, { useState } from "react";
import Sidebar from "../../components/AdminComponent/AdminSideBar";
import Header from "../../components/Header";
import Dashboard from "../../components/AdminComponent/AdminDashboard";
import UserManagement from "../../components/AdminComponent/UserManagement";
import ExamManagement from "../../components/AdminComponent/AdminExamManagement";
import TestManagement from "../../components/AdminComponent/AdminTestManagement";
export default function AdminPage() {
  const [activeItem, setActiveItem] = useState("overview");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return <Dashboard />;
      case "account":
        return <UserManagement />;
      case "exam":
        return <ExamManagement />;
      case "test":
        return <TestManagement />;
      case "request":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Request Management
            </h2>
            <p className="text-gray-600">
              Request management features will be implemented here.
            </p>
          </div>
        );
      case "room":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Room Management
            </h2>
            <p className="text-gray-600">
              Room management features will be implemented here.
            </p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
