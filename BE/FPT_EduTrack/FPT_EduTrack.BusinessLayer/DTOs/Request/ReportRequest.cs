using System.ComponentModel.DataAnnotations;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class ReportRequest
    {
        [Required(ErrorMessage ="Title is required")]
        public string Title { get; set; }

        public string? Content { get; set; }

        [Required(ErrorMessage = "StudentId is required.")]
        public int StudentId { get; set; }
        [Required(ErrorMessage = "TestId is required.")]
        public int TestId { get; set; }
    }

    public class GetReportInExam
    {
        public int StudentId { get; set; }
        public int TestId { get; set; }
    }
}
