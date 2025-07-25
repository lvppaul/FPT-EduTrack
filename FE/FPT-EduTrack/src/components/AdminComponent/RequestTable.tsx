import React, { useState } from "react";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import type { Report } from "../../types/requestType";

interface RequestTableProps {
  requests: Report[];
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onViewDetail: (report: Report) => void;
}

const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  onDelete,
  onUpdateStatus,
  onViewDetail,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1: // Pending
        return "bg-yellow-100 text-yellow-800";
      case 2: // In Process
        return "bg-blue-100 text-blue-800";
      case 3: // Completed
        return "bg-green-100 text-green-800";
      case 4: // Rejected
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "Chờ xử lý";
      case 2:
        return "Đang xử lý";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Từ chối";
      default:
        return "Không xác định";
    }
  };

  const handleStatusChange = (id: string, newStatusId: number) => {
    onUpdateStatus(id, newStatusId.toString());
    setActiveDropdown(null);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sinh Viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mục Đích
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày Tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ghi Chú Xử Lý
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày Phản Hồi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr
                key={request.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.student?.fullname || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.student?.email || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {request.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {request.content || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      request.reportStatusId
                    )}`}
                  >
                    {getStatusText(request.reportStatusId)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  -
                </td>
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === request.id.toString()
                          ? null
                          : request.id.toString()
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>

                  {activeDropdown === request.id.toString() && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            onViewDetail(request);
                            setActiveDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </button>
                        <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <hr className="my-2" />
                        <div className="px-4 py-2">
                          <p className="text-xs text-gray-500 mb-2">
                            Change Status:
                          </p>
                          {[
                            { id: 1, name: "Chờ xử lý" },
                            { id: 2, name: "Đang xử lý" },
                            { id: 3, name: "Hoàn thành" },
                            { id: 4, name: "Từ chối" },
                          ].map((status) => (
                            <button
                              key={status.id}
                              onClick={() =>
                                handleStatusChange(
                                  request.id.toString(),
                                  status.id
                                )
                              }
                              className="w-full px-2 py-1 text-left text-sm text-gray-700 hover:bg-gray-100 rounded"
                            >
                              {status.name}
                            </button>
                          ))}
                        </div>
                        <hr className="my-2" />
                        <button
                          onClick={() => {
                            onDelete(request.id.toString());
                            setActiveDropdown(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestTable;
