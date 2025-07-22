using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class LecturersTestsDetailResponse
    {
        public int TestId { get; set; }

        public int LecturerId { get; set; }

        public double? Score { get; set; }

        public string? Reason { get; set; }

        public bool? isGrading { get; set; }

        public virtual UserResponse Lecturer { get; set; } = null!;
    }
}
