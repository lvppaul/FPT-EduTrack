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
      trend: "up" as const,
      trendValue: "+5.2%",
    },
    {
      title: "Lecturers",
      value: "7,265",
      icon: GraduationCap,
      trend: "stable" as const,
      trendValue: "0%",
    },
    {
      title: "Head Of Department",
      value: "7,265",
      icon: UserCheck,
      trend: "up" as const,
      trendValue: "+2.1%",
    },
    {
      title: "Exams",
      value: "7,265",
      icon: FileText,
      trend: "up" as const,
      trendValue: "+12.5%",
    },
    {
      title: "Tests",
      value: "7,265",
      icon: BookOpen,
      trend: "down" as const,
      trendValue: "-3.2%",
    },
    {
      title: "Tests have a request",
      value: "7,265",
      icon: ClipboardList,
      trend: "up" as const,
      trendValue: "+8.4%",
    },
    {
      title: "In progress Meetings",
      value: "7,265",
      icon: Clock,
      trend: "stable" as const,
      trendValue: "0%",
    },
    {
      title: "Pending Request",
      value: "7,265",
      icon: Mail,
      trend: "down" as const,
      trendValue: "-1.8%",
    },
    {
      title: "Confirm Request",
      value: "7,265",
      icon: MessageCircle,
      trend: "up" as const,
      trendValue: "+15.3%",
    },
    {
      title: "Approved Request",
      value: "7,265",
      icon: CheckCircle,
      trend: "up" as const,
      trendValue: "+7.9%",
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
            trend={metric.trend}
            trendValue={metric.trendValue}
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
