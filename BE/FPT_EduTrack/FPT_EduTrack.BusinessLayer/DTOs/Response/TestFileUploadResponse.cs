using Microsoft.AspNetCore.Http;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class TestFileUploadResponse
    {
        public int TestId { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<FileUploadResponse> UploadedFiles { get; set; } = new();
        public int TotalFilesUploaded { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? Code { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public int? StudentId { get; set; }
        public int? ExamId { get; set; }
    }
}