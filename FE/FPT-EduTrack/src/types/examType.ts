export interface Lecturer {
  id: number;
  email: string;
  fullname: string;
  createdAt: string;
  isActive: boolean;
  isDeleted: boolean;
  roleId: number;
  roleName: string;
}

export interface LecturersTestsDetailResponse {
  testId: number;
  lecturerId: number;
  score: number;
  reason: string;
  isGrading: boolean;
  lecturer: Lecturer;
}

export interface Test {
  id: number;
  code: string;
  title: string;
  content: string;
  link: string;
  examId: number;
  studentId: number;
  studentName: string;
  hasReport: boolean;
  testsScores: number;
  isDeleted: boolean;
  lecturersTestsDetailResponse: LecturersTestsDetailResponse[];
}

export interface Exam {
  id: number;
  code: string;
  createdAt: string;
  name: string;
  examinerId: number;
  examinerName: string;
  status: string;
  duration: number | null;
  isDeleted: boolean | null;
  test: Test[];
}
export interface ExamResponse {
  success: boolean;
  message: string;
  data: Exam[];
  count: number;
}
