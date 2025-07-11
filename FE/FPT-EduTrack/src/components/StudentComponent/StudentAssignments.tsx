import React from "react";
import { FileText, Calendar, CheckCircle } from "lucide-react";

const StudentAssignments: React.FC = () => {
  const assignments = [
    {
      id: 1,
      title: "Database Design Project",
      course: "DBI202",
      dueDate: "2025-07-15",
      status: "pending",
      priority: "high",
      description:
        "Design and implement a complete database system for a library management system.",
    },
    {
      id: 2,
      title: "Web API Development",
      course: "PRN231",
      dueDate: "2025-07-18",
      status: "in-progress",
      priority: "medium",
      description:
        "Create RESTful APIs using .NET Core for an e-commerce application.",
    },
    {
      id: 3,
      title: "Software Requirements Analysis",
      course: "SWD392",
      dueDate: "2025-07-20",
      status: "completed",
      priority: "low",
      description:
        "Analyze and document requirements for a student management system.",
    },
    {
      id: 4,
      title: "Mobile App UI Design",
      course: "PRM392",
      dueDate: "2025-07-22",
      status: "pending",
      priority: "medium",
      description:
        "Design user interfaces for a cross-platform mobile application.",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Assignments</h1>
        <p className="text-gray-600">
          Track your assignments and submission deadlines
        </p>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {assignment.title}
                  </h3>
                  <p className="text-sm text-gray-500">{assignment.course}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    assignment.status
                  )}`}
                >
                  {assignment.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    assignment.priority
                  )}`}
                >
                  {assignment.priority}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{assignment.description}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </div>

              <div className="flex space-x-2">
                {assignment.status === "completed" ? (
                  <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-200">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </button>
                ) : (
                  <>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                      Submit
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentAssignments;
