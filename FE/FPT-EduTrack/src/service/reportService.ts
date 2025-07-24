import http from "./axios";

export async function getReports(PageNumber: number, PageSize: number) {
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
