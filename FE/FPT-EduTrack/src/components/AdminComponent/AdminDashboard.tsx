import React from "react";
import MetricCard from "../MetricCard";
import {
  Users,
  GraduationCap,
  UserCheck,
  FileText,
  BookOpen,
  ClipboardList,
  Mail,
  CheckCircle,
  Clock,
  MessageCircle,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const metrics = [
    {
      title: "Students",
      value: "7,265",
      icon: Users,
    },
    {
      title: "Lecturers",
      value: "7,265",
      icon: GraduationCap,
    },
    {
      title: "Head Of Department",
      value: "7,265",
      icon: UserCheck,
    },
    {
      title: "Exams",
      value: "7,265",
      icon: FileText,
    },
    {
      title: "Tests",
      value: "7,265",
      icon: BookOpen,
    },
    {
      title: "Tests have a request",
      value: "7,265",
      icon: ClipboardList,
    },
    {
      title: "In progress Meetings",
      value: "7,265",
      icon: Clock,
    },
    {
      title: "Pending Request",
      value: "7,265",
      icon: Mail,
    },
    {
      title: "Confirm Request",
      value: "7,265",
      icon: MessageCircle,
    },
    {
      title: "Approved Request",
      value: "7,265",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                New student registration completed
              </p>
              <p className="text-xs text-gray-500">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Exam schedule updated
              </p>
              <p className="text-xs text-gray-500">5 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Room booking request pending
              </p>
              <p className="text-xs text-gray-500">10 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
