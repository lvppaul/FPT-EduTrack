import http from "./axios";

export async function getPaginateExams(pageNumber = 1, pageSize = 10) {
  try {
    const response = await http.get(`Exam`, {
      params: {
        PageNumber: pageNumber,
        PageSize: pageSize,
      },
    });

    if (response.data?.success) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Không lấy được dữ liệu từ máy chủ."
      );
    }
  } catch (error: unknown) {
    console.error("Lỗi khi gọi API getExams:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối mạng và thử lại."
    );
  }
}

export async function getExams() {
  try {
    const response = await http.get(`Exam`);
    if (response.data?.success) {
      return response.data;
    } else {
      throw new Error(
        response.data?.message || "Không lấy được dữ liệu từ máy chủ."
      );
    }
  } catch (error: unknown) {
    console.error("Lỗi khi gọi API getExams:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối mạng và thử lại."
    );
  }
}

export async function getExamById(id: number) {
  try {
    const response = await http.get(`Exam/${id}`);

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("Login error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function updateExam(
  id: number,
  data: {
    code: string;
    name: string;
    examinerId: number;
    duration: number;
    status: number;
  }
) {
  try {
    const response = await http.put(`Exam/${id}`, data);

    if (response.data.success) {
      return response.data;
    }

    throw new Error("Cập nhật thất bại.");
  } catch (error: unknown) {
    console.error("Update Exam error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function deleteExam(id: number) {
  try {
    const response = await http.delete(`Exam/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete Exam error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function createExam(data: {
  code: string;
  name: string;
  examinerId: number;
  duration: number;
  status: number;
}) {
  try {
    const response = await http.post("Exam", data);

    if (response.data.success) {
      return response.data;
    }

    throw new Error("Tạo bài thi thất bại.");
  } catch (error: unknown) {
    console.error("Create Exam error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function updateExamStatus(examId: number, status: number) {
  try {
    const response = await http.put(`Exam/${examId}/status/${status}`);

    if (response.data.success) {
      return response.data;
    }

    throw new Error("Cập nhật trạng thái thất bại.");
  } catch (error: unknown) {
    console.error("Update Exam Status error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}
