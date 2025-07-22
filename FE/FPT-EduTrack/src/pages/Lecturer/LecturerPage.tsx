import { useState } from "react";
import LecturerSidebar from "../../components/LecturerComponent/LecturerSideBar";
import Header from "../../components/Header";
import LecturerExams from "../../components/LecturerComponent/LecturerExams";

export default function LecturerPage() {
  const [activeItem, setActiveItem] = useState("exams");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const getPageTitle = () => {
    return "Quản Lý Kỳ Thi";
  };

  const renderContent = () => {
    return <LecturerExams />;
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
