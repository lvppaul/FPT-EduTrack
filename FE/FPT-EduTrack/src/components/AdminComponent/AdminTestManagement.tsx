import React, { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
} from "lucide-react";

interface Test {
  id: string;
  code: string;
  examCode: string;
  student: string;
  score: number;
  maxScore: number;
  submittedAt?: string;
  hasRequest: boolean;
}

const TestManagement: React.FC = () => {
  const [tests] = useState<Test[]>([
    {
      id: "1",
      code: "111111",
      examCode: "SWD392_SP25_FE",
      student: "Phat Le",
      score: 9,
      maxScore: 10,
      submittedAt: "2024-01-15 14:30",
      hasRequest: false,
    },
    {
      id: "2",
      code: "222222",
      examCode: "SWD392_SP25_RE",
      student: "Thang Nguyen",
      score: 9,
      maxScore: 10,
      submittedAt: "2024-01-15 14:25",
      hasRequest: true,
    },
    {
      id: "3",
      code: "333333",
      examCode: "SWD392_SP25_RE",
      student: "Dinh Tran",
      score: 9,
      maxScore: 10,
      submittedAt: "2024-01-15 14:20",
      hasRequest: false,
    },
    {
      id: "4",
      code: "444444",
      examCode: "SWD392_SP25_FE",
      student: "Minh Hoang",
      score: 8,
      maxScore: 10,
      submittedAt: "2024-01-15 14:15",
      hasRequest: true,
    },
    {
      id: "5",
      code: "555555",
      examCode: "SWD392_SP25_FE",
      student: "Lan Pham",
      score: 7,
      maxScore: 10,
      hasRequest: false,
    },
  ]);

  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestFilter, setRequestFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  const itemsPerPage = 10;
  const totalTests = tests.length;

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.examCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRequest =
      requestFilter === "All" ||
      (requestFilter === "Has Request" && test.hasRequest) ||
      (requestFilter === "No Request" && !test.hasRequest);
    return matchesSearch && matchesRequest;
  });

  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTests = filteredTests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTests(paginatedTests.map((test) => test.id));
    } else {
      setSelectedTests([]);
    }
  };

  const handleSelectTest = (testId: string, checked: boolean) => {
    if (checked) {
      setSelectedTests([...selectedTests, testId]);
    } else {
      setSelectedTests(selectedTests.filter((id) => id !== testId));
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600 font-semibold";
    if (percentage >= 60) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Test Management
              </h1>
              <p className="text-gray-600 mt-1">Total: {totalTests} tests</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200">
                <Plus className="w-4 h-4" />
                <span>New Test</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 flex-wrap gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by code, exam, or student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Has Request:</span>
              <select
                value={requestFilter}
                onChange={(e) => setRequestFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All</option>
                <option value="Has Request">Has Request</option>
                <option value="No Request">No Request</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedTests.length === paginatedTests.length &&
                      paginatedTests.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Exam Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Score
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Request
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedTests.map((test) => (
                <tr
                  key={test.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test.id)}
                      onChange={(e) =>
                        handleSelectTest(test.id, e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {test.code}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 font-medium">
                      {test.examCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {test.student.charAt(0)}
                      </div>
                      <span className="text-gray-900">{test.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-lg font-bold ${getScoreColor(
                          test.score,
                          test.maxScore
                        )}`}
                      >
                        {test.score}
                      </span>
                      <span className="text-gray-500">/ {test.maxScore}</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                        <div
                          className={`h-2 rounded-full ${
                            (test.score / test.maxScore) * 100 >= 80
                              ? "bg-green-500"
                              : (test.score / test.maxScore) * 100 >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${(test.score / test.maxScore) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {test.hasRequest ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></div>
                        Has Request
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">No Request</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActionMenu(
                            showActionMenu === test.id ? null : test.id
                          )
                        }
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>

                      {showActionMenu === test.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                              <Edit className="w-4 h-4" />
                              <span>Edit Score</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                              <Download className="w-4 h-4" />
                              <span>Download</span>
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Test</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredTests.length)} of{" "}
            {filteredTests.length} results
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === totalPages
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestManagement;
