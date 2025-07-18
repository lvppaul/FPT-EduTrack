using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class ExamResponse
    {
        public int Id { get; set; }

        public string? Code { get; set; }

        public DateTime? CreatedAt { get; set; }

        public string? Name { get; set; }

        public int? ExaminerId { get; set; }

        public string? ExaminerName { get; set; }

        public int? Duration { get; set; }

        public bool? IsDeleted { get; set; }
        public ICollection<TestResponse> Test { get; set; } = new List<TestResponse>();
    }
}
