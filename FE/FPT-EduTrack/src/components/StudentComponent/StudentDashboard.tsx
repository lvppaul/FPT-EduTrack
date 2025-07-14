import React from "react";
import { BookOpen, Calendar, Award, Clock } from "lucide-react";

const StudentDashboard: React.FC = () => {
  const stats = [
    {
      title: "Enrolled Courses",
      value: "6",
      icon: BookOpen,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Upcoming Exams",
      value: "3",
      icon: Calendar,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Current GPA",
      value: "3.8",
      icon: Award,
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Study Hours",
      value: "42h",
      icon: Clock,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const recentCourses = [
    {
      name: "Software Development Project",
      code: "SWD392",
      progress: 75,
      nextClass: "Tomorrow 8:00 AM",
    },
    {
      name: "Database Management",
      code: "DBI202",
      progress: 60,
      nextClass: "Friday 2:00 PM",
    },
    {
      name: "Web Programming",
      code: "PRN231",
      progress: 85,
      nextClass: "Monday 10:00 AM",
    },
  ];

  const upcomingEvents = [
    {
      title: "Midterm Exam - SWD392",
      date: "Tomorrow",
      time: "9:00 AM",
      type: "exam",
    },
    {
      title: "Assignment Due - DBI202",
      date: "Friday",
      time: "11:59 PM",
      type: "assignment",
    },
    {
      title: "Group Meeting",
      date: "Saturday",
      time: "2:00 PM",
      type: "meeting",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Student!</h1>
        <p className="text-blue-100">
          Here's your academic progress and upcoming activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-xl p-6 border border-gray-100`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            My Courses
          </h3>
          <div className="space-y-4">
            {recentCourses.map((course, index) => (
              <div
                key={index}
                className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.name}</h4>
                    <p className="text-sm text-gray-500">{course.code}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {course.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Next class: {course.nextClass}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    event.type === "exam"
                      ? "bg-red-500"
                      : event.type === "assignment"
                      ? "bg-orange-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-500">
                    {event.date} at {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
