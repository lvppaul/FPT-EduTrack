using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class MeetingResponse
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? Link { get; set; }
        public int? MeetingStatusId { get; set; }
        public string? MeetingStatusName { get; set; }
         public  ICollection<MeetingDetailsResponse> MeetingDetails { get; set; } = new List<MeetingDetailsResponse>();
    }
}
