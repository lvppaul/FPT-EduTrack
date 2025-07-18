import http from "./axios";

export async function getExams() {
  try {
    const response = await http.get(`Exam`);

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
