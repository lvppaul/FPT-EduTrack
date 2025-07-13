import { useState } from "react";
import LecturerSidebar from "../../components/LecturerComponent/LecturerSideBar";
import Header from "../../components/Header";
import LecturerExams from "../../components/LecturerComponent/LecturerExams";
import LecturerAppeals from "../../components/LecturerComponent/LecturerAppeals";
import LecturerMeetings from "../../components/LecturerComponent/LecturerMeetings";

export default function LecturerPage() {
  const [activeItem, setActiveItem] = useState("exams");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const getPageTitle = () => {
    switch (activeItem) {
      case "exams":
        return "Chấm Điểm Bài Thi";
      case "appeals":
        return "Xử Lý Đơn Phúc Khảo";
      case "meetings":
        return "Quản Lý Cuộc Họp";
      default:
        return "Chấm Điểm Bài Thi";
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "exams":
        return <LecturerExams />;
      case "appeals":
        return <LecturerAppeals />;
      case "meetings":
        return <LecturerMeetings />;
      default:
        return <LecturerExams />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <LecturerSidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
