/**
 * Kỳ thi đang diễn ra, học sinh/sinh viên đang làm bài
 * Kỳ thi đã hoàn tất, không còn hoạt động thi cử nào
 * Bài thi đang được chấm điểm bởi ban tổ chức
 * Kết quả kỳ thi đã được công bố cho học sinh/sinh viên
 * Học sinh/sinh viên đã yêu cầu xem xét lại điểm số, và ban tổ chức đang xử lý các yêu cầu này
 * Kỳ thi đã bị hoãn hoặc được lên lịch lại do một số lý do (thời tiết, vấn đề kỹ thuật, v.v.)
 * Kỳ thi đã bị hủy hoàn toàn và sẽ không được tổ chức
 */
export type ExamStatus = "0" | "1" | "2" | "3" | "4" | "5" | "6";

export const ExamStatus = {
  InProgress: "0" as ExamStatus,
  Completed: "1" as ExamStatus,
  Grading: "2" as ExamStatus,
  ResultsPublished: "3" as ExamStatus,
  UnderReview: "4" as ExamStatus,
  Postponed: "5" as ExamStatus,
  Cancelled: "6" as ExamStatus,
};
