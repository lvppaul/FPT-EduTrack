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
        return "Tổng Quan Hệ Thống";
      case "account":
        return "Quản Lý Người Dùng";
      case "exam":
        return "Quản Lý Kỳ Thi";
      case "test":
        return "Quản Lý Bài Test";
      case "request":
        return "Quản Lý Yêu Cầu";
      case "meeting":
        return "Quản Lý Cuộc Họp";
      default:
        return "Tổng Quan Hệ Thống";
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
