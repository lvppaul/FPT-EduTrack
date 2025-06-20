using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Update
{
    public class ReportUpdate
    {
        [Required, MaxLength(100)]
        public string? Title { get; set; }
        [Required, MaxLength(500)]
        public string? Content { get; set; }

        public bool? IsDeleted { get; set; }

        public bool? IsSecond { get; set; }

        public int? StudentId { get; set; }

        public int? ReportStatusId { get; set; }

        public int? TestId { get; set; }
    }
}
