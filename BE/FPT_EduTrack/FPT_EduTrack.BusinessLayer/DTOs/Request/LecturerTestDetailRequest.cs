using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class LecturerTestDetailRequest
    {
        public int TestId { get; set; }

        public int LecturerId { get; set; }

        public double? Score { get; set; } = 0;

        public string? Reason { get; set; } = "No reason";

        public bool? isGrading { get; set; } = true;
    }
}
