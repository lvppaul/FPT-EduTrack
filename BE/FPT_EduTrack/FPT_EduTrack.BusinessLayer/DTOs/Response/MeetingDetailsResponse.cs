using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class MeetingDetailsResponse
    {
        public int MeetingId { get; set; }
        public int UserId { get; set; }
        public  UserResponse User { get; set; } = null!;
    }
}
