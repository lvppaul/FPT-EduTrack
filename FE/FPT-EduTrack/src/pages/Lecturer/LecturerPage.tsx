import { useState } from "react";
import LecturerSidebar from "../../components/LecturerComponent/LecturerSideBar";
import Header from "../../components/Header";
import LecturerGradingTest from "../../components/LecturerComponent/LecturerGradingTest";

export default function LecturerPage() {
  const [activeItem, setActiveItem] = useState("grading");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const renderContent = () => {
    return <LecturerGradingTest />;
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <LecturerSidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
