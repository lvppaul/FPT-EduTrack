import type { AxiosError } from "axios";
import type {
  GradingFormPayload,
  GradingResponse,
} from "../types/aiResponseType";
import http from "./axios";

export async function gradingByUsingAi(
  payload: GradingFormPayload
): Promise<GradingResponse> {
  try {
    const formData = new FormData();

    payload.guidelineFiles.forEach((file) => {
      formData.append("GuidelineFiles", file);
    });

    payload.testFiles.forEach((file) => {
      formData.append("TestFiles", file);
    });

    formData.append("TextInputValue", payload.textInputValue);

    const response = await http.post<GradingResponse>(
      "/Grading/upload-and-process",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200 && response.data.success) {
      return response.data;
    }

    throw new Error("Phân tích không thành công. Vui lòng thử lại.");
  } catch (error) {
    const err = error as AxiosError;

    if (err.response) {
      console.error("Lỗi phản hồi từ server:", err.response.data);
      throw new Error(
        `Server trả về lỗi: ${JSON.stringify(err.response.data)}`
      );
    } else if (err.request) {
      console.error("Không nhận được phản hồi:", err.request);
      throw new Error(
        "Không kết nối được tới máy chủ. Vui lòng kiểm tra mạng."
      );
    } else {
      console.error("Lỗi không xác định:", err.message);
      throw new Error(`Đã xảy ra lỗi: ${err.message}`);
    }
  }
}
