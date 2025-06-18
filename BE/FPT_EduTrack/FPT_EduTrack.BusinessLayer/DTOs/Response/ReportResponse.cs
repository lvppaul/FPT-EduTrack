using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class ReportResponse
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }

        public bool? IsSecond { get; set; }

        public DateTime? CreatedAt { get; set; }

        public int? StudentId { get; set; }

        public int? TestId { get; set; }
    }
}
