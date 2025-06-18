using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class ReportRequest
    {
        public string? Title { get; set; }

        public string? Content { get; set; }

        public int? StudentId { get; set; }


        public int? TestId { get; set; }
    }
}
