import http from "./axios";

export async function getRoomById(roomId: string) {
  try {
    const response = await http.get(`GoogleEventAPI/event/${roomId}`);

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("getRoomById error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}
