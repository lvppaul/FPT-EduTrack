using FPT_EduTrack.BusinessLayer.DTOs.Response;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class TestUpdateResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public TestResponse? UpdatedTest { get; set; }
        public List<FileUploadResponse> NewFilesUploaded { get; set; } = new();
        public List<string> FilesRemoved { get; set; } = new();
        public int TotalNewFilesUploaded { get; set; }
        public int TotalFilesRemoved { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}