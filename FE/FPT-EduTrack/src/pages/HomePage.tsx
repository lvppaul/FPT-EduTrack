import { useState } from "react";
import StudentSidebar from "../components/StudentComponent/StudentSideBar";
import Header from "../components/Header";
import StudentExams from "../components/StudentComponent/StudentExams";
import StudentAppeals from "../components/StudentComponent/StudentAppeals";

export default function HomePage() {
  const [activeItem, setActiveItem] = useState("exams");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const getPageTitle = () => {
    switch (activeItem) {
      case "exams":
        return "Kỳ Thi";
      case "appeals":
        return "Đơn Phúc Khảo";

      default:
        return "Kỳ Thi";
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "exams":
        return <StudentExams />;
      case "appeals":
        return <StudentAppeals />;

      default:
        return <StudentExams />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <StudentSidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
