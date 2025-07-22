import http from "./axios";

export async function getTestsByExamIdAndStudentId(
  examId: number,
  studentId: number
) {
  try {
    const response = await http.get(
      `exams/${examId}/students/${studentId}/tests`
    );

    if (response.data.success) {
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    }
  } catch (error: unknown) {
    console.error("Login error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}
