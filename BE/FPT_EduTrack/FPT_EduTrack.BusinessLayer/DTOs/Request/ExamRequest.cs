using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class ExamRequest
    {
        public string? Code { get; set; }

        public string? Name { get; set; }

        public int? ExaminerId { get; set; }

        public int? Duration { get; set; }

        public ExamStatus? Status { get; set; }
    }
}
