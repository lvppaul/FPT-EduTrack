import { useState } from "react";
import StudentSidebar from "../components/StudentComponent/StudentSideBar";
import Header from "../components/Header";
import StudentTest from "../components/StudentComponent/StudentExams";
import StudentAppeals from "../components/StudentComponent/StudentAppeals";

export default function HomePage() {
  const [activeItem, setActiveItem] = useState("exams");

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const renderContent = () => {
    switch (activeItem) {
      case "exams":
        return <StudentTest />;
      case "appeals":
        return <StudentAppeals />;
      default:
        return <StudentTest />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <StudentSidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
