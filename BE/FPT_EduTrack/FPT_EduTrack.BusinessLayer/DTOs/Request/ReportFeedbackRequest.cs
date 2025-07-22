using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class ReportFeedbackRequest
    {
        public int? ReportId { get; set; }

        public int? ExaminerId { get; set; }

        public string? Feedback { get; set; }

        public int? ReportFeedbackStatusId { get; set; }

        public double? ReExamScore { get; set; }
    }
}
