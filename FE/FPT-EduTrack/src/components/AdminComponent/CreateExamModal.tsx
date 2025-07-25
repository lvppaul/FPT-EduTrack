import React, { useState, useEffect } from "react";
import { X, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { AuthUtils } from "../../utils/authUtils";
import { createExam } from "../../service/examService";

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ExamCreateRequest {
  code: string;
  name: string;
  examinerId: number;
  duration: number;
  status: number;
}

interface FormErrors {
  code?: string;
  name?: string;
  duration?: string;
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ExamCreateRequest>({
    code: "",
    name: "",
    examinerId: 0, // Will be set from AuthUtils
    duration: 60,
    status: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Set examiner ID from current user when modal opens
  useEffect(() => {
    if (isOpen) {
      const currentUser = AuthUtils.getUserFromToken();
      if (currentUser) {
        setFormData((prev) => ({
          ...prev,
          examinerId: parseInt(currentUser.sub), // Convert sub to number
        }));
      }
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.code.trim()) {
      newErrors.code = "Mã kỳ thi là bắt buộc";
    } else if (formData.code.length < 3) {
      newErrors.code = "Mã kỳ thi phải có ít nhất 3 ký tự";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Tên kỳ thi là bắt buộc";
    } else if (formData.name.length < 3) {
      newErrors.name = "Tên kỳ thi phải có ít nhất 3 ký tự";
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = "Thời gian thi phải lớn hơn 0";
    } else if (formData.duration > 300) {
      newErrors.duration = "Thời gian thi không được vượt quá 300 phút";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const currentUser = AuthUtils.getUserFromToken();
    const examinerId = currentUser ? parseInt(currentUser.sub) : 0;

    try {
      setIsSubmitting(true);

      const examData = {
        ...formData,
        examinerId: examinerId,
      };
      console.log("Exam created successfully:", examData);
      await createExam(examData);
      console.log("Exam created successfully:", examData);

      // Show success notification
      setNotification({
        type: "success",
        message: "Tạo kỳ thi thành công!",
      });

      // Auto hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);

      resetForm();
      onClose();
      onSuccess();
    } catch (error: unknown) {
      console.error("Error creating exam:", error);

      // Show error notification
      setNotification({
        type: "error",
        message: "Có lỗi xảy ra khi tạo kỳ thi",
      });

      // Auto hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsSubmitting(false);
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
    const currentUser = AuthUtils.getUserFromToken();
    const examinerId = currentUser ? parseInt(currentUser.sub) : 0;

    setFormData({
      code: "",
      name: "",
      examinerId: examinerId,
      duration: 60,
      status: 0,
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
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-[60] p-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-80 ${
            notification.type === "success"
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span
            className={`text-sm font-medium flex-1 ${
              notification.type === "success"
                ? "text-green-800"
                : "text-red-800"
            }`}
          >
            {notification.message}
          </span>
          <button
            onClick={() => setNotification(null)}
            className={`text-gray-400 hover:text-gray-600 ${
              notification.type === "success"
                ? "hover:text-green-600"
                : "hover:text-red-600"
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            {errors.code && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.code}
              </div>
            )}
          </div>

          {/* Exam Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên kỳ thi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Nhập tên kỳ thi (VD: Thi cuối kỳ môn Toán)"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              disabled={isSubmitting}
            />
            {errors.duration && (
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.duration}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
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
