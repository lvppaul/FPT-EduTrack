import React, { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import NewRequestModal from "../AdminComponent/NewRequestModel";
import RequestTable from "../AdminComponent/RequestTable";
import type { Request } from "../../types/requestType";
const RequestManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [requests, setRequests] = useState<Request[]>([
    {
      id: "1",
      student: "Anh Le",
      purpose: "Tôi thấy...",
      createdDate: "22/11/2024",
      processNote: "Oke",
      status: "In Process",
      responseDate: "25/11/2024",
    },
    {
      id: "2",
      student: "Anh Nguyen",
      purpose: "Tôi thấy...",
      createdDate: "24/10/2024",
      processNote: "No Oke",
      status: "Completed",
      responseDate: "27/10/2024",
    },
  ]);

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === "All" || request.status === statusFilter;
    const matchesSearch =
      request.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddRequest = (newRequest: Omit<Request, "id">) => {
    const request: Request = {
      ...newRequest,
      id: Date.now().toString(),
    };
    setRequests([request, ...requests]);
    setIsModalOpen(false);
  };

  const handleDeleteRequest = (id: string) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

  const handleUpdateStatus = (id: string, status: Request["status"]) => {
    setRequests(
      requests.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Request Management
          </h1>
          <p className="text-gray-600 mt-1">
            Total: {requests.length} requests
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="Pending">Pending</option>
                  <option value="In Process">In Process</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <RequestTable
          requests={filteredRequests}
          onDelete={handleDeleteRequest}
          onUpdateStatus={handleUpdateStatus}
        />
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
