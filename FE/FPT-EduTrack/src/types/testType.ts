export interface AssignLecturerDto {
  testId: number;
  lecturerId: number;
  score?: number;
  reason?: string;
  isGrading?: boolean;
}
