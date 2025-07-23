import React, { useEffect, useState, useCallback } from "react";
import { Plus, Search, Filter } from "lucide-react";
import NewRequestModal from "../AdminComponent/NewRequestModel";
import RequestTable from "../AdminComponent/RequestTable";
import Pagination from "../Pagination";
import type { GetReportsResponse } from "../../types/requestType";
import { getReports } from "../../service/reportService";

const RequestManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<GetReportsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReports(currentPage, itemsPerPage);
      setRequests(response);
    } catch (error) {
      console.error("Lỗi khi fetch reports:", error);
      setRequests({
        success: false,
        message: "Error fetching reports",
        data: [],
        count: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // CRUD handlers
  const handleDeleteRequest = async (id: string) => {
    try {
      // Add delete API call here
      console.log("Delete request:", id);
      await fetchRequests(); // Refresh data
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      // Add update status API call here
      console.log("Update status:", id, status);
      await fetchRequests(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleAddRequest = async (requestData: Record<string, unknown>) => {
    try {
      // Add create request API call here
      console.log("Add request:", requestData);
      await fetchRequests(); // Refresh data
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding request:", error);
    }
  };

  const totalPages = requests ? Math.ceil(requests.count / itemsPerPage) : 0;

  // Client-side filtering (if needed)
  const filteredRequests = (requests?.data || []).filter((request) => {
    const matchesStatus =
      statusFilter === "All" ||
      request.reportStatusId.toString() === statusFilter;

    const matchesSearch =
      request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản Lý Yêu Cầu
              </h1>
              <p className="text-gray-600 mt-1">
                Tổng cộng: {requests?.count} yêu cầu
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Yêu Cầu Mới</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm yêu cầu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">Tất cả</option>
                <option value="1">Chờ xử lý</option>
                <option value="2">Đang xử lý</option>
                <option value="3">Hoàn thành</option>
                <option value="4">Từ chối</option>
              </select>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : (
            <RequestTable
              requests={filteredRequests}
              onDelete={handleDeleteRequest}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
        </div>

        {/* Pagination */}
        {requests && requests.count > 0 && !loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={requests.count}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      <NewRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddRequest}
      />
    </div>
  );
};

export default RequestManagement;
