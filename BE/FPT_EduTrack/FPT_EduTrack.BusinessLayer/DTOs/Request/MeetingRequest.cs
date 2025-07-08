using GoogleCalendarAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class MeetingRequest
    {
        public string Summary { get; set; } = null!;
        public string Description { get; set; } = null!;

        public EventDateTimeInfo StartTime { get; set; }
        public EventDateTimeInfo EndTime { get; set; }

        public List<AttendeeInfo> AttendeeEmails { get; set; } = new();
    }
    public class EventDateTimeInfo
    {
        public DateTime DateTime { get; set; }
        [JsonIgnore]
        public string? TimeZone { get; set; } = "Asia/Ho_Chi_Minh";
    }
    public class AttendeeInfo
    {
        public string Email { get; set; } = null!;
    }
}
