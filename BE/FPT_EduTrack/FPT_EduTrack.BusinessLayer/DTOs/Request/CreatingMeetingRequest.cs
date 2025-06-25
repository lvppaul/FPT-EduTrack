using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class CreateMeetingRequest
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;

        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }

        public List<string> AttendeeEmails { get; set; } = new();
        public string? OrganizerEmail { get; set; } = null!;
    }

}
