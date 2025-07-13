import React from "react";
import { BookOpen, Clock, Users } from "lucide-react";

const StudentCourses: React.FC = () => {
  const courses = [
    {
      id: 1,
      name: "Software Development Project",
      code: "SWD392",
      instructor: "Dr. Nguyen Van A",
      schedule: "Mon, Wed, Fri - 8:00 AM",
      progress: 75,
      students: 45,
      status: "active",
    },
    {
      id: 2,
      name: "Database Management Systems",
      code: "DBI202",
      instructor: "Prof. Tran Thi B",
      schedule: "Tue, Thu - 2:00 PM",
      progress: 60,
      students: 38,
      status: "active",
    },
    {
      id: 3,
      name: "Web Programming with .NET",
      code: "PRN231",
      instructor: "Dr. Le Van C",
      schedule: "Mon, Wed - 10:00 AM",
      progress: 85,
      students: 42,
      status: "active",
    },
    {
      id: 4,
      name: "Mobile Application Development",
      code: "PRM392",
      instructor: "Ms. Hoang Thi D",
      schedule: "Tue, Fri - 9:00 AM",
      progress: 45,
      students: 35,
      status: "active",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Courses</h1>
        <p className="text-gray-600">
          Track your enrolled courses and academic progress
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {course.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                Instructor: {course.instructor}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {course.schedule}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {course.students} students enrolled
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {course.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                View Course
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                Materials
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;
