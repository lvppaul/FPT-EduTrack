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
        [Required(ErrorMessage = "Title is required")]
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? ReportStatusId { get; set; }
    }
}
