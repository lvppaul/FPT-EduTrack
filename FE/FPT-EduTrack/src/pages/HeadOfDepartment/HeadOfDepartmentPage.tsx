import React, { useState } from "react";
import HeadOfDepartmentSidebar from "../../components/HeadOfDepartmentComponent/HeadOfDepartmentSideBar";
import HeadOfDepartmentDashboard from "../../components/HeadOfDepartmentComponent/HeadOfDepartmentDashboard";
import HeadOfDepartmentGradeApproval from "../../components/HeadOfDepartmentComponent/HeadOfDepartmentGradeApproval";
import Header from "../../components/Header";

const HeadOfDepartmentPage: React.FC = () => {
  const [activeItem, setActiveItem] = useState("overview");

  const getPageTitle = () => {
    switch (activeItem) {
      case "overview":
        return "Tổng Quan Khoa";
      case "grade-approval":
        return "Các Đơn Đang Chờ Xác Nhận Điểm";
      case "exams":
        return "Quản Lý Kỳ Thi";
      default:
        return "Dashboard Trưởng Khoa";
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case "overview":
        return <HeadOfDepartmentDashboard />;
      case "grade-approval":
        return <HeadOfDepartmentGradeApproval />;
      case "exams":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Quản Lý Kỳ Thi
            </h1>
            <p className="text-gray-600">
              Tính năng quản lý kỳ thi đang được phát triển...
            </p>
          </div>
        );

      default:
        return <HeadOfDepartmentDashboard />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <HeadOfDepartmentSidebar
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default HeadOfDepartmentPage;
