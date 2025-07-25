import http from "./axios";

export async function getReportsPagination(
  PageNumber: number,
  PageSize: number
) {
  try {
    const response = await http.get(
      `Report?PageNumber=${PageNumber}&PageSize=${PageSize}`
    );

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("Get Reports error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function getReports() {
  try {
    const response = await http.get(`Report`);

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("Get Reports error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}
export async function getReportsByLecturer(lecturerId: number) {
  try {
    const response = await http.get(`Report/lecturer/${lecturerId}`);

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("Get Reports error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function getReportsToConfirm() {
  try {
    const response = await http.get(`Report/to-confirmed`);

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("getReportsConfirmed error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function approveReport(reportId: number) {
  try {
    const response = await http.put(`Report/to-confirmed/${reportId}`);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error("Không thể phê duyệt báo cáo. Vui lòng thử lại.");
    }
  } catch (error: unknown) {
    console.error("approveReport error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function rejectReport(reportId: number) {
  try {
    const response = await http.put(`Report/to-rejected/${reportId}`);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error("Không thể từ chối báo cáo. Vui lòng thử lại.");
    }
  } catch (error: unknown) {
    console.error("rejectReport error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}
export async function GradingReport(reportId: number) {
  try {
    const response = await http.put(`Report/to-grading/${reportId}`);

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error("Không thể từ chối báo cáo. Vui lòng thử lại.");
    }
  } catch (error: unknown) {
    console.error("GradingReport error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}
