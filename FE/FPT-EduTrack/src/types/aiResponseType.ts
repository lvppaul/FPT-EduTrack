// Interface mô tả payload cần gửi
export interface GradingFormPayload {
  guidelineFiles: File[];
  testFiles: File[];
  textInputValue: string;
}

// Interface mô tả response trả về
export interface GradingResponse {
  success: boolean;
  grading: {
    sessionId: string;
    timestamp: string;
    overallBand: number;
    criteria: Record<string, unknown>; // sẽ mở rộng nếu cần
    justification: string;
    source: string;
  };
  guidelineFilesProcessed: number;
  guidelineUploadedFiles: string[];
  originalGuidelineFileNames: string[];
  testFilesProcessed: number;
  testUploadedFiles: string[];
  originalTestFileNames: string[];
}
