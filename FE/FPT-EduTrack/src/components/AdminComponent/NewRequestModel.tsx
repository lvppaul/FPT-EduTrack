import React, { useState } from "react";
import { X } from "lucide-react";
import type { Request } from "../../types/requestType";

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Omit<Request, "id">) => void;
}

const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    student: "",
    purpose: "",
    processNote: "",
    status: "Pending" as Request["status"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: Omit<Request, "id"> = {
      ...formData,
      createdDate: new Date().toLocaleDateString("en-GB"),
      responseDate: "",
    };

    onSubmit(newRequest);
    setFormData({
      student: "",
      purpose: "",
      processNote: "",
      status: "Pending",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Create New Request
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="student"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Student Name
            </label>
            <input
              type="text"
              id="student"
              name="student"
              value={formData.student}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter student name"
            />
          </div>

          <div>
            <label
              htmlFor="purpose"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Purpose
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the purpose of the request"
            />
          </div>

          <div>
            <label
              htmlFor="processNote"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Process Note
            </label>
            <input
              type="text"
              id="processNote"
              name="processNote"
              value={formData.processNote}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any processing notes"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Initial Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Pending">Pending</option>
              <option value="In Process">In Process</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRequestModal;
