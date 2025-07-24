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

        public float? TestsScores { get; set; } 

        public int? ExamId { get; set; }

        public int? StudentId { get; set; }

        public virtual string? StudentName { get; set; }
    
        public virtual bool hasReport { get; set; } = false;
        

        public bool? isDeleted { get; set; } = false;

        public virtual ICollection<LecturersTestsDetailResponse> LecturersTestsDetailResponse { get; set; } = new List<LecturersTestsDetailResponse>();

       
    }
}
