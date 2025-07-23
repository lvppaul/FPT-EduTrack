import React, { useState } from "react";
import { X, Calendar, Clock, Users, FileText, AlertCircle } from "lucide-react";

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (examData: ExamCreateRequest) => void;
  isLoading?: boolean;
}

interface ExamCreateRequest {
  code: string;
  duration: number;
  description?: string;
  startTime?: string;
  endTime?: string;
  maxAttempts?: number;
  passingScore?: number;
}

interface FormErrors {
  code?: string;
  duration?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  maxAttempts?: string;
  passingScore?: string;
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<ExamCreateRequest>({
    code: "",
    duration: 60,
    description: "",
    startTime: "",
    endTime: "",
    maxAttempts: 1,
    passingScore: 70,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.code.trim()) {
      newErrors.code = "Mã kỳ thi là bắt buộc";
    } else if (formData.code.length < 3) {
      newErrors.code = "Mã kỳ thi phải có ít nhất 3 ký tự";
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Thời gian thi phải lớn hơn 0";
    } else if (formData.duration > 300) {
      newErrors.duration = "Thời gian thi không được vượt quá 300 phút";
    }

    if (formData.maxAttempts && formData.maxAttempts <= 0) {
      newErrors.maxAttempts = "Số lần thi phải lớn hơn 0";
    }

    if (
      formData.passingScore &&
      (formData.passingScore < 0 || formData.passingScore > 100)
    ) {
      newErrors.passingScore = "Điểm đạt phải từ 0 đến 100";
    }

    // Date validation
    if (formData.startTime && formData.endTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);
      if (startDate >= endDate) {
        newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (
    field: keyof ExamCreateRequest,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      duration: 60,
      description: "",
      startTime: "",
      endTime: "",
      maxAttempts: 1,
      passingScore: 70,
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Tạo kỳ thi mới
              </h2>
              <p className="text-sm text-gray-500">Nhập thông tin kỳ thi</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Exam Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mã kỳ thi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              placeholder="Nhập mã kỳ thi (VD: EXAM001)"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                errors.code ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.code && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.code}
              </div>
            )}
          </div>

          {/* Duration and Basic Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Thời gian thi (phút) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  handleInputChange("duration", parseInt(e.target.value) || 0)
                }
                placeholder="60"
                min="1"
                max="300"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.duration ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.duration && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.duration}
                </div>
              )}
            </div>

            {/* Max Attempts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Số lần thi tối đa
              </label>
              <input
                type="number"
                value={formData.maxAttempts}
                onChange={(e) =>
                  handleInputChange(
                    "maxAttempts",
                    parseInt(e.target.value) || 1
                  )
                }
                placeholder="1"
                min="1"
                max="10"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.maxAttempts ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.maxAttempts && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.maxAttempts}
                </div>
              )}
            </div>
          </div>

          {/* Passing Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Điểm đạt (%)
            </label>
            <input
              type="number"
              value={formData.passingScore}
              onChange={(e) =>
                handleInputChange(
                  "passingScore",
                  parseInt(e.target.value) || 70
                )
              }
              placeholder="70"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                errors.passingScore ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.passingScore && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.passingScore}
              </div>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Thời gian bắt đầu
              </label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange("startTime", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                disabled={isLoading}
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Thời gian kết thúc
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleInputChange("endTime", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  errors.endTime ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.endTime && (
                <div className="flex items-center mt-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.endTime}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả kỳ thi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Nhập mô tả chi tiết về kỳ thi..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo...
                </>
              ) : (
                "Tạo kỳ thi"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamModal;
