import React, { useState } from "react";
import HeadOfDepartmentSidebar from "../../components/HeadOfDepartmentComponent/HeadOfDepartmentSideBar";
import HeadOfDepartmentGradeApproval from "../../components/HeadOfDepartmentComponent/HeadOfDepartmentGradeApproval";
import Header from "../../components/Header";

const HeadOfDepartmentPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState("grade-approval");

  const renderContent = () => {
    return <HeadOfDepartmentGradeApproval />;
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <HeadOfDepartmentSidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default HeadOfDepartmentPage;
