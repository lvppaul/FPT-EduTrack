namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class GradingAIResponse
    {
        public bool Success { get; set; }
        public GradingResponse Grading { get; set; } = new GradingResponse();
        public int GuidelineFilesProcessed { get; set; }
        public List<string> GuidelineUploadedFiles { get; set; } = new List<string>();
        public string[] OriginalGuidelineFileNames { get; set; } = Array.Empty<string>();
        public int TestFilesProcessed { get; set; }
        public List<string> TestUploadedFiles { get; set; } = new List<string>();
        public string[] OriginalTestFileNames { get; set; } = Array.Empty<string>();
    }
}
