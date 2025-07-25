import React from "react";
import { Eye } from "lucide-react";
import type { Test } from "../../types/examType";

interface TestCardProps {
  test: Test;
  onViewTest?: (test: Test) => void;
}

const TestCard: React.FC<TestCardProps> = ({ test, onViewTest }) => {
  const handleViewClick = () => {
    if (onViewTest) {
      onViewTest(test);
    }
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{test.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">ID - Mã test</span>
              <span className="text-gray-600">
                {test.id} - {test.code}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">Sinh viên</span>
              <span className="text-gray-600">{test.studentName}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">Điểm số</span>
              <span className="text-gray-600">
                {test.testsScores || "Chưa chấm"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-700">Báo cáo</span>
              <span
                className={`text-xs px-2 py-1 rounded-full w-fit ${
                  test.hasReport
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {test.hasReport ? "Có" : "Không"}
              </span>
            </div>
          </div>
          {test.content && (
            <div className="mt-2">
              <span className="font-medium text-gray-700 text-sm">
                Nội dung:
              </span>
              <p className="text-gray-600 text-sm mt-1">{test.content}</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={handleViewClick}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCard;
