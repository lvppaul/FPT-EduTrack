import type { AssignLecturerDto } from "../types/testType";
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

export async function getTestsByTestId(id: number) {
  try {
    const response = await http.get(`tests/${id}`);

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

export async function getTestsByStudentId(id: number) {
  try {
    const response = await http.get(`student/${id}/tests`);

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("getTestsByStudentId error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function upLoadTest(id: number, formData: FormData) {
  try {
    const response = await http.post(`exams/${id}/tests/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("upLoadTest error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function assignLecturerToTest(payload: AssignLecturerDto) {
  try {
    const response = await http.post(
      `/tests/assign-lecturer-in-test`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("assignLecturerToTest error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function getTestsByGradingLecturerId(
  id: number,
  isGrading: boolean
) {
  try {
    const response = await http.get(
      `tests/by-lecturer/${id}?isGrading=${isGrading == true}`
    );

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("getTestsByStudentId error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function updateTestScore(payload: AssignLecturerDto) {
  try {
    const response = await http.put(
      `tests/${payload.testId}/lecturer/${payload.lecturerId}`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error("Không cập nhật được điểm. Vui lòng thử lại.");
    }
  } catch (error: unknown) {
    console.error("updateTestScore error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}
