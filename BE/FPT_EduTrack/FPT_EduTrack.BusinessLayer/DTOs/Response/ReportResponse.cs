using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FPT_EduTrack.BusinessLayer.DTOs.Response
{
    public class ReportDataResponse
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Content { get; set; }

        public bool? IsDeleted { get; set; }

        public bool? IsSecond { get; set; }

        public DateTime? CreatedAt { get; set; }

        public int? StudentId { get; set; }

        public string? StudentName { get; set; }

        public string? StudentEmail { get; set; }

        public int? ReportStatusId { get; set; }

        public int? TestId { get; set; }

        public string? TestCode { get; set; }

        public string? TestTitle { get; set; }

        public string? TestContent { get; set; }

        public string? TestLink { get; set; }
    }

    public class ReportResponse 
    {
        public bool Success { get; set; } = true;
        public string Message { get; set; }
        public IEnumerable<ReportDataResponse> Data { get; set; } = new List<ReportDataResponse>();
        public int Count { get; set; } = 0;
    }
}
