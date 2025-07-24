import { useState } from "react";
import Sidebar from "../../components/AdminComponent/AdminSideBar";
import Header from "../../components/Header";
import UserManagement from "../../components/AdminComponent/AdminUserManagement";
import ExamManagement from "../../components/AdminComponent/AdminExamManagement";
import MeetingManagement from "../../components/AdminComponent/AdminMeetingManagement";
import RequestManagement from "../../components/AdminComponent/AdminRequestManagement";
export default function AdminPage() {
  const [activeItem, setActiveItem] = useState("overview");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "account":
        return <UserManagement />;
      case "exam":
        return <ExamManagement />;
      case "test":
        return <RequestManagement />;
      case "meeting":
        return <MeetingManagement />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
