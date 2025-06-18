import React from "react";
import type { MetricCardProps } from "../types/dashboardType";

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-gray-700 font-medium text-sm">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;
