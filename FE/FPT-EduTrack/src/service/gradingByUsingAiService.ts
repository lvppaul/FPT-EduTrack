export async function gradingByUsingAi(payload: CreateReportForm) {
  try {
    const response = await http.post(`Report`, payload);

    // Check for successful response (201 status for created resources)
    if (response.status === 201 || response.data.success || response.data) {
      return response.data;
    } else {
      throw new Error("Không thể tạo đơn phúc khảo. Vui lòng thử lại.");
    }
  } catch (error: unknown) {
    console.error("createReport error:", error);
    throw new Error("Có lỗi xảy ra khi tạo đơn phúc khảo. Vui lòng thử lại.");
  }
}
