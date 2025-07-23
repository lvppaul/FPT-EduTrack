using FPT_EduTrack.BusinessLayer.DTOs.Request;
using System.ComponentModel.DataAnnotations;

namespace FPT_EduTrack.BusinessLayer.DTOs.Update
{
    public class MeetingUpdate
    {
        public string Summary { get; set; } = null!;
        public string Description { get; set; } = null!;

        public EventDateTimeInfo StartTime { get; set; }
        public EventDateTimeInfo EndTime { get; set; }
    }
}
