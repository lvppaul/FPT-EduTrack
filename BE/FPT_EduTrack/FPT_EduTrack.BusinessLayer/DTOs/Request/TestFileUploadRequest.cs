using Microsoft.AspNetCore.Http;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class TestFileUploadRequest
    {
        public List<IFormFile> Files { get; set; } = new();
        public string? Description { get; set; }
        public string? Code { get; set; }
        public string? Title { get; set; }
        public int? StudentId { get; set; }
    }
}