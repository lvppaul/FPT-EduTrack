import type { CreateMeetingsRequest } from "../types/meetingType";
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
export async function createGoogleEvent(eventData: CreateMeetingsRequest) {
  try {
    const response = await http.post(
      "GoogleEventAPI/create-meeting",
      eventData
    );

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("createGoogleEvent error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}

export async function getMeetings() {
  try {
    const response = await http.get(`GoogleEventAPI/events-organized`);

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("getMeetings error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}
export async function updateMeetingStatus(meetingId: string, statusId: number) {
  try {
    const response = await http.put(
      `GoogleEventAPI/meeting/${meetingId}/status/${statusId}`
    );

    if (response.data.success) {
      return response.data;
    }
  } catch (error: unknown) {
    console.error("updateMeetingStatus ggAuthService error:", error);
    throw new Error(
      "Lỗi không xác định. Vui lòng kiểm tra kết nối và thử lại."
    );
  }
}
