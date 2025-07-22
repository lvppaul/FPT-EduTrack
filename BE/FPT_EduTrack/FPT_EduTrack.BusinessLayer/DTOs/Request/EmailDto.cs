using FPT_EduTrack.DataAccessLayer.Entities;

namespace FPT_EduTrack.BusinessLayer.DTOs.Request
{
    public class EmailDto : List<string>
    {
        public List<string> To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}