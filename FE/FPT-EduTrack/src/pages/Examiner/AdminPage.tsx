import { useState } from "react";
import Sidebar from "../../components/AdminComponent/AdminSideBar";
import Header from "../../components/Header";
import Dashboard from "../../components/AdminComponent/AdminDashboard";
import UserManagement from "../../components/AdminComponent/AdminUserManagement";
import ExamManagement from "../../components/AdminComponent/AdminExamManagement";
import TestManagement from "../../components/AdminComponent/AdminTestManagement";
import MeetingManagement from "../../components/AdminComponent/AdminMeetingManagement";
import RequestManagement from "../../components/AdminComponent/AdminRequestManagement";
export default function AdminPage() {
  const [activeItem, setActiveItem] = useState("overview");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const getPageTitle = () => {
    switch (activeItem) {
      case "overview":
        return "Admin Dashboard";
      case "account":
        return "User Management";
      case "exam":
        return "Exam Management";
      case "test":
        return "Test Management";
      case "request":
        return "Request Management";
      case "meeting":
        return "Meeting Management";
      default:
        return "Admin Dashboard";
    }
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
        return <RequestManagement />;
      case "meeting":
        return <MeetingManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
