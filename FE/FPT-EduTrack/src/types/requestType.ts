export interface Report {
  id: number;
  title: string;
  content: string;
  isDeleted: boolean;
  isSecond: boolean;
  createdAt: string; // ISO string
  studentId: number;
  studentName: string;
  studentEmail: string;
  reportStatusId: number;
  testId: number;
  testCode: string;
  testTitle: string;
  testContent: string;
  testLink: string;
}

export interface GetReportsResponse {
  success: boolean;
  message: string;
  data: Report[];
  count: number;
}
