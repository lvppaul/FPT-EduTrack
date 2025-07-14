using FPT_EduTrack.DataAccessLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class TestResponse
    {
        public int Id { get; set; }

        public string? Code { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }

        public string? Link { get; set; }

        public int? StudentId { get; set; }

        public virtual ICollection<LecturersTestsDetail> LecturersTestsDetails { get; set; } = new List<LecturersTestsDetail>();

        public virtual bool hasReport { get; set; } = false;

        public virtual string StudentName { get; set; }

        public virtual double TestsScores { get; set; } = 0.0;
    }
}
