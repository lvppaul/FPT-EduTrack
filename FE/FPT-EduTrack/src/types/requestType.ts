import type { User } from "./userType";
import type { Test } from "./examType";

export interface Report {
  id: number;
  title: string;
  content: string;
  isDeleted: boolean;
  isSecond: boolean;
  createdAt: string;
  studentId: number;
  student: User;
  testId: number;
  test: Test;
  reportStatusId: number;
}

export interface GetReportsResponse {
  success: boolean;
  message: string;
  data: Report[];
  count: number;
}

export interface CreateReportForm {
  title: string;
  content: string;
  studentId: number;
  testId: number;
}
