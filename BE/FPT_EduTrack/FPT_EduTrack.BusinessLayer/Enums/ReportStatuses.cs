using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.Enums
{
    public static class ReportStatuses
    {
        public const int Pending = 1;
        public const int Grading= 2;
        public const int Graded = 3;
        public const int WaitingForMeeting = 4;
        public const int Confirmed = 5;
        public const int Rejected = 6;


    }
}
