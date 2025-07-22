export interface GradeSubmission {
  id: string;
  examId: string;
  examCode: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  lecturerId: string;
  lecturerName: string;
  subject: string;
  submittedScore: number;
  maxScore: number;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  comments?: string;
  appealCount?: number;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  status: "active" | "inactive";
  subjectsCount: number;
  studentsCount: number;
  averageRating: number;
}

export interface DepartmentStats {
  totalLecturers: number;
  pendingApprovals: number;
  approvedThisMonth: number;
  averageScore: number;
  totalExams: number;
  ongoingExams: number;
}

export interface UpcomingDeadline {
  title: string;
  date: string;
  count: number;
  priority: "high" | "medium" | "low";
}
