using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class ReportResponse
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }

        public bool? IsDeleted { get; set; }

        public bool? IsSecond { get; set; }

        public DateTime? CreatedAt { get; set; }

        public int? StudentId { get; set; }

        public UserResponse? Student { get; set; }

        public int? TestId { get; set; }

        public TestResponse? Test { get; set; }

        public int? ReportStatusId { get; set; }
    }
}
