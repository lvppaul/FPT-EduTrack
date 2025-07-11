using Microsoft.AspNetCore.Http;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class GradingFileRequest
    {
        public List<IFormFile>? GuidelineFiles { get; set; }
        public List<IFormFile>? TestFiles { get; set; }
        public string? TextInputValue { get; set; }

    }
}
